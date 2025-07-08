
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface ERPUser extends User {
  role?: 'inventory_manager' | 'customer_service' | 'admin';
}

interface ERPAuthContextType {
  user: ERPUser | null;
  session: Session | null;
  loading: boolean;
  userRole: 'inventory_manager' | 'customer_service' | 'admin';
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  setUserRole: (role: 'inventory_manager' | 'customer_service' | 'admin') => void;
}

const ERPAuthContext = createContext<ERPAuthContextType | undefined>(undefined);

export const useERPAuth = () => {
  const context = useContext(ERPAuthContext);
  if (context === undefined) {
    throw new Error('useERPAuth must be used within an ERPAuthProvider');
  }
  return context;
};

export const ERPAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ERPUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'inventory_manager' | 'customer_service' | 'admin'>('inventory_manager');

  const validateERPUser = async (session: Session | null) => {
    if (!session?.user) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // Check if user has a worker profile (ERP staff)
      const { data: workerProfile, error } = await supabase
        .from('worker_profiles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (error || !workerProfile) {
        // User is not an ERP worker, sign them out
        console.log('Non-ERP user attempted to access ERP system');
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setLoading(false);
        return;
      }

      // Valid ERP user - set their role and user data
      const erpUser: ERPUser = {
        ...session.user,
        role: workerProfile.role as 'inventory_manager' | 'customer_service' | 'admin'
      };
      
      setUser(erpUser);
      setUserRole(workerProfile.role as 'inventory_manager' | 'customer_service' | 'admin');
    } catch (error) {
      console.error('Error validating ERP user:', error);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('ERP Auth state changed:', event, session);
        setSession(session);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // Defer validation to prevent potential deadlocks
          setTimeout(() => {
            validateERPUser(session);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('ERP Initial session:', session);
      setSession(session);
      validateERPUser(session);
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

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    userRole,
    signIn,
    signOut,
    setUserRole,
  };

  return <ERPAuthContext.Provider value={value}>{children}</ERPAuthContext.Provider>;
};
