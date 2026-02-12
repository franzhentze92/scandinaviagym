-- ============================================
-- WORKOUT ROUTINES TABLE
-- ============================================
-- Table to store workout routines created by admins for clients

CREATE TABLE IF NOT EXISTS workout_routines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES user_profiles(id) ON DELETE SET NULL,
  
  -- Routine data stored as JSONB for flexibility
  routine_data JSONB NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Create a unique index for one routine per user per date
-- This is commented out by default as users might need multiple routines
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_workout_routines_user_date 
-- ON workout_routines(user_id, DATE(created_at));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_workout_routines_user ON workout_routines(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_routines_created_by ON workout_routines(created_by);
CREATE INDEX IF NOT EXISTS idx_workout_routines_created_at ON workout_routines(created_at);
CREATE INDEX IF NOT EXISTS idx_workout_routines_routine_data ON workout_routines USING GIN(routine_data);

-- Enable RLS
ALTER TABLE workout_routines ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own routines
DROP POLICY IF EXISTS "Users can view own routines" ON workout_routines;
CREATE POLICY "Users can view own routines" ON workout_routines
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all routines
DROP POLICY IF EXISTS "Admins can view all routines" ON workout_routines;
CREATE POLICY "Admins can view all routines" ON workout_routines
  FOR SELECT USING (is_admin_user());

-- Admins can create routines
DROP POLICY IF EXISTS "Admins can create routines" ON workout_routines;
CREATE POLICY "Admins can create routines" ON workout_routines
  FOR INSERT WITH CHECK (is_admin_user());

-- Admins can update routines
DROP POLICY IF EXISTS "Admins can update routines" ON workout_routines;
CREATE POLICY "Admins can update routines" ON workout_routines
  FOR UPDATE USING (is_admin_user());

-- Admins can delete routines
DROP POLICY IF EXISTS "Admins can delete routines" ON workout_routines;
CREATE POLICY "Admins can delete routines" ON workout_routines
  FOR DELETE USING (is_admin_user());

-- Add comment
COMMENT ON TABLE workout_routines IS 'Stores workout routines created by admins for gym members';

