-- ============================================
-- MIGRATION: Setup membership plans table and insert default plans
-- ============================================
-- Description: Adds enrollment_fee and loyalty_months columns, then inserts default plans
-- Date: 2024
-- IMPORTANT: Run this script in order, or run this combined script

-- Step 1: Add enrollment_fee column if it doesn't exist
ALTER TABLE membership_plans 
ADD COLUMN IF NOT EXISTS enrollment_fee DECIMAL(10, 2) DEFAULT 0;

-- Step 2: Add loyalty_months column if it doesn't exist
ALTER TABLE membership_plans 
ADD COLUMN IF NOT EXISTS loyalty_months INTEGER DEFAULT 0;

-- Step 3: Add comments
COMMENT ON COLUMN membership_plans.enrollment_fee IS 'Cuota de inscripción del plan';
COMMENT ON COLUMN membership_plans.loyalty_months IS 'Meses de lealtad requeridos para el plan';

-- Step 4: Insert PLUS plan (if it doesn't exist)
INSERT INTO membership_plans (name, description, price, currency, duration_days, enrollment_fee, loyalty_months, features, is_active)
SELECT 
  'PLUS',
  'Plan Premium con todos los beneficios',
  250.00,
  'GTQ',
  30, -- 1 month
  50.00,
  12,
  '{
    "cardio": true,
    "pesas": true,
    "clasesBaile": true,
    "clasesFunctional": true,
    "clasesSpinning": true,
    "sauna": true,
    "cuotaMantenimiento": true,
    "evaluacionFisica": true,
    "invitaAmigo": true,
    "ingresoOtrasSedes": true,
    "parqueoGratis": true
  }'::jsonb,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM membership_plans WHERE name = 'PLUS'
);

-- Step 5: Insert FLEX plan (if it doesn't exist)
INSERT INTO membership_plans (name, description, price, currency, duration_days, enrollment_fee, loyalty_months, features, is_active)
SELECT 
  'FLEX',
  'Plan Flexible con beneficios básicos',
  199.00,
  'GTQ',
  30, -- 1 month
  100.00,
  2,
  '{
    "cardio": true,
    "pesas": true,
    "clasesBaile": true,
    "clasesFunctional": true,
    "clasesSpinning": true,
    "sauna": true,
    "cuotaMantenimiento": true,
    "evaluacionFisica": false,
    "invitaAmigo": false,
    "ingresoOtrasSedes": false,
    "parqueoGratis": true
  }'::jsonb,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM membership_plans WHERE name = 'FLEX'
);

