
-- Phase 1 & 2: Set up authentication tables and user roles system

-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'student');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Create schools_catalog table (master list managed by admins)
CREATE TABLE public.schools_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  type TEXT, -- reach, target, safety
  acceptance_rate TEXT,
  tuition TEXT,
  ranking TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, location)
);

-- Rename existing schools table to user_school_lists
ALTER TABLE public.schools RENAME TO user_school_lists;

-- Add reference to schools_catalog in user_school_lists
ALTER TABLE public.user_school_lists 
ADD COLUMN school_catalog_id UUID REFERENCES public.schools_catalog(id);

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role 
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1
$$;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email
  );
  
  -- Assign default student role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_school_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.essays ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for schools_catalog
CREATE POLICY "Everyone can view schools catalog" ON public.schools_catalog
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can manage schools catalog" ON public.schools_catalog
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_school_lists
CREATE POLICY "Users can view own school lists" ON public.user_school_lists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own school lists" ON public.user_school_lists
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all school lists" ON public.user_school_lists
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for essays
CREATE POLICY "Users can view own essays" ON public.essays
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own essays" ON public.essays
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all essays" ON public.essays
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Insert some sample schools into the catalog
INSERT INTO public.schools_catalog (name, location, type, acceptance_rate, tuition, ranking) VALUES
('Harvard University', 'Cambridge, MA', 'reach', '3%', '$59,076', '#2 National Universities'),
('Stanford University', 'Stanford, CA', 'reach', '4%', '$61,731', '#6 National Universities'),
('University of California, Berkeley', 'Berkeley, CA', 'target', '17%', '$14,226', '#22 National Universities'),
('University of Michigan', 'Ann Arbor, MI', 'target', '23%', '$17,569', '#23 National Universities'),
('Arizona State University', 'Tempe, AZ', 'safety', '88%', '$12,691', '#103 National Universities');
