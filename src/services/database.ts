import { supabase } from '@/lib/supabase';
import type {
  UserProfile,
  Sede,
  MembershipPlan,
  UserMembership,
  Promotion,
  Class,
  ClassSchedule,
  ClassReservation,
  Instructor,
  UserProgress,
  WorkoutHistory,
  Challenge,
  UserChallenge,
  SupportTicket,
  FAQItem
} from '@/types/database';

// ============================================
// USER PROFILE
// ============================================

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    // Try to get all columns including role and gym_code in one query
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      
      // If it's a permission error, try with basic columns only
      if (error.code === '42501' || error.message?.includes('permission') || error.message?.includes('policy')) {
        console.warn('Permission error, trying with basic columns only');
        return await getUserProfileBasic(userId);
      }
      
      return null;
    }

    if (!data) {
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
};

// Fallback function to get basic profile info if full query fails
const getUserProfileBasic = async (userId: string): Promise<UserProfile | null> => {
  const basicColumns = 'id, email, full_name, phone, birth_date, gender, sede_id, member_since, avatar_url, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship, created_at, updated_at';
  
  const { data: basicData, error: basicError } = await supabase
    .from('user_profiles')
    .select(basicColumns)
    .eq('id', userId)
    .single();

  if (basicError || !basicData) {
    return null;
  }

  // Try to get optional columns separately
  let gymCode: string | null = null;
  let role: 'client' | 'admin' = 'client';

  const { data: optionalData, error: optionalError } = await supabase
    .from('user_profiles')
    .select('gym_code, role')
    .eq('id', userId)
    .single();
  
  if (!optionalError && optionalData) {
    gymCode = optionalData.gym_code || null;
    role = (optionalData.role as 'client' | 'admin') || 'client';
  }

  return {
    ...basicData,
    gym_code: gymCode,
    role: role
  } as UserProfile;
};

export const createUserProfile = async (userId: string, profileData: Partial<UserProfile>): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      id: userId,
      ...profileData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating user profile:', error);
    return null;
  }

  return data;
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all users:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      
      // If it's a permission error, provide helpful message
      if (error.code === '42501' || error.message?.includes('permission') || error.message?.includes('policy')) {
        console.warn('RLS Policy Error: Make sure the admin policy is set up correctly. Run the migration: database/add-admin-view-all-users-policy.sql');
      }
      
      return [];
    }

    console.log(`Successfully fetched ${data?.length || 0} users`);
    return (data || []) as UserProfile[];
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    return [];
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> => {
  // Filter out undefined values and only include valid fields
  const cleanUpdates: any = {
    updated_at: new Date().toISOString()
  };

  // Only include fields that are defined (not undefined)
  Object.keys(updates).forEach(key => {
    if (updates[key as keyof UserProfile] !== undefined) {
      cleanUpdates[key] = updates[key as keyof UserProfile];
    }
  });

  const { data, error } = await supabase
    .from('user_profiles')
    .update(cleanUpdates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    
    // If error is about missing column (PGRST204), try without optional/new fields
    if (error.code === 'PGRST204') {
      console.warn('Column may not exist in schema cache, retrying without optional fields');
      
      // Remove optional fields that might not be in schema cache yet
      const { gym_code, role, ...updatesWithoutOptional } = cleanUpdates;
      
      const { data: retryData, error: retryError } = await supabase
        .from('user_profiles')
        .update(updatesWithoutOptional)
        .eq('id', userId)
        .select()
        .single();
      
      if (retryError) {
        console.error('Error updating user profile (retry):', retryError);
        // Don't fail completely, return partial success
        return null;
      }
      
      // If we had optional fields, log a warning but return success
      if (gym_code !== undefined || role !== undefined) {
        console.warn('Optional fields (gym_code, role) were skipped due to schema cache. They will be available after cache refresh.');
      }
      
      return retryData;
    }
    return null;
  }

  return data;
};

// ============================================
// SEDES
// ============================================

export const getSedes = async (): Promise<Sede[]> => {
  const { data, error } = await supabase
    .from('sedes')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching sedes:', error);
    return [];
  }

  return data || [];
};

// ============================================
// MEMBERSHIPS
// ============================================

export const getMembershipPlans = async (): Promise<MembershipPlan[]> => {
  const { data, error } = await supabase
    .from('membership_plans')
    .select('*')
    .eq('is_active', true)
    .order('price');

  if (error) {
    console.error('Error fetching membership plans:', error);
    return [];
  }

  return data || [];
};

export const getUserMembership = async (userId: string): Promise<UserMembership | null> => {
  const { data, error } = await supabase
    .from('user_memberships')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    // Only log if it's not a "no rows" error
    if (error.code !== 'PGRST116') {
      console.error('Error fetching user membership:', error);
    }
    return null;
  }

  return data;
};

export const getAllUserMemberships = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('user_memberships')
    .select(`
      *,
      user:user_profiles(id, full_name, email, phone, gym_code),
      plan:membership_plans(id, name, price, currency)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all user memberships:', error);
    return [];
  }

  return data || [];
};

export const deactivateUserActiveMemberships = async (userId: string, excludeId?: string): Promise<void> => {
  let query = supabase
    .from('user_memberships')
    .update({ 
      status: 'expired',
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .eq('status', 'active');

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { error } = await query;

  if (error) {
    console.error('Error deactivating previous memberships:', error);
    throw error;
  }
};

export const createUserMembership = async (membershipData: {
  user_id: string;
  plan_id: string;
  start_date: string;
  end_date: string;
  status?: 'active' | 'expired' | 'cancelled' | 'frozen';
  payment_method?: string;
  auto_renew?: boolean;
}): Promise<UserMembership | null> => {
  // If creating an active membership, deactivate all previous active memberships for this user
  if ((membershipData.status || 'active') === 'active') {
    try {
      await deactivateUserActiveMemberships(membershipData.user_id);
    } catch (error) {
      console.error('Error deactivating previous memberships:', error);
      // Continue anyway, but log the error
    }
  }

  const { data, error } = await supabase
    .from('user_memberships')
    .insert({
      ...membershipData,
      status: membershipData.status || 'active',
      auto_renew: membershipData.auto_renew ?? true
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating user membership:', error);
    throw error;
  }

  return data;
};

export const updateUserMembership = async (
  membershipId: string,
  updates: Partial<UserMembership>
): Promise<UserMembership | null> => {
  const { data, error } = await supabase
    .from('user_memberships')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', membershipId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user membership:', error);
    throw error;
  }

  return data;
};

export const deleteUserMembership = async (membershipId: string): Promise<void> => {
  const { error } = await supabase
    .from('user_memberships')
    .delete()
    .eq('id', membershipId);

  if (error) {
    console.error('Error deleting user membership:', error);
    throw error;
  }
};

export const getAllMembershipPlans = async (): Promise<MembershipPlan[]> => {
  const { data, error } = await supabase
    .from('membership_plans')
    .select('*')
    .order('price');

  if (error) {
    console.error('Error fetching all membership plans:', error);
    return [];
  }

  return data || [];
};

export const createMembershipPlan = async (planData: {
  name: string;
  description?: string;
  price: number;
  currency?: string;
  duration_days: number;
  enrollment_fee?: number;
  loyalty_months?: number;
  features?: Record<string, any>;
  is_active?: boolean;
}): Promise<MembershipPlan | null> => {
  const { data, error } = await supabase
    .from('membership_plans')
    .insert({
      ...planData,
      currency: planData.currency || 'GTQ',
      enrollment_fee: planData.enrollment_fee || 0,
      loyalty_months: planData.loyalty_months || 0,
      features: planData.features || {},
      is_active: planData.is_active ?? true
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating membership plan:', error);
    throw error;
  }

  return data;
};

export const updateMembershipPlan = async (
  planId: string,
  updates: Partial<MembershipPlan>
): Promise<MembershipPlan | null> => {
  const { data, error } = await supabase
    .from('membership_plans')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', planId)
    .select()
    .single();

  if (error) {
    console.error('Error updating membership plan:', error);
    throw error;
  }

  return data;
};

export const deleteMembershipPlan = async (planId: string): Promise<void> => {
  const { error } = await supabase
    .from('membership_plans')
    .delete()
    .eq('id', planId);

  if (error) {
    console.error('Error deleting membership plan:', error);
    throw error;
  }
};

// ============================================
// PROMOTIONS
// ============================================

export const getAllPromotions = async (): Promise<Promotion[]> => {
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching promotions:', error);
    return [];
  }

  return data || [];
};

export const getActivePromotions = async (): Promise<Promotion[]> => {
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('is_active', true)
    .gte('valid_until', new Date().toISOString().split('T')[0])
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching active promotions:', error);
    return [];
  }

  return data || [];
};

export const createPromotion = async (promotionData: {
  title: string;
  description: string;
  discount: string;
  coupon_code: string;
  valid_until: string;
  badge?: string | null;
  color: string;
  is_active?: boolean;
}): Promise<Promotion | null> => {
  const { data, error } = await supabase
    .from('promotions')
    .insert({
      ...promotionData,
      is_active: promotionData.is_active ?? true
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating promotion:', error);
    throw error;
  }

  return data;
};

export const updatePromotion = async (
  promotionId: string,
  updates: Partial<Promotion>
): Promise<Promotion | null> => {
  const { data, error } = await supabase
    .from('promotions')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', promotionId)
    .select()
    .single();

  if (error) {
    console.error('Error updating promotion:', error);
    throw error;
  }

  return data;
};

export const deletePromotion = async (promotionId: string): Promise<void> => {
  const { error } = await supabase
    .from('promotions')
    .delete()
    .eq('id', promotionId);

  if (error) {
    console.error('Error deleting promotion:', error);
    throw error;
  }
};

// ============================================
// CLASSES
// ============================================

export const getClasses = async (): Promise<Class[]> => {
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) {
    console.error('Error fetching classes:', error);
    return [];
  }

  return data || [];
};

export const getClassSchedules = async (sedeId?: string, dayOfWeek?: number): Promise<ClassSchedule[]> => {
  let query = supabase
    .from('class_schedules')
    .select('*')
    .eq('is_active', true);

  if (sedeId) {
    query = query.eq('sede_id', sedeId);
  }

  if (dayOfWeek !== undefined) {
    query = query.eq('day_of_week', dayOfWeek);
  }

  const { data, error } = await query.order('start_time');

  if (error) {
    console.error('Error fetching class schedules:', error);
    return [];
  }

  return data || [];
};

// Get classes with full details (category, instructor, sede, schedules)
export const getClassesWithDetails = async (filters?: {
  sedeId?: string;
  categoryId?: string;
  date?: Date;
}): Promise<any[]> => {
  let query = supabase
    .from('classes')
    .select(`
      *,
      category:class_categories(*),
      instructor:instructors(*),
      sede:sedes(*),
      schedules:class_schedules(*)
    `)
    .eq('is_active', true);

  if (filters?.sedeId) {
    query = query.eq('sede_id', filters.sedeId);
  }

  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }

  const { data, error } = await query.order('name');

  if (error) {
    console.error('Error fetching classes with details:', error);
    return [];
  }

  return data || [];
};

// Get class schedules for a specific date
export const getClassSchedulesForDate = async (date: Date, sedeId?: string, categoryId?: string): Promise<any[]> => {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  
  let query = supabase
    .from('class_schedules')
    .select(`
      *,
      class:classes!inner(
        *,
        category:class_categories(*),
        instructor:instructors(*),
        sede:sedes(*)
      )
    `)
    .eq('day_of_week', dayOfWeek)
    .eq('is_active', true)
    .eq('class.is_active', true);

  if (sedeId) {
    query = query.eq('sede_id', sedeId);
  }

  if (categoryId) {
    query = query.eq('class.category_id', categoryId);
  }

  const { data, error } = await query.order('start_time');

  if (error) {
    console.error('Error fetching class schedules for date:', error);
    return [];
  }

  return data || [];
};

// Get available spots for a class schedule on a specific date
export const getAvailableSpots = async (classScheduleId: string, reservationDate: string): Promise<{ available: number; total: number }> => {
  // Get the class schedule to find capacity
  const { data: scheduleData, error: scheduleError } = await supabase
    .from('class_schedules')
    .select('class:classes(capacity)')
    .eq('id', classScheduleId)
    .single();

  if (scheduleError || !scheduleData) {
    console.error('Error fetching schedule capacity:', scheduleError);
    return { available: 0, total: 0 };
  }

  const capacity = (scheduleData.class as any)?.capacity || 0;

  // Count confirmed reservations for this schedule and date
  const { count, error: countError } = await supabase
    .from('class_reservations')
    .select('*', { count: 'exact', head: true })
    .eq('class_schedule_id', classScheduleId)
    .eq('reservation_date', reservationDate)
    .eq('status', 'confirmed');

  if (countError) {
    console.error('Error counting reservations:', countError);
    return { available: 0, total: capacity };
  }

  const reserved = count || 0;
  const available = Math.max(0, capacity - reserved);

  return { available, total: capacity };
};

// Get class categories
export const getClassCategories = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('class_categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching class categories:', error);
    return [];
  }

  return data || [];
};

export const createClassReservation = async (
  userId: string,
  classScheduleId: string,
  reservationDate: string
): Promise<ClassReservation | null> => {
  const { data, error } = await supabase
    .from('class_reservations')
    .insert({
      user_id: userId,
      class_schedule_id: classScheduleId,
      reservation_date: reservationDate,
      status: 'confirmed'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating class reservation:', error);
    return null;
  }

  return data;
};

export const getUserReservations = async (userId: string): Promise<ClassReservation[]> => {
  const { data, error } = await supabase
    .from('class_reservations')
    .select('*')
    .eq('user_id', userId)
    .order('reservation_date', { ascending: false });

  if (error) {
    console.error('Error fetching user reservations:', error);
    return [];
  }

  return data || [];
};

export const cancelReservation = async (reservationId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('class_reservations')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', reservationId);

  if (error) {
    console.error('Error cancelling reservation:', error);
    return false;
  }

  return true;
};

// Get user reservations with class details
export const getUserReservationsWithDetails = async (userId: string, date?: Date): Promise<any[]> => {
  let query = supabase
    .from('class_reservations')
    .select(`
      *,
      class_schedule:class_schedules!inner(
        *,
        class:classes!inner(
          *,
          category:class_categories(*),
          instructor:instructors(*),
          sede:sedes(*)
        )
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'confirmed')
    .order('reservation_date', { ascending: true })
    .order('created_at', { ascending: false });

  if (date) {
    const dateStr = date.toISOString().split('T')[0];
    query = query.gte('reservation_date', dateStr);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching user reservations with details:', error);
    return [];
  }

  return data || [];
};

// Get all reservations with details (for admin)
export const getAllReservationsWithDetails = async (filters?: {
  startDate?: Date;
  endDate?: Date;
  status?: string;
  sedeId?: string;
  userId?: string;
}): Promise<any[]> => {
  let query = supabase
    .from('class_reservations')
    .select(`
      *,
      user:user_profiles!inner(
        id,
        email,
        full_name,
        phone
      ),
      class_schedule:class_schedules!inner(
        *,
        class:classes!inner(
          *,
          category:class_categories(*),
          instructor:instructors(*),
          sede:sedes(*)
        ),
        sede:sedes(*)
      )
    `)
    .order('reservation_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (filters?.startDate) {
    const dateStr = filters.startDate.toISOString().split('T')[0];
    query = query.gte('reservation_date', dateStr);
  }

  if (filters?.endDate) {
    const dateStr = filters.endDate.toISOString().split('T')[0];
    query = query.lte('reservation_date', dateStr);
  }

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.userId) {
    query = query.eq('user_id', filters.userId);
  }

  const { data, error } = await query;

  // Apply sede filter in memory since it's nested
  let filteredData = data || [];
  
  if (filters?.sedeId) {
    filteredData = filteredData.filter((reservation: any) => {
      const schedule = reservation.class_schedule || {};
      const sedeId = schedule.sede_id || schedule.class?.sede_id || schedule.sede?.id;
      return sedeId === filters.sedeId;
    });
  }

  if (error) {
    console.error('Error fetching all reservations with details:', error);
    return [];
  }

  return filteredData;
};

// ============================================
// INSTRUCTORS
// ============================================

export const getInstructors = async (sedeId?: string): Promise<Instructor[]> => {
  let query = supabase
    .from('instructors')
    .select('*')
    .eq('is_active', true);

  if (sedeId) {
    query = query.eq('sede_id', sedeId);
  }

  const { data, error } = await query.order('name');

  if (error) {
    console.error('Error fetching instructors:', error);
    return [];
  }

  return data || [];
};

export const getAllInstructors = async (): Promise<Instructor[]> => {
  try {
    const { data, error } = await supabase
      .from('instructors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all instructors:', error);
      return [];
    }

    return (data || []) as Instructor[];
  } catch (error) {
    console.error('Error in getAllInstructors:', error);
    return [];
  }
};

export const createInstructor = async (instructorData: Partial<Instructor>): Promise<Instructor | null> => {
  try {
    const { data, error } = await supabase
      .from('instructors')
      .insert({
        ...instructorData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating instructor:', error);
      return null;
    }

    return data as Instructor;
  } catch (error) {
    console.error('Error in createInstructor:', error);
    return null;
  }
};

export const updateInstructor = async (instructorId: string, updates: Partial<Instructor>): Promise<Instructor | null> => {
  try {
    const { data, error } = await supabase
      .from('instructors')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', instructorId)
      .select()
      .single();

    if (error) {
      console.error('Error updating instructor:', error);
      return null;
    }

    return data as Instructor;
  } catch (error) {
    console.error('Error in updateInstructor:', error);
    return null;
  }
};

export const deleteInstructor = async (instructorId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('instructors')
      .delete()
      .eq('id', instructorId);

    if (error) {
      console.error('Error deleting instructor:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteInstructor:', error);
    return false;
  }
};

// ============================================
// PROGRESS
// ============================================

export const getUserProgress = async (userId: string, limit?: number): Promise<UserProgress[]> => {
  let query = supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching user progress:', error);
    return [];
  }

  return data || [];
};

export const createUserProgress = async (userId: string, progress: Omit<UserProgress, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<UserProgress | null> => {
  const { data, error } = await supabase
    .from('user_progress')
    .insert({
      user_id: userId,
      ...progress
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating user progress:', error);
    return null;
  }

  return data;
};

export const getWorkoutHistory = async (userId: string, limit?: number): Promise<WorkoutHistory[]> => {
  let query = supabase
    .from('workout_history')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching workout history:', error);
    return [];
  }

  return data || [];
};

export const createWorkoutHistory = async (userId: string, workout: Omit<WorkoutHistory, 'id' | 'user_id' | 'created_at'>): Promise<WorkoutHistory | null> => {
  const { data, error } = await supabase
    .from('workout_history')
    .insert({
      user_id: userId,
      ...workout
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating workout history:', error);
    return null;
  }

  return data;
};

// ============================================
// CHALLENGES
// ============================================

export const getChallenges = async (): Promise<Challenge[]> => {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching challenges:', error);
    return [];
  }

  return data || [];
};

export const getUserChallenges = async (userId: string): Promise<UserChallenge[]> => {
  const { data, error } = await supabase
    .from('user_challenges')
    .select('*')
    .eq('user_id', userId)
    .order('joined_date', { ascending: false });

  if (error) {
    console.error('Error fetching user challenges:', error);
    return [];
  }

  return data || [];
};

export const joinChallenge = async (userId: string, challengeId: string, totalRequired: number): Promise<UserChallenge | null> => {
  const { data, error } = await supabase
    .from('user_challenges')
    .insert({
      user_id: userId,
      challenge_id: challengeId,
      total_required: totalRequired,
      joined_date: new Date().toISOString().split('T')[0],
      progress: 0,
      is_completed: false
    })
    .select()
    .single();

  if (error) {
    console.error('Error joining challenge:', error);
    return null;
  }

  return data;
};

// ============================================
// SUPPORT
// ============================================

export const getSupportTickets = async (userId: string): Promise<SupportTicket[]> => {
  const { data, error } = await supabase
    .from('support_tickets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching support tickets:', error);
    return [];
  }

  return data || [];
};

export const createSupportTicket = async (userId: string, ticket: Omit<SupportTicket, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'status'>): Promise<SupportTicket | null> => {
  const { data, error } = await supabase
    .from('support_tickets')
    .insert({
      user_id: userId,
      ...ticket,
      status: 'open'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating support ticket:', error);
    return null;
  }

  return data;
};

// Get all support tickets (for admin)
export const getAllSupportTickets = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select(`
        *,
        user:user_profiles(
          id,
          full_name,
          email,
          phone
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all support tickets:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      
      // If it's a permission error, provide helpful message
      if (error.code === '42501' || error.message?.includes('permission') || error.message?.includes('policy')) {
        console.warn('RLS Policy Error: Make sure to run the migration: database/allow-admins-view-all-tickets.sql');
      }
      
      return [];
    }

    console.log(`Successfully fetched ${data?.length || 0} tickets`);
    return data || [];
  } catch (error) {
    console.error('Error in getAllSupportTickets:', error);
    return [];
  }
};

// Update support ticket status
export const updateSupportTicketStatus = async (ticketId: string, status: 'open' | 'in_progress' | 'resolved' | 'closed'): Promise<SupportTicket | null> => {
  const { data, error } = await supabase
    .from('support_tickets')
    .update({
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', ticketId)
    .select()
    .single();

  if (error) {
    console.error('Error updating support ticket status:', error);
    return null;
  }

  return data;
};

export const getFAQItems = async (category?: string): Promise<FAQItem[]> => {
  let query = supabase
    .from('faq_items')
    .select('*')
    .eq('is_active', true);

  if (category && category !== 'todas') {
    query = query.eq('category', category);
  }

  const { data, error } = await query.order('helpful_count', { ascending: false });

  if (error) {
    console.error('Error fetching FAQ items:', error);
    return [];
  }

  return data || [];
};

// ============================================
// CLINICAL EVALUATIONS
// ============================================

export const getAllClinicalEvaluations = async (filters?: {
  userId?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<any[]> => {
  try {
    let query = supabase
      .from('clinical_evaluations')
      .select(`
        *,
        user:user_profiles!clinical_evaluations_user_id_fkey(
          id,
          full_name,
          email,
          phone,
          gym_code,
          avatar_url
        ),
        created_by_user:user_profiles!clinical_evaluations_created_by_fkey(
          id,
          full_name
        )
      `)
      .order('evaluation_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (filters?.userId) {
      query = query.eq('user_id', filters.userId);
    }

    if (filters?.startDate) {
      const dateStr = filters.startDate.toISOString().split('T')[0];
      query = query.gte('evaluation_date', dateStr);
    }

    if (filters?.endDate) {
      const dateStr = filters.endDate.toISOString().split('T')[0];
      query = query.lte('evaluation_date', dateStr);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching clinical evaluations:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return [];
    }

    // Si created_by_user no está disponible debido a RLS, intentar obtenerlo manualmente
    // Esto es necesario porque los clientes no pueden ver otros perfiles de usuario
    if (data && filters?.userId) {
      const enrichedData = await Promise.all(
        data.map(async (evaluation: any) => {
          if (!evaluation.created_by_user?.full_name && evaluation.created_by) {
            try {
              const { data: creatorData, error: creatorError } = await supabase
                .from('user_profiles')
                .select('id, full_name')
                .eq('id', evaluation.created_by)
                .single();
              
              if (!creatorError && creatorData) {
                evaluation.created_by_user = {
                  id: creatorData.id,
                  full_name: creatorData.full_name
                };
              }
            } catch (err) {
              console.error('Error loading creator profile:', err);
            }
          }
          return evaluation;
        })
      );
      return enrichedData;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllClinicalEvaluations:', error);
    return [];
  }
};

export const getClinicalEvaluation = async (evaluationId: string): Promise<any | null> => {
  try {
    const { data, error } = await supabase
      .from('clinical_evaluations')
      .select(`
        *,
        user:user_profiles!clinical_evaluations_user_id_fkey(
          id,
          full_name,
          email,
          phone,
          gym_code,
          avatar_url
        ),
        created_by_user:user_profiles!clinical_evaluations_created_by_fkey(
          id,
          full_name
        )
      `)
      .eq('id', evaluationId)
      .single();

    if (error) {
      console.error('Error fetching clinical evaluation:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getClinicalEvaluation:', error);
    return null;
  }
};

export const createClinicalEvaluation = async (
  userId: string,
  createdBy: string,
  evaluationDate: string,
  formData: Record<string, any>
): Promise<any | null> => {
  try {
    const { data, error } = await supabase
      .from('clinical_evaluations')
      .insert({
        user_id: userId,
        created_by: createdBy,
        evaluation_date: evaluationDate,
        form_data: formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select(`
        *,
        user:user_profiles!clinical_evaluations_user_id_fkey(
          id,
          full_name,
          email,
          phone,
          gym_code,
          avatar_url
        ),
        created_by_user:user_profiles!clinical_evaluations_created_by_fkey(
          id,
          full_name
        )
      `)
      .single();

    if (error) {
      console.error('Error creating clinical evaluation:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createClinicalEvaluation:', error);
    throw error;
  }
};

export const updateClinicalEvaluation = async (
  evaluationId: string,
  updates: {
    evaluation_date?: string;
    form_data?: Record<string, any>;
  }
): Promise<any | null> => {
  try {
    const { data, error } = await supabase
      .from('clinical_evaluations')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', evaluationId)
      .select(`
        *,
        user:user_profiles!clinical_evaluations_user_id_fkey(
          id,
          full_name,
          email,
          phone,
          gym_code,
          avatar_url
        ),
        created_by_user:user_profiles!clinical_evaluations_created_by_fkey(
          id,
          full_name
        )
      `)
      .single();

    if (error) {
      console.error('Error updating clinical evaluation:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateClinicalEvaluation:', error);
    throw error;
  }
};

export const deleteClinicalEvaluation = async (evaluationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('clinical_evaluations')
      .delete()
      .eq('id', evaluationId);

    if (error) {
      console.error('Error deleting clinical evaluation:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteClinicalEvaluation:', error);
    throw error;
  }
};

// ============================================
// WORKOUT ROUTINES
// ============================================

export const getAllWorkoutRoutines = async (filters?: {
  userId?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<any[]> => {
  try {
    let query = supabase
      .from('workout_routines')
      .select(`
        *,
        user:user_profiles!workout_routines_user_id_fkey(
          id,
          full_name,
          email,
          phone,
          gym_code,
          avatar_url
        ),
        created_by_user:user_profiles!workout_routines_created_by_fkey(
          id,
          full_name
        )
      `)
      .order('created_at', { ascending: false });

    if (filters?.userId) {
      query = query.eq('user_id', filters.userId);
    }

    if (filters?.startDate) {
      const dateStr = filters.startDate.toISOString().split('T')[0];
      query = query.gte('created_at', dateStr);
    }

    if (filters?.endDate) {
      const dateStr = filters.endDate.toISOString().split('T')[0];
      query = query.lte('created_at', dateStr);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching workout routines:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllWorkoutRoutines:', error);
    return [];
  }
};

export const getWorkoutRoutine = async (routineId: string): Promise<any | null> => {
  try {
    const { data, error } = await supabase
      .from('workout_routines')
      .select(`
        *,
        user:user_profiles!workout_routines_user_id_fkey(
          id,
          full_name,
          email,
          phone,
          gym_code,
          avatar_url
        ),
        created_by_user:user_profiles!workout_routines_created_by_fkey(
          id,
          full_name
        )
      `)
      .eq('id', routineId)
      .single();

    if (error) {
      console.error('Error fetching workout routine:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getWorkoutRoutine:', error);
    return null;
  }
};

export const createWorkoutRoutine = async (
  userId: string,
  createdBy: string,
  routineData: Record<string, any>
): Promise<any | null> => {
  try {
    const { data, error } = await supabase
      .from('workout_routines')
      .insert({
        user_id: userId,
        created_by: createdBy,
        routine_data: routineData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select(`
        *,
        user:user_profiles!workout_routines_user_id_fkey(
          id,
          full_name,
          email,
          phone,
          gym_code,
          avatar_url
        ),
        created_by_user:user_profiles!workout_routines_created_by_fkey(
          id,
          full_name
        )
      `)
      .single();

    if (error) {
      console.error('Error creating workout routine:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createWorkoutRoutine:', error);
    throw error;
  }
};

export const updateWorkoutRoutine = async (
  routineId: string,
  updates: {
    routine_data?: Record<string, any>;
  }
): Promise<any | null> => {
  try {
    const { data, error } = await supabase
      .from('workout_routines')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', routineId)
      .select(`
        *,
        user:user_profiles!workout_routines_user_id_fkey(
          id,
          full_name,
          email,
          phone,
          gym_code,
          avatar_url
        ),
        created_by_user:user_profiles!workout_routines_created_by_fkey(
          id,
          full_name
        )
      `)
      .single();

    if (error) {
      console.error('Error updating workout routine:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateWorkoutRoutine:', error);
    throw error;
  }
};

export const deleteWorkoutRoutine = async (routineId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('workout_routines')
      .delete()
      .eq('id', routineId);

    if (error) {
      console.error('Error deleting workout routine:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteWorkoutRoutine:', error);
    throw error;
  }
};

