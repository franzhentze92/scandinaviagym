-- Migration: Add gym_code column to user_profiles table
-- Date: 2024
-- Description: Adds a gym_code field to store the code provided by the gym when users register

-- Add gym_code column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS gym_code TEXT;

-- Add a comment to document the column
COMMENT ON COLUMN user_profiles.gym_code IS 'Código proporcionado por el gimnasio al inscribirse';

