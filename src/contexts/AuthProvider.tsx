"use client"; // Mandatory for Next.js Context Providers

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase'; // Updated path to match your Next.js lib folder
import type { User } from '@supabase/supabase-js';

// 1. Define the shape of our Auth data
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// 2. Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Attempt to get the session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session) {
          setUser(session.user);
          setLoading(false); 
        } else {
          // 🚪 HOLD THE DOOR: 
          // Delaying helps with OAuth redirect state persistence in Next.js
          const timer = setTimeout(() => {
            setLoading(false);
          }, 1000);
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error("Auth Initialization Failed:", error);
        setUser(null);
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for real-time auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        setLoading(false);
      }
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Hook to use auth in any component
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};