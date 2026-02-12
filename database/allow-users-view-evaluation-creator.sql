-- ============================================
-- ALLOW USERS TO VIEW EVALUATION CREATOR NAME
-- ============================================
-- This policy allows users to view the full_name of the user who created
-- their clinical evaluations, even if they can't see other user profiles
-- 
-- IMPORTANT: This policy works ALONGSIDE existing policies (they are combined with OR)
-- It does NOT replace "Users can view own profile" or "Admins can view all profiles"

-- Ensure the is_admin_user function exists (from add-admin-view-all-users-policy.sql)
-- If it doesn't exist, create it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'is_admin_user'
  ) THEN
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
  END IF;
END $$;

-- Policy to allow users to see creator's full_name when viewing their own evaluations
-- This works alongside existing policies (Users can view own profile, Admins can view all profiles)
DROP POLICY IF EXISTS "Users can view evaluation creator name" ON user_profiles;
CREATE POLICY "Users can view evaluation creator name" ON user_profiles
  FOR SELECT
  USING (
    -- Allow if the user has an evaluation created by this user
    -- This allows clients to see the name of the admin who created their evaluation
    EXISTS (
      SELECT 1 
      FROM clinical_evaluations 
      WHERE clinical_evaluations.user_id = auth.uid()
      AND clinical_evaluations.created_by = user_profiles.id
    )
  );

-- Note: This policy is ADDITIVE - it works alongside:
-- - "Users can view own profile" (auth.uid() = id)
-- - "Admins can view all profiles" (is_admin_user())
-- All policies are combined with OR, so any matching policy grants access

