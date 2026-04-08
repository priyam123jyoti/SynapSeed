"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthProvider'; // Assuming your provider has a useAuth hook
//import EditProfile from './EditProfile'; // The component we built earlier

export default function OnboardingCheck({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [tempUsername, setTempUsername] = useState("");

  useEffect(() => {
    async function checkOnboarding() {
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('username, has_onboarded')
        .eq('id', user.id)
        .single();

      // If they haven't finished onboarding, show the modal
      if (profile && !profile.has_onboarded) {
        setTempUsername(profile.username);
        setShowModal(true);
      }
    }

    checkOnboarding();
  }, [user]);

  return (
    <>
      {children}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#D4E4BC]/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
            {/* <EditProfile 
              userId={user?.id} 
              initialUsername={tempUsername} 
              onComplete={() => setShowModal(false)} 
            /> */}
          </div>
        </div>
      )}
    </>
  );
}