-- ============================================
-- MIGRATION: Insert default membership plans
-- ============================================
-- Description: Inserts the default PLUS and FLEX membership plans
-- Date: 2024

-- Insert PLUS plan (if it doesn't exist)
-- Using a subquery to check if the plan already exists
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

-- Insert FLEX plan (if it doesn't exist)
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

-- Note: ON CONFLICT DO NOTHING will prevent duplicates if run multiple times
-- If you want to update existing plans, you can use:
-- ON CONFLICT (name) DO UPDATE SET ...

