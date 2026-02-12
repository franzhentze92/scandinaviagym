-- ============================================
-- ⚠️ EJECUTA ESTO PRIMERO EN SUPABASE ⚠️
-- ============================================
-- Ve al SQL Editor de Supabase y ejecuta este script completo
-- ============================================

-- 1. Agregar columna gym_code
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS gym_code TEXT;

-- 2. Agregar columna role
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin'));

-- 3. Actualizar usuarios existentes
UPDATE user_profiles 
SET role = 'client' 
WHERE role IS NULL;

-- 4. Verificar que se agregaron las columnas
SELECT 
  column_name, 
  data_type, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
  AND column_name IN ('gym_code', 'role')
ORDER BY column_name;

