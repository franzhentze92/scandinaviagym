-- ============================================
-- SCRIPT: Create user accounts for all instructors
-- ============================================
-- Description: Creates auth users and profiles for all instructors in the instructors table
-- IMPORTANT: This script requires manual execution or use of Supabase Admin API
-- 
-- NOTE: Direct insertion into auth.users is restricted in Supabase.
-- You have two options:
-- 1. Use Supabase Admin API (recommended)
-- 2. Use the Supabase Dashboard to create users manually
--
-- This script provides the SQL to create the user_profiles once users are created in auth.users
-- ============================================

-- Step 1: Create a temporary table to store instructor data that needs users
CREATE TEMP TABLE IF NOT EXISTS instructors_to_create_users AS
SELECT 
  id as instructor_id,
  name,
  email,
  phone,
  sede_id,
  bio
FROM instructors
WHERE email IS NOT NULL 
  AND email != ''
  AND NOT EXISTS (
    -- Check if user already exists
    SELECT 1 FROM user_profiles 
    WHERE email = instructors.email
  );

-- Step 2: Function to create user profile for instructor
-- This will be called after creating the auth user
CREATE OR REPLACE FUNCTION create_instructor_profile(
  p_user_id UUID,
  p_email TEXT,
  p_full_name TEXT,
  p_phone TEXT,
  p_sede_id UUID,
  p_bio TEXT
)
RETURNS void AS $$
BEGIN
  INSERT INTO user_profiles (
    id,
    email,
    full_name,
    phone,
    sede_id,
    role,
    created_at,
    updated_at
  )
  VALUES (
    p_user_id,
    p_email,
    p_full_name,
    p_phone,
    p_sede_id,
    'instructor',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    role = 'instructor',
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    sede_id = EXCLUDED.sede_id,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Display the list of instructors that need user accounts
-- This will show you what needs to be created
SELECT 
  instructor_id,
  name,
  email,
  phone,
  'Password: TempPass' || instructor_id::text AS suggested_password
FROM instructors_to_create_users
ORDER BY name;

-- ============================================
-- INSTRUCTIONS FOR CREATING USERS:
-- ============================================
-- 
-- OPTION 1: Using Supabase Dashboard
-- 1. Go to Authentication > Users in Supabase Dashboard
-- 2. For each instructor in the list above:
--    - Click "Add User" > "Create new user"
--    - Enter the email from the list
--    - Set a temporary password (you can use the suggested password or generate one)
--    - Click "Create User"
--    - Copy the User ID (UUID)
--    - Run the function below with that User ID
--
-- OPTION 2: Using Supabase Admin API (via code)
-- You can use the Supabase Admin API to create users programmatically.
-- See the example script: database/create-instructor-users-api.js
--
-- ============================================
-- AFTER CREATING AUTH USERS, RUN THIS:
-- ============================================
--
-- For each instructor, after creating the auth user, run:
--
-- SELECT create_instructor_profile(
--   'USER_ID_FROM_AUTH',  -- Replace with the UUID from auth.users
--   'instructor@email.com',  -- Replace with instructor email
--   'Instructor Name',  -- Replace with instructor name
--   '+502 0000-0000',  -- Replace with instructor phone (or NULL)
--   'sede-uuid-here',  -- Replace with sede_id (or NULL)
--   'Bio text here'  -- Replace with bio (or NULL)
-- );
--
-- ============================================
-- BULK UPDATE (if you have the user IDs):
-- ============================================
-- If you have a mapping of instructor emails to user IDs, you can run:
--
-- UPDATE user_profiles up
-- SET 
--   role = 'instructor',
--   full_name = i.name,
--   phone = i.phone,
--   sede_id = i.sede_id,
--   updated_at = NOW()
-- FROM instructors i
-- WHERE up.email = i.email
--   AND i.email IS NOT NULL
--   AND i.email != '';

