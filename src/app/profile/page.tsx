// src/app/profile/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/hooks/useProfile'; 
import { supabase } from '@/lib/supabase';

// Layout & Global Components
import Navbar from '@/components/layout/Navbar';
import MobileBottomNavbar from '@/components/layout/MobileBottomNavbar';

// Profile Specific Sub-components
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileIdentity } from '@/components/profile/ProfileIdentity';
import { MoanaSubscription } from '@/components/profile/MoanaSubscription';
import { LogoutModal } from '@/components/profile/LogoutModal';

export default function ProfilePage() {
  const router = useRouter();
  const { profile, loading } = useProfile();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 pb-32">
        {/* Banner & Avatar Section */}
        <ProfileHeader 
          profile={profile} 
          loading={loading} 
          onEdit={() => router.push('/profile/edit')} 
        />

        <div className="max-w-4xl mx-auto px-6 mt-24 space-y-12">
          {/* Detailed Info Section */}
          <ProfileIdentity profile={profile} loading={loading} />

          {/* Subscription/Status Card */}
          <MoanaSubscription />

          {/* Logout Anchor */}
          <div className="pt-8 border-t border-slate-100 flex justify-center">
            <button 
              onClick={() => setShowLogoutConfirm(true)}
              className="text-red-500 text-[10px] font-black uppercase tracking-[0.25em] hover:opacity-60 transition-all"
            >
              Terminate Session?
            </button>
          </div>
        </div>
      </main>

      <MobileBottomNavbar />

      {/* Conditional Modals */}
      {showLogoutConfirm && (
        <LogoutModal 
          onConfirm={handleLogout} 
          onClose={() => setShowLogoutConfirm(false)} 
        />
      )}
    </div>
  );
}