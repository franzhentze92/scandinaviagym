-- ============================================
-- MIGRATION: Allow admins to view and update all support tickets
-- ============================================
-- Description: Adds policies to allow users with admin role to view and update all support tickets
-- Date: 2026-02-12

-- Note: This script uses the existing is_admin_user() function that was created
-- in add-admin-view-all-users-policy.sql. If that function doesn't exist, 
-- run that script first.

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view all tickets" ON support_tickets;
DROP POLICY IF EXISTS "Admins can update all tickets" ON support_tickets;

-- Create policy for admins to view all tickets
-- Note: RLS policies are combined with OR, so this works alongside "Users can view own tickets"
-- This means:
-- 1. Admins can view ALL tickets (using is_admin_user() function)
-- 2. Regular users can still view their own tickets (using the existing policy)
CREATE POLICY "Admins can view all tickets" ON support_tickets
  FOR SELECT 
  USING (is_admin_user());

-- Create policy for admins to update all tickets
-- This allows admins to change the status of any ticket
CREATE POLICY "Admins can update all tickets" ON support_tickets
  FOR UPDATE 
  USING (is_admin_user());

-- Add comments
COMMENT ON POLICY "Admins can view all tickets" ON support_tickets IS 
  'Allows users with admin role to view all support tickets for administration purposes';

COMMENT ON POLICY "Admins can update all tickets" ON support_tickets IS 
  'Allows users with admin role to update all support tickets (e.g., change status) for administration purposes';

