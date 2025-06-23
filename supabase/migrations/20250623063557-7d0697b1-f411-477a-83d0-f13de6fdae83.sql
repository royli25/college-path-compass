
-- Create a table for weekly tasks/todos
CREATE TABLE public.weekly_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  week_start_date DATE NOT NULL,
  week_goal TEXT,
  tasks JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week_start_date)
);

-- Enable RLS
ALTER TABLE public.weekly_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for users to manage their own weekly tasks
CREATE POLICY "Users can view their own weekly tasks" 
  ON public.weekly_tasks 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own weekly tasks" 
  ON public.weekly_tasks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly tasks" 
  ON public.weekly_tasks 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weekly tasks" 
  ON public.weekly_tasks 
  FOR DELETE 
  USING (auth.uid() = user_id);
