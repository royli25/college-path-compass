
-- Add deadline field to user_school_lists table if it doesn't exist
-- (checking if column exists first to avoid errors)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_school_lists' 
                   AND column_name = 'application_deadline') THEN
        ALTER TABLE user_school_lists ADD COLUMN application_deadline DATE;
    END IF;
END $$;

-- Remove deadline field from essays table since deadlines will now be associated with schools
ALTER TABLE essays DROP COLUMN IF EXISTS deadline;
