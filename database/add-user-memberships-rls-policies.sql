-- ============================================
-- RLS POLICIES FOR user_memberships
-- ============================================
-- This script adds the necessary RLS policies to allow users to:
-- 1. View their own memberships (already exists)
-- 2. Create their own memberships (NEW)
-- 3. Update their own memberships (NEW)
-- 4. Admins can view all memberships (NEW)
-- 5. Admins can create/update/delete any membership (NEW)

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

-- Users can view their own memberships (already exists, but ensuring it's there)
DROP POLICY IF EXISTS "Users can view own memberships" ON user_memberships;
CREATE POLICY "Users can view own memberships" ON user_memberships
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own memberships
DROP POLICY IF EXISTS "Users can create own memberships" ON user_memberships;
CREATE POLICY "Users can create own memberships" ON user_memberships
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own memberships
DROP POLICY IF EXISTS "Users can update own memberships" ON user_memberships;
CREATE POLICY "Users can update own memberships" ON user_memberships
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all memberships
DROP POLICY IF EXISTS "Admins can view all memberships" ON user_memberships;
CREATE POLICY "Admins can view all memberships" ON user_memberships
  FOR SELECT USING (is_admin_user());

-- Admins can create any membership
DROP POLICY IF EXISTS "Admins can create any membership" ON user_memberships;
CREATE POLICY "Admins can create any membership" ON user_memberships
  FOR INSERT WITH CHECK (is_admin_user());

-- Admins can update any membership
DROP POLICY IF EXISTS "Admins can update any membership" ON user_memberships;
CREATE POLICY "Admins can update any membership" ON user_memberships
  FOR UPDATE 
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- Admins can delete any membership
DROP POLICY IF EXISTS "Admins can delete any membership" ON user_memberships;
CREATE POLICY "Admins can delete any membership" ON user_memberships
  FOR DELETE USING (is_admin_user());

