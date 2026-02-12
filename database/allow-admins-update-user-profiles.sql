-- ============================================
-- ALLOW ADMINS TO UPDATE USER PROFILES
-- ============================================
-- Description: Adds RLS policy to allow admins to update any user profile, including role
-- Date: 2024

-- Ensure the is_admin_user function exists
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

-- Allow admins to update any user profile (including role)
DROP POLICY IF EXISTS "Admins can update any profile" ON user_profiles;
CREATE POLICY "Admins can update any profile" ON user_profiles
  FOR UPDATE 
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

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

