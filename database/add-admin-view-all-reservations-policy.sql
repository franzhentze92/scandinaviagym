-- ============================================
-- MIGRATION: Allow admins to view all class reservations
-- ============================================
-- Description: Adds a policy to allow users with admin role to view all class reservations
-- Date: 2024

-- Note: This script uses the existing is_admin_user() function that was created
-- in add-admin-view-all-users-policy.sql. If that function doesn't exist, 
-- run that script first.

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Admins can view all reservations" ON class_reservations;

-- Create policy for admins to view all reservations
-- Note: RLS policies are combined with OR, so this works alongside "Users can view own reservations"
-- This means:
-- 1. Admins can view ALL reservations (using is_admin_user() function)
-- 2. Regular users can still view their own reservations (using the existing policy)
CREATE POLICY "Admins can view all reservations" ON class_reservations
  FOR SELECT 
  USING (is_admin_user());

-- Add comment
COMMENT ON POLICY "Admins can view all reservations" ON class_reservations IS 
  'Allows users with admin role to view all class reservations for administration purposes';

