-- Modify ap_ib_courses to store objects with course name and score
-- First, create a temporary column with the new structure
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS ap_ib_courses_with_scores jsonb DEFAULT '[]'::jsonb;

-- Update existing data to convert string array to object array
UPDATE public.profiles 
SET ap_ib_courses_with_scores = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'course', course_name,
      'score', null
    )
  )
  FROM unnest(ap_ib_courses) AS course_name
)
WHERE ap_ib_courses IS NOT NULL AND array_length(ap_ib_courses, 1) > 0;

-- Drop the old column and rename the new one
ALTER TABLE public.profiles DROP COLUMN IF EXISTS ap_ib_courses;
ALTER TABLE public.profiles RENAME COLUMN ap_ib_courses_with_scores TO ap_ib_courses; 