-- ============================================
-- MIGRATION: Add additional columns to membership_plans
-- ============================================
-- Description: Adds enrollment_fee and loyalty_months columns to membership_plans table
-- Date: 2024

-- Add enrollment_fee column if it doesn't exist
ALTER TABLE membership_plans 
ADD COLUMN IF NOT EXISTS enrollment_fee DECIMAL(10, 2) DEFAULT 0;

-- Add loyalty_months column if it doesn't exist
ALTER TABLE membership_plans 
ADD COLUMN IF NOT EXISTS loyalty_months INTEGER DEFAULT 0;

-- Add comment
COMMENT ON COLUMN membership_plans.enrollment_fee IS 'Cuota de inscripción del plan';
COMMENT ON COLUMN membership_plans.loyalty_months IS 'Meses de lealtad requeridos para el plan';

