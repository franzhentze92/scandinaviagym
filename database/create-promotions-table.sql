-- ============================================
-- CREATE PROMOTIONS TABLE
-- ============================================
-- Description: Table for managing membership promotions/coupons
-- Date: 2024

-- Ensure the is_admin_user function exists
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Get the role directly from the table, bypassing RLS
  SELECT role INTO user_role
  FROM user_profiles
  WHERE id = auth.uid();
  
  RETURN user_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

GRANT EXECUTE ON FUNCTION is_admin_user() TO authenticated;

CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  discount TEXT NOT NULL, -- e.g., "20% OFF", "15% OFF"
  coupon_code TEXT NOT NULL UNIQUE,
  valid_until DATE NOT NULL,
  badge TEXT, -- e.g., "Nuevo", "Popular", "Limitado"
  color TEXT NOT NULL, -- Hex color code
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for active promotions
CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(is_active);
CREATE INDEX IF NOT EXISTS idx_promotions_valid_until ON promotions(valid_until);
CREATE INDEX IF NOT EXISTS idx_promotions_coupon_code ON promotions(coupon_code);

-- Enable RLS
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Public can view active promotions
DROP POLICY IF EXISTS "Public can view active promotions" ON promotions;
CREATE POLICY "Public can view active promotions" ON promotions
  FOR SELECT USING (is_active = true AND valid_until >= CURRENT_DATE);

-- Admins can view all promotions
DROP POLICY IF EXISTS "Admins can view all promotions" ON promotions;
CREATE POLICY "Admins can view all promotions" ON promotions
  FOR SELECT USING (is_admin_user());

-- Admins can create promotions
DROP POLICY IF EXISTS "Admins can create promotions" ON promotions;
CREATE POLICY "Admins can create promotions" ON promotions
  FOR INSERT WITH CHECK (is_admin_user());

-- Admins can update promotions
DROP POLICY IF EXISTS "Admins can update promotions" ON promotions;
CREATE POLICY "Admins can update promotions" ON promotions
  FOR UPDATE 
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- Admins can delete promotions
DROP POLICY IF EXISTS "Admins can delete promotions" ON promotions;
CREATE POLICY "Admins can delete promotions" ON promotions
  FOR DELETE USING (is_admin_user());

-- Insert default promotions (if they don't exist)
INSERT INTO promotions (title, description, discount, coupon_code, valid_until, badge, color, is_active)
SELECT 
  'Promoción de Verano',
  'Descuento del 20% en tu primer mes al contratar plan anual',
  '20% OFF',
  'VERANO2024',
  '2024-12-31',
  'Nuevo',
  '#ff6b6b',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM promotions WHERE coupon_code = 'VERANO2024'
);

INSERT INTO promotions (title, description, discount, coupon_code, valid_until, badge, color, is_active)
SELECT 
  'Plan Familiar',
  'Inscribe a 2 o más familiares y obtén 15% de descuento en todos los planes',
  '15% OFF',
  'FAMILIA2024',
  '2024-11-30',
  'Popular',
  '#42a5f5',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM promotions WHERE coupon_code = 'FAMILIA2024'
);

INSERT INTO promotions (title, description, discount, coupon_code, valid_until, badge, color, is_active)
SELECT 
  'Estudiante',
  'Descuento especial del 25% para estudiantes con carnet vigente',
  '25% OFF',
  'ESTUDIANTE2024',
  '2024-10-31',
  'Limitado',
  '#f59e0b',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM promotions WHERE coupon_code = 'ESTUDIANTE2024'
);

