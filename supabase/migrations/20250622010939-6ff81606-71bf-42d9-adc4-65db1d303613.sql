
-- Update the handle_new_user function to read role from user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  user_role public.app_role;
BEGIN
  -- Get role from user metadata, default to 'student' if not provided
  user_role := COALESCE(
    (NEW.raw_user_meta_data ->> 'role')::public.app_role,
    'student'::public.app_role
  );

  -- Insert into profiles table
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email
  );
  
  -- Assign the selected role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);
  
  RETURN NEW;
END;
$$;
