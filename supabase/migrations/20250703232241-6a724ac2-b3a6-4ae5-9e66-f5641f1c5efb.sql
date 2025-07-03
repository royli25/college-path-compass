
-- Remove the deadline field from the essays table since deadlines should be at university level
ALTER TABLE public.essays DROP COLUMN IF EXISTS deadline;
