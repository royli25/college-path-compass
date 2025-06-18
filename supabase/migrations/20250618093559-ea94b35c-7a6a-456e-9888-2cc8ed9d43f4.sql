
-- Expand the profiles table to include comprehensive profile fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS gender text,
ADD COLUMN IF NOT EXISTS citizenship text,
ADD COLUMN IF NOT EXISTS race_ethnicity text,
ADD COLUMN IF NOT EXISTS first_generation boolean,
ADD COLUMN IF NOT EXISTS income_bracket text,
ADD COLUMN IF NOT EXISTS high_school text,
ADD COLUMN IF NOT EXISTS class_rank text,
ADD COLUMN IF NOT EXISTS gpa_unweighted numeric(3,2),
ADD COLUMN IF NOT EXISTS gpa_weighted numeric(3,2),
ADD COLUMN IF NOT EXISTS sat_act_score text,
ADD COLUMN IF NOT EXISTS ap_ib_courses text[],
ADD COLUMN IF NOT EXISTS current_courses text[],
ADD COLUMN IF NOT EXISTS activities jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS leadership_positions text[],
ADD COLUMN IF NOT EXISTS years_involved integer,
ADD COLUMN IF NOT EXISTS honors_awards jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS achievement_levels text[];

-- Add index for better performance on profile queries
CREATE INDEX IF NOT EXISTS idx_profiles_user_completion ON public.profiles(id) WHERE full_name IS NOT NULL;
