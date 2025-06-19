-- Remove the 'type' column from user_school_lists and schools_catalog tables
ALTER TABLE user_school_lists DROP COLUMN IF EXISTS type;
ALTER TABLE schools_catalog DROP COLUMN IF EXISTS type; 