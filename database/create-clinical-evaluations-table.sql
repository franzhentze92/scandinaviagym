-- ============================================
-- CLINICAL EVALUATIONS TABLE
-- ============================================
-- Table to store clinical evaluations for gym members

CREATE TABLE IF NOT EXISTS clinical_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES user_profiles(id) ON DELETE SET NULL,
  evaluation_date DATE NOT NULL,
  
  -- Form data stored as JSONB for flexibility
  form_data JSONB NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one evaluation per user per date (optional constraint)
  UNIQUE(user_id, evaluation_date)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_clinical_evaluations_user ON clinical_evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_clinical_evaluations_date ON clinical_evaluations(evaluation_date);
CREATE INDEX IF NOT EXISTS idx_clinical_evaluations_created_by ON clinical_evaluations(created_by);
CREATE INDEX IF NOT EXISTS idx_clinical_evaluations_form_data ON clinical_evaluations USING GIN(form_data);

-- Enable RLS
ALTER TABLE clinical_evaluations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own evaluations
DROP POLICY IF EXISTS "Users can view own evaluations" ON clinical_evaluations;
CREATE POLICY "Users can view own evaluations" ON clinical_evaluations
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all evaluations (using existing is_admin_user function)
DROP POLICY IF EXISTS "Admins can view all evaluations" ON clinical_evaluations;
CREATE POLICY "Admins can view all evaluations" ON clinical_evaluations
  FOR SELECT USING (is_admin_user());

-- Admins can create evaluations
DROP POLICY IF EXISTS "Admins can create evaluations" ON clinical_evaluations;
CREATE POLICY "Admins can create evaluations" ON clinical_evaluations
  FOR INSERT WITH CHECK (is_admin_user());

-- Admins can update evaluations
DROP POLICY IF EXISTS "Admins can update evaluations" ON clinical_evaluations;
CREATE POLICY "Admins can update evaluations" ON clinical_evaluations
  FOR UPDATE USING (is_admin_user());

-- Admins can delete evaluations
DROP POLICY IF EXISTS "Admins can delete evaluations" ON clinical_evaluations;
CREATE POLICY "Admins can delete evaluations" ON clinical_evaluations
  FOR DELETE USING (is_admin_user());

-- Add comment
COMMENT ON TABLE clinical_evaluations IS 'Stores clinical evaluations and health assessments for gym members';

