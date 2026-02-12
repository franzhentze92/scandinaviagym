// Database Types for Scandinavia Gym

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  birth_date: string | null;
  age: number | null;
  gender: 'Masculino' | 'Femenino' | 'Otro' | null;
  sede_id: string | null;
  member_since: string;
  avatar_url: string | null;
  gym_code: string | null;
  role: 'client' | 'admin' | 'instructor';
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  emergency_contact_relationship: string | null;
  created_at: string;
  updated_at: string;
}

export interface Sede {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  hours: string | null;
  manager_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  duration_days: number;
  enrollment_fee?: number;
  loyalty_months?: number;
  features: Record<string, any> | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserMembership {
  id: string;
  user_id: string;
  plan_id: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'cancelled' | 'frozen';
  payment_method: string | null;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: string;
  coupon_code: string;
  valid_until: string;
  badge: string | null;
  color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClassCategory {
  id: string;
  name: string;
  icon_name: string | null;
  color: string | null;
  created_at: string;
}

export interface Class {
  id: string;
  name: string;
  description: string | null;
  category_id: string | null;
  instructor_id: string | null;
  sede_id: string | null;
  duration_minutes: number;
  capacity: number;
  intensity: 'Baja' | 'Media' | 'Alta' | null;
  level: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClassSchedule {
  id: string;
  class_id: string;
  sede_id: string;
  day_of_week: number; // 0 = Sunday, 6 = Saturday
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClassReservation {
  id: string;
  user_id: string;
  class_schedule_id: string;
  reservation_date: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  created_at: string;
  updated_at: string;
}

export interface Instructor {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  specialty: string | null;
  sede_id: string | null;
  bio: string | null;
  rating: number | null;
  reviews_count: number;
  experience_years: number | null;
  certifications: Record<string, any> | null;
  price_per_session: number | null;
  currency: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  date: string;
  weight: number | null;
  body_fat_percentage: number | null;
  muscle_mass: number | null;
  bmi: number | null;
  measurements: Record<string, any> | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkoutHistory {
  id: string;
  user_id: string;
  date: string;
  type: string;
  duration_minutes: number | null;
  calories_burned: number | null;
  intensity: 'Baja' | 'Media' | 'Alta' | null;
  notes: string | null;
  created_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string | null;
  icon_name: string | null;
  criteria: Record<string, any> | null;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_date: string;
  progress: number;
  is_earned: boolean;
  created_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string | null;
  type: string;
  icon_name: string | null;
  color: string | null;
  duration_days: number | null;
  start_date: string;
  end_date: string;
  reward: string | null;
  difficulty: 'Baja' | 'Media' | 'Alta' | null;
  category: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  progress: number;
  total_required: number;
  joined_date: string;
  completed_date: string | null;
  is_completed: boolean;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  category: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'Baja' | 'Media' | 'Alta';
  created_at: string;
  updated_at: string;
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  helpful_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  device_name: string | null;
  device_type: string | null;
  ip_address: string | null;
  user_agent: string | null;
  last_activity: string;
  created_at: string;
}

export interface ClinicalEvaluation {
  id: string;
  user_id: string;
  created_by: string;
  evaluation_date: string;
  form_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

