-- ============================================
-- MIGRATION: Allow admins to view all user profiles
-- ============================================
-- Description: Adds a policy to allow users with admin role to view all user profiles
-- Date: 2024

-- First, drop the function if it exists (in case we need to recreate it)
DROP FUNCTION IF EXISTS is_admin_user();

-- Create a function to check if current user is admin
-- Using SECURITY DEFINER to bypass RLS when checking the role
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;

-- Create policy for admins to view all user profiles
-- Note: RLS policies are combined with OR, so this works alongside "Users can view own profile"
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT 
  USING (is_admin_user());

-- Add comment
COMMENT ON POLICY "Admins can view all profiles" ON user_profiles IS 
  'Allows users with admin role to view all user profiles for administration purposes';

