-- ============================================
-- FIX: Simple admin policy without recursion
-- ============================================
-- This version avoids circular dependencies by using a simpler approach

-- Drop existing policy and function
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP FUNCTION IF EXISTS is_admin_user();

-- Create a simpler function that checks role directly
-- We use SECURITY DEFINER to bypass RLS when checking
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

-- Grant execute permission
GRANT EXECUTE ON FUNCTION is_admin_user() TO authenticated;

-- Create the policy
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT 
  USING (is_admin_user());

