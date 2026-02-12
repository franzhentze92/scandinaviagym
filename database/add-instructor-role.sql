-- ============================================
-- MIGRATION: Add 'instructor' role to user_profiles
-- ============================================
-- Description: Adds 'instructor' as a valid role option in user_profiles
-- Date: 2024

-- First, drop the existing CHECK constraint
ALTER TABLE user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_role_check;

-- Add the new CHECK constraint with 'instructor' role included
ALTER TABLE user_profiles 
ADD CONSTRAINT user_profiles_role_check 
CHECK (role IN ('client', 'admin', 'instructor'));

-- Update the comment
COMMENT ON COLUMN user_profiles.role IS 'Rol del usuario: client (cliente), admin (administrador) o instructor';

