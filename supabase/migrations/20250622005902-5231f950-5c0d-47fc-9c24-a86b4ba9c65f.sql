
-- Create advisor-student relationship requests table
CREATE TABLE public.advisor_student_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(advisor_id, student_id)
);

-- Create active advisor-student relationships table
CREATE TABLE public.advisor_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(advisor_id, student_id)
);

-- Create advisor notes table
CREATE TABLE public.advisor_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create advisor tasks table
CREATE TABLE public.advisor_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create essay feedback table
CREATE TABLE public.essay_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  essay_id UUID REFERENCES public.essays(id) ON DELETE CASCADE NOT NULL,
  advisor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  position_start INTEGER,
  position_end INTEGER,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all new tables
ALTER TABLE public.advisor_student_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisor_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisor_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisor_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.essay_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for advisor_student_requests
CREATE POLICY "Users can view requests involving them" ON public.advisor_student_requests
  FOR SELECT USING (auth.uid() = advisor_id OR auth.uid() = student_id);

CREATE POLICY "Advisors can create requests" ON public.advisor_student_requests
  FOR INSERT WITH CHECK (auth.uid() = advisor_id AND public.has_role(auth.uid(), 'advisor'));

CREATE POLICY "Students can update request status" ON public.advisor_student_requests
  FOR UPDATE USING (auth.uid() = student_id);

-- RLS Policies for advisor_students
CREATE POLICY "Users can view their relationships" ON public.advisor_students
  FOR SELECT USING (auth.uid() = advisor_id OR auth.uid() = student_id);

CREATE POLICY "System can manage relationships" ON public.advisor_students
  FOR ALL USING (true);

-- RLS Policies for advisor_notes
CREATE POLICY "Advisors can manage their notes" ON public.advisor_notes
  FOR ALL USING (auth.uid() = advisor_id AND public.has_role(auth.uid(), 'advisor'));

-- RLS Policies for advisor_tasks
CREATE POLICY "Advisors can manage their tasks" ON public.advisor_tasks
  FOR ALL USING (auth.uid() = advisor_id AND public.has_role(auth.uid(), 'advisor'));

CREATE POLICY "Students can view their tasks" ON public.advisor_tasks
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can update task status" ON public.advisor_tasks
  FOR UPDATE USING (auth.uid() = student_id);

-- RLS Policies for essay_feedback
CREATE POLICY "Advisors can manage feedback on assigned students" ON public.essay_feedback
  FOR ALL USING (
    auth.uid() = advisor_id AND 
    EXISTS (
      SELECT 1 FROM public.advisor_students 
      WHERE advisor_id = auth.uid() 
      AND student_id = (SELECT user_id FROM public.essays WHERE id = essay_id)
    )
  );

CREATE POLICY "Students can view feedback on their essays" ON public.essay_feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.essays 
      WHERE id = essay_id AND user_id = auth.uid()
    )
  );
