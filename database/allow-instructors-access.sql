-- ============================================
-- ALLOW INSTRUCTORS TO ACCESS RESERVATIONS, EVALUATIONS, AND ROUTINES
-- ============================================
-- Description: Adds RLS policies to allow instructors to view and manage
-- class reservations, clinical evaluations, and workout routines
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

-- Create function to check if user is instructor
CREATE OR REPLACE FUNCTION is_instructor_user()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Get the role directly from the table, bypassing RLS
  SELECT role INTO user_role
  FROM user_profiles
  WHERE id = auth.uid();
  
  RETURN user_role = 'instructor';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

GRANT EXECUTE ON FUNCTION is_instructor_user() TO authenticated;

-- ============================================
-- CLASS RESERVATIONS
-- ============================================

-- Instructors can view all reservations
DROP POLICY IF EXISTS "Instructors can view all reservations" ON class_reservations;
CREATE POLICY "Instructors can view all reservations" ON class_reservations
  FOR SELECT 
  USING (is_instructor_user());

-- Instructors can create reservations (for clients)
DROP POLICY IF EXISTS "Instructors can create reservations" ON class_reservations;
CREATE POLICY "Instructors can create reservations" ON class_reservations
  FOR INSERT 
  WITH CHECK (is_instructor_user());

-- Instructors can update reservations
DROP POLICY IF EXISTS "Instructors can update reservations" ON class_reservations;
CREATE POLICY "Instructors can update reservations" ON class_reservations
  FOR UPDATE 
  USING (is_instructor_user())
  WITH CHECK (is_instructor_user());

-- Instructors can delete reservations
DROP POLICY IF EXISTS "Instructors can delete reservations" ON class_reservations;
CREATE POLICY "Instructors can delete reservations" ON class_reservations
  FOR DELETE 
  USING (is_instructor_user());

-- ============================================
-- CLINICAL EVALUATIONS
-- ============================================

-- Instructors can view all evaluations
DROP POLICY IF EXISTS "Instructors can view all evaluations" ON clinical_evaluations;
CREATE POLICY "Instructors can view all evaluations" ON clinical_evaluations
  FOR SELECT 
  USING (is_instructor_user());

-- Instructors can create evaluations
DROP POLICY IF EXISTS "Instructors can create evaluations" ON clinical_evaluations;
CREATE POLICY "Instructors can create evaluations" ON clinical_evaluations
  FOR INSERT 
  WITH CHECK (is_instructor_user());

-- Instructors can update evaluations
DROP POLICY IF EXISTS "Instructors can update evaluations" ON clinical_evaluations;
CREATE POLICY "Instructors can update evaluations" ON clinical_evaluations
  FOR UPDATE 
  USING (is_instructor_user())
  WITH CHECK (is_instructor_user());

-- Instructors can delete evaluations
DROP POLICY IF EXISTS "Instructors can delete evaluations" ON clinical_evaluations;
CREATE POLICY "Instructors can delete evaluations" ON clinical_evaluations
  FOR DELETE 
  USING (is_instructor_user());

-- ============================================
-- WORKOUT ROUTINES
-- ============================================

-- Instructors can view all routines
DROP POLICY IF EXISTS "Instructors can view all routines" ON workout_routines;
CREATE POLICY "Instructors can view all routines" ON workout_routines
  FOR SELECT 
  USING (is_instructor_user());

-- Instructors can create routines
DROP POLICY IF EXISTS "Instructors can create routines" ON workout_routines;
CREATE POLICY "Instructors can create routines" ON workout_routines
  FOR INSERT 
  WITH CHECK (is_instructor_user());

-- Instructors can update routines
DROP POLICY IF EXISTS "Instructors can update routines" ON workout_routines;
CREATE POLICY "Instructors can update routines" ON workout_routines
  FOR UPDATE 
  USING (is_instructor_user())
  WITH CHECK (is_instructor_user());

-- Instructors can delete routines
DROP POLICY IF EXISTS "Instructors can delete routines" ON workout_routines;
CREATE POLICY "Instructors can delete routines" ON workout_routines
  FOR DELETE 
  USING (is_instructor_user());

-- ============================================
-- USER PROFILES - Allow instructors to view all profiles
-- ============================================
-- Instructors need to view user profiles when viewing reservations, evaluations, and routines

-- Instructors can view all profiles (needed for JOINs in queries)
DROP POLICY IF EXISTS "Instructors can view all profiles" ON user_profiles;
CREATE POLICY "Instructors can view all profiles" ON user_profiles
  FOR SELECT 
  USING (is_instructor_user());

-- ============================================
-- VERIFY POLICIES
-- ============================================

-- Verify class_reservations policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'class_reservations'
ORDER BY policyname;

-- Verify clinical_evaluations policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'clinical_evaluations'
ORDER BY policyname;

-- Verify workout_routines policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'workout_routines'
ORDER BY policyname;

-- Verify user_profiles policies (should include instructor access)
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY policyname;

