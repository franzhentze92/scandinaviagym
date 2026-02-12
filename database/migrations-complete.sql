-- ============================================
-- MIGRACIONES COMPLETAS PARA SCANDINAVIA GYM
-- ============================================
-- Ejecuta estos scripts en orden en el SQL Editor de Supabase
-- ============================================

-- ============================================
-- 1. AGREGAR COLUMNA gym_code
-- ============================================
-- Agrega la columna gym_code para almacenar el código del gimnasio

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS gym_code TEXT;

COMMENT ON COLUMN user_profiles.gym_code IS 'Código proporcionado por el gimnasio al inscribirse';

-- ============================================
-- 2. AGREGAR COLUMNA role
-- ============================================
-- Agrega la columna role para diferenciar entre clientes y administradores

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin'));

-- Actualizar usuarios existentes a 'client' si no tienen rol
UPDATE user_profiles 
SET role = 'client' 
WHERE role IS NULL;

COMMENT ON COLUMN user_profiles.role IS 'Rol del usuario: client (cliente) o admin (administrador)';

-- ============================================
-- 3. CREAR USUARIO ADMINISTRADOR
-- ============================================
-- Opción A: Si ya tienes un usuario creado, actualízalo a admin
-- Reemplaza 'email-del-usuario@ejemplo.com' con el email real

-- UPDATE user_profiles 
-- SET role = 'admin' 
-- WHERE email = 'email-del-usuario@ejemplo.com';

-- Opción B: Si conoces el ID del usuario
-- Reemplaza 'user-id-aqui' con el UUID del usuario

-- UPDATE user_profiles 
-- SET role = 'admin' 
-- WHERE id = 'user-id-aqui';

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Ejecuta esto para verificar que las columnas se agregaron correctamente

-- SELECT 
--   column_name, 
--   data_type, 
--   column_default,
--   is_nullable
-- FROM information_schema.columns 
-- WHERE table_name = 'user_profiles' 
--   AND column_name IN ('gym_code', 'role')
-- ORDER BY column_name;

-- ============================================
-- LISTAR USUARIOS Y SUS ROLES
-- ============================================
-- Ejecuta esto para ver todos los usuarios y sus roles

-- SELECT 
--   id,
--   email,
--   full_name,
--   role,
--   gym_code,
--   created_at
-- FROM user_profiles
-- ORDER BY created_at DESC;

