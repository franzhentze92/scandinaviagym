-- Migration: Add role column to user_profiles table
-- Date: 2024
-- Description: Adds a role field to differentiate between clients and admins

-- Add role column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin'));

-- Update existing users to have 'client' role (if column was just added)
UPDATE user_profiles 
SET role = 'client' 
WHERE role IS NULL;

-- Add a comment to document the column
COMMENT ON COLUMN user_profiles.role IS 'Rol del usuario: client (cliente) o admin (administrador)';

