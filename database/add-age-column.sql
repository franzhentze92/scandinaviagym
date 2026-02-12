-- ============================================
-- ADD AGE COLUMN TO USER_PROFILES
-- ============================================
-- Adds an age field to store the user's age directly

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS age INTEGER;

-- Add comment
COMMENT ON COLUMN user_profiles.age IS 'User age in years';

