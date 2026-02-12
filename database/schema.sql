-- ============================================
-- SCANDINAVIA GYM DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- STEP 1: CREATE BASE TABLES (NO DEPENDENCIES)
-- ============================================

-- Sedes (Gym Locations) - Must be created first
CREATE TABLE IF NOT EXISTS sedes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  hours TEXT,
  manager_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Class Categories
CREATE TABLE IF NOT EXISTS class_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  icon_name TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Membership Plans
CREATE TABLE IF NOT EXISTS membership_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'GTQ',
  duration_days INTEGER NOT NULL,
  features JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  criteria JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Challenges
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  icon_name TEXT,
  color TEXT,
  duration_days INTEGER,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reward TEXT,
  difficulty TEXT CHECK (difficulty IN ('Baja', 'Media', 'Alta')),
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FAQ Items
CREATE TABLE IF NOT EXISTS faq_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  helpful_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 2: CREATE TABLES THAT DEPEND ON BASE TABLES
-- ============================================

-- Instructors (depends on sedes)
CREATE TABLE IF NOT EXISTS instructors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  specialty TEXT,
  sede_id UUID REFERENCES sedes(id),
  bio TEXT,
  rating DECIMAL(3, 2),
  reviews_count INTEGER DEFAULT 0,
  experience_years INTEGER,
  certifications JSONB,
  price_per_session DECIMAL(10, 2),
  currency TEXT DEFAULT 'GTQ',
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Profiles (depends on sedes)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  birth_date DATE,
  gender TEXT CHECK (gender IN ('Masculino', 'Femenino', 'Otro')),
  sede_id UUID REFERENCES sedes(id),
  member_since TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  avatar_url TEXT,
  gym_code TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 3: CREATE TABLES THAT DEPEND ON STEP 2
-- ============================================

-- Classes (depends on class_categories, instructors, sedes)
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES class_categories(id),
  instructor_id UUID REFERENCES instructors(id),
  sede_id UUID REFERENCES sedes(id),
  duration_minutes INTEGER NOT NULL,
  capacity INTEGER NOT NULL,
  intensity TEXT CHECK (intensity IN ('Baja', 'Media', 'Alta')),
  level TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Memberships (depends on user_profiles, membership_plans)
CREATE TABLE IF NOT EXISTS user_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES membership_plans(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT CHECK (status IN ('active', 'expired', 'cancelled', 'frozen')) DEFAULT 'active',
  payment_method TEXT,
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 4: CREATE TABLES THAT DEPEND ON STEP 3
-- ============================================

-- Class Schedules (depends on classes, sedes)
CREATE TABLE IF NOT EXISTS class_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  sede_id UUID NOT NULL REFERENCES sedes(id),
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 5: CREATE TABLES THAT DEPEND ON USER_PROFILES AND OTHER TABLES
-- ============================================

-- Class Reservations (depends on user_profiles, class_schedules)
CREATE TABLE IF NOT EXISTS class_reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  class_schedule_id UUID NOT NULL REFERENCES class_schedules(id) ON DELETE CASCADE,
  reservation_date DATE NOT NULL,
  status TEXT CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no_show')) DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, class_schedule_id, reservation_date)
);

-- User Progress Metrics (depends on user_profiles)
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  weight DECIMAL(5, 2),
  body_fat_percentage DECIMAL(5, 2),
  muscle_mass DECIMAL(5, 2),
  bmi DECIMAL(4, 2),
  measurements JSONB, -- {waist, chest, arm, thigh, etc.}
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workout History (depends on user_profiles)
CREATE TABLE IF NOT EXISTS workout_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type TEXT NOT NULL,
  duration_minutes INTEGER,
  calories_burned INTEGER,
  intensity TEXT CHECK (intensity IN ('Baja', 'Media', 'Alta')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Achievements (depends on user_profiles, achievements)
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_date DATE NOT NULL,
  progress INTEGER DEFAULT 0,
  is_earned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- User Challenge Participation (depends on user_profiles, challenges)
CREATE TABLE IF NOT EXISTS user_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  total_required INTEGER NOT NULL,
  joined_date DATE NOT NULL,
  completed_date DATE,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

-- Support Tickets (depends on user_profiles)
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')) DEFAULT 'open',
  priority TEXT CHECK (priority IN ('Baja', 'Media', 'Alta')) DEFAULT 'Media',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Sessions (depends on user_profiles)
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  device_name TEXT,
  device_type TEXT,
  ip_address TEXT,
  user_agent TEXT,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- User Profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_sede ON user_profiles(sede_id);

-- Memberships
CREATE INDEX IF NOT EXISTS idx_user_memberships_user ON user_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_user_memberships_status ON user_memberships(status);

-- Classes
CREATE INDEX IF NOT EXISTS idx_classes_category ON classes(category_id);
CREATE INDEX IF NOT EXISTS idx_classes_sede ON classes(sede_id);
CREATE INDEX IF NOT EXISTS idx_classes_instructor ON classes(instructor_id);
CREATE INDEX IF NOT EXISTS idx_class_schedules_class ON class_schedules(class_id);
CREATE INDEX IF NOT EXISTS idx_class_schedules_day ON class_schedules(day_of_week);

-- Reservations
CREATE INDEX IF NOT EXISTS idx_reservations_user ON class_reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON class_reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON class_reservations(status);

-- Progress
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_date ON user_progress(date);
CREATE INDEX IF NOT EXISTS idx_workout_history_user ON workout_history(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_history_date ON workout_history(date);

-- Challenges
CREATE INDEX IF NOT EXISTS idx_user_challenges_user ON user_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_challenge ON user_challenges(challenge_id);

-- Support
CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- User Profiles: Users can only see and update their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- User Memberships: Users can only see their own memberships
DROP POLICY IF EXISTS "Users can view own memberships" ON user_memberships;
CREATE POLICY "Users can view own memberships" ON user_memberships
  FOR SELECT USING (auth.uid() = user_id);

-- Class Reservations: Users can only see their own reservations
DROP POLICY IF EXISTS "Users can view own reservations" ON class_reservations;
CREATE POLICY "Users can view own reservations" ON class_reservations
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own reservations" ON class_reservations;
CREATE POLICY "Users can create own reservations" ON class_reservations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own reservations" ON class_reservations;
CREATE POLICY "Users can update own reservations" ON class_reservations
  FOR UPDATE USING (auth.uid() = user_id);

-- User Progress: Users can only see their own progress
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own progress" ON user_progress;
CREATE POLICY "Users can create own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Workout History: Users can only see their own workouts
DROP POLICY IF EXISTS "Users can view own workouts" ON workout_history;
CREATE POLICY "Users can view own workouts" ON workout_history
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own workouts" ON workout_history;
CREATE POLICY "Users can create own workouts" ON workout_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Support Tickets: Users can only see their own tickets
DROP POLICY IF EXISTS "Users can view own tickets" ON support_tickets;
CREATE POLICY "Users can view own tickets" ON support_tickets
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own tickets" ON support_tickets;
CREATE POLICY "Users can create own tickets" ON support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Sessions: Users can only see their own sessions
DROP POLICY IF EXISTS "Users can view own sessions" ON user_sessions;
CREATE POLICY "Users can view own sessions" ON user_sessions
  FOR SELECT USING (auth.uid() = user_id);

-- Public read access for some tables
DROP POLICY IF EXISTS "Public can view sedes" ON sedes;
CREATE POLICY "Public can view sedes" ON sedes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view classes" ON classes;
CREATE POLICY "Public can view classes" ON classes FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can view class_schedules" ON class_schedules;
CREATE POLICY "Public can view class_schedules" ON class_schedules FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can view instructors" ON instructors;
CREATE POLICY "Public can view instructors" ON instructors FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can view membership_plans" ON membership_plans;
CREATE POLICY "Public can view membership_plans" ON membership_plans FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can view challenges" ON challenges;
CREATE POLICY "Public can view challenges" ON challenges FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can view faq_items" ON faq_items;
CREATE POLICY "Public can view faq_items" ON faq_items FOR SELECT USING (is_active = true);
