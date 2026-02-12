-- ============================================
-- FIX: Remove problematic policy and recreate correctly
-- ============================================
-- This script removes the problematic policy and recreates it correctly
-- so it doesn't interfere with existing policies

-- Step 1: Remove the problematic policy
DROP POLICY IF EXISTS "Users can view evaluation creator name" ON user_profiles;

-- Step 2: Ensure the is_admin_user function exists
-- Use CREATE OR REPLACE instead of DROP to avoid breaking dependent policies
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Get the role directly from the table, bypassing RLS
  SELECT role INTO user_role
  FROM user_profiles
  WHERE id = auth.uid();
  
  RETURN user_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

GRANT EXECUTE ON FUNCTION is_admin_user() TO authenticated;

-- Step 3: Ensure existing policies are in place
-- Users can view own profile
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Admins can view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (is_admin_user());

-- Step 4: Add the evaluation creator policy (ADDITIVE, not replacing)
CREATE POLICY "Users can view evaluation creator name" ON user_profiles
  FOR SELECT
  USING (
    -- Allow if the user has an evaluation created by this user
    EXISTS (
      SELECT 1 
      FROM clinical_evaluations 
      WHERE clinical_evaluations.user_id = auth.uid()
      AND clinical_evaluations.created_by = user_profiles.id
    )
  );

-- Verify policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY policyname;

