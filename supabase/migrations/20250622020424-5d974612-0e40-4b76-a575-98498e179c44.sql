
-- Add a unique student_id field to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN student_id TEXT UNIQUE;

-- Create an index for faster searches
CREATE INDEX idx_profiles_student_id ON public.profiles(student_id);

-- Add a comment to explain the field
COMMENT ON COLUMN public.profiles.student_id IS 'Unique student identifier chosen by user during signup';
