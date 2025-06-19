-- Create the school_research table
CREATE TABLE IF NOT EXISTS public.school_research (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES public.user_school_lists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies
ALTER TABLE public.school_research ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own research notes"
  ON public.school_research
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own research notes"
  ON public.school_research
  FOR ALL
  USING (auth.uid() = user_id);

-- Add indexes
CREATE INDEX idx_school_research_user ON public.school_research(user_id);
CREATE INDEX idx_school_research_school ON public.school_research(school_id); 