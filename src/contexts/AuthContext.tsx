import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { getUserProfile } from '@/services/database';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: 'client' | 'admin' | 'instructor' | null;
  isAdmin: boolean;
  isInstructor: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<'client' | 'admin' | 'instructor' | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user role from profile (non-blocking)
  const loadUserRole = async (userId: string) => {
    // Don't block loading state - set default immediately
    setUserRole('client');
    
    // Try to load actual role in background
    try {
      console.log('Loading user role for userId:', userId);
      const profile = await getUserProfile(userId);
      console.log('Profile loaded:', profile);
      if (profile?.role) {
        console.log('Setting user role to:', profile.role);
        setUserRole(profile.role as 'client' | 'admin' | 'instructor');
      } else {
        console.warn('Profile loaded but no role found, using default client');
      }
    } catch (error: any) {
      console.error('Error loading user role:', error);
      // Silently fail - we already set default to 'client'
      if (error?.code !== 'PGRST204' && !error?.message?.includes('schema cache')) {
        console.warn('Could not load user role, using default:', error);
      }
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Set loading to false immediately - don't wait for role
      setLoading(false);
      
      // Load role in background (non-blocking)
      if (session?.user) {
        loadUserRole(session.user.id);
      } else {
        setUserRole(null);
      }
    }).catch((error) => {
      console.error('Error getting session:', error);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Set loading to false immediately - don't wait for role
      setLoading(false);
      
      // Load role in background (non-blocking)
      if (session?.user) {
        loadUserRole(session.user.id);
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    // If signup successful, create user profile
    if (data.user && !error) {
      // The profile will be created automatically via a database trigger or manually
      // For now, we'll just return the error if any
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    userRole,
    isAdmin: userRole === 'admin',
    isInstructor: userRole === 'instructor',
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

