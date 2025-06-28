import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: 'admin' | 'student' | 'advisor' | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, role?: 'student' | 'advisor', studentId?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'student' | 'advisor' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('AuthProvider initializing...');

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching user role for:', userId);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user role:', error);
        throw error;
      }
      
      console.log('User role fetched:', data.role);
      setUserRole(data.role);
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('student'); // Default to student
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          setUserRole(null);
          window.location.href = '/auth';
        } else if (session?.user) {
          setSession(session);
          setUser(session.user);
          // Defer role fetching to prevent deadlocks
          setTimeout(() => {
            fetchUserRole(session.user.id);
          }, 0);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    console.log('Checking for existing session...');
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        setError(error.message);
      } else {
        console.log('Existing session found:', !!session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          fetchUserRole(session.user.id);
        }
      }
      setLoading(false);
    }).catch((err) => {
      console.error('Failed to get session:', err);
      setError('Failed to initialize authentication');
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth subscription...');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (data.user && !error) {
        // Get user role to determine redirect
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();
        
        const role = roleData?.role || 'student';
        
        // Force page reload with role-appropriate redirect
        setTimeout(() => {
          if (role === 'advisor') {
            window.location.href = '/advisor/dashboard';
          } else {
            window.location.href = '/dashboard';
          }
        }, 100);
      }
      
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'student' | 'advisor' = 'student', studentId?: string) => {
    try {
      console.log('Attempting to sign up...');
      const redirectUrl = role === 'advisor' 
        ? `${window.location.origin}/advisor/dashboard`
        : `${window.location.origin}/dashboard`;
      
      const metadata: any = {
        full_name: fullName,
        role: role
      };

      // Add student_id to metadata if provided and role is student
      if (role === 'student' && studentId) {
        metadata.student_id = studentId;
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: metadata
        }
      });
      
      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Attempting to sign out...');
      // Clear local state first
      setUser(null);
      setSession(null);
      setUserRole(null);
      
      // Clear any stored auth tokens
      localStorage.removeItem('supabase.auth.token');
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Attempt to sign out from Supabase (don't throw if it fails)
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.log('Sign out error (continuing anyway):', error);
      }
      
      // Always redirect to auth page
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error during sign out:', error);
      // Even if there's an error, redirect to auth page
      window.location.href = '/auth';
    }
  };

  const value = {
    user,
    session,
    userRole,
    loading,
    error,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
