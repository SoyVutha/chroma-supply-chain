
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface ERPUser extends User {
  role?: 'inventory_manager' | 'production_worker' | 'customer_service' | 'admin';
}

interface ERPAuthContextType {
  user: ERPUser | null;
  session: Session | null;
  loading: boolean;
  userRole: 'inventory_manager' | 'production_worker' | 'customer_service' | 'admin';
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  setUserRole: (role: 'inventory_manager' | 'production_worker' | 'customer_service' | 'admin') => void;
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
  const [userRole, setUserRole] = useState<'inventory_manager' | 'production_worker' | 'customer_service' | 'admin'>('inventory_manager');

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('ERP Auth state changed:', event, session);
        setSession(session);
        
        if (session?.user) {
          // For ERP users, we add role information
          const erpUser: ERPUser = {
            ...session.user,
            role: userRole
          };
          setUser(erpUser);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('ERP Initial session:', session);
      setSession(session);
      
      if (session?.user) {
        const erpUser: ERPUser = {
          ...session.user,
          role: userRole
        };
        setUser(erpUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [userRole]);

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
