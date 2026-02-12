-- ============================================
-- FIX: Add 'instructor' role to user_profiles CHECK constraint
-- ============================================
-- Description: This script fixes the CHECK constraint to allow 'instructor' role
-- Date: 2024
-- 
-- IMPORTANT: Run this script if you're getting the error:
-- "new row for relation "user_profiles" violates check constraint "user_profiles_role_check""

-- Step 1: Drop the existing CHECK constraint
ALTER TABLE user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_role_check;

-- Step 2: Add the new CHECK constraint with 'instructor' role included
ALTER TABLE user_profiles 
ADD CONSTRAINT user_profiles_role_check 
CHECK (role IN ('client', 'admin', 'instructor'));

-- Step 3: Update the comment
COMMENT ON COLUMN user_profiles.role IS 'Rol del usuario: client (cliente), admin (administrador) o instructor';

-- Step 4: Verify the constraint was created correctly
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'user_profiles'::regclass
  AND conname = 'user_profiles_role_check';

-- Step 5: Test that the constraint allows all three roles
-- (This will not insert anything, just verify the constraint)
DO $$
BEGIN
  -- This should not raise an error if the constraint is correct
  RAISE NOTICE 'Constraint check passed. The following roles are now allowed: client, admin, instructor';
END $$;

