"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Crown, LogOut, ShieldCheck, BarChart3, ChevronRight } from 'lucide-react';

import Navbar from '@/components/layout/Navbar';
import MobileBottomNavbar from '@/components/layout/MobileBottomNavbar';
import { ProfileIdentity } from '@/components/profile/ProfileIdentity';

export default function ProfilePage() {
  const { user, signOut }: any = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!user?.id) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) setProfile(data);
      setLoading(false);
    }
    fetchProfile();
  }, [user]);

  // Use username exactly as typed, fall back only if loading is finished and no name found
  const displayUsername = profile?.username || "User";

  return (
    <>
      <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 flex flex-col">
        <Navbar />

        <div className="flex-1 pb-32 lg:pb-12">
          {/* Header Banner */}
          <div className="h-64 bg-[#020617] w-full relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <div className="max-w-7xl mx-auto h-full px-6 md:px-12 relative flex items-end pb-12">
              <div className="flex items-center gap-8 translate-y-20">
                {/* Square Avatar */}
                <div className="w-40 h-40 bg-emerald-500 border-[10px] border-[#f8fafc] flex items-center justify-center text-5xl font-black text-white shadow-2xl overflow-hidden">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt={displayUsername} className="w-full h-full object-cover" />
                  ) : (
                    displayUsername.charAt(0).toUpperCase()
                  )}
                </div>
                
                <div className="mb-4 bg-white/10 backdrop-blur-md p-6 border border-white/20 min-w-[200px]">
                  {/* FIXED: Removed @ and conversion. Added Skeleton loader. */}
                  <h1 className="text-4xl font-black text-white tracking-tighter">
                    {loading ? (
                       <div className="w-32 h-8 bg-white/20 animate-pulse rounded" />
                    ) : (
                      displayUsername
                    )}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <main className="max-w-7xl mx-auto mt-32 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <ProfileIdentity profile={profile} loading={loading} />

              <section className="bg-white p-8 border-l-8 border-emerald-900 border-y border-r border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-6">
                    <Crown size={14} /> System Access Level
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Neural Pro Node</h3>
                      <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-wider">Unrestricted AI Hub Privileges</p>
                    </div>
                    <div className="bg-emerald-900 text-white px-4 py-1 text-[10px] font-black uppercase">Active</div>
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-6">
              {/* Stats Block */}
              <div className="grid grid-cols-2 gap-px bg-slate-200 border border-slate-200 shadow-sm">
                <div className="bg-white p-6 flex flex-col items-center">
                  <BarChart3 className="text-slate-300 mb-2" size={24} />
                  <div className="text-3xl font-black text-slate-900 tracking-tighter">42</div>
                  <div className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1 text-center">Neural Syncs</div>
                </div>
                <div className="bg-white p-6 flex flex-col items-center">
                  <ShieldCheck className="text-emerald-500 mb-2" size={24} />
                  <div className="text-xl font-black text-slate-900 tracking-tighter uppercase">Verified</div>
                  <div className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1 text-center">Node Integrity</div>
                </div>
              </div>

              {/* Console Commands */}
              <div className="bg-slate-900 text-white p-6 border border-slate-900 shadow-lg">
                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-6 border-b border-emerald-400/20 pb-2">Console Commands</h4>
                <div className="space-y-1">
                  {['Edit Profile', 'App Preferences'].map((item) => (
                    <button key={item} className="w-full flex items-center justify-between p-3 hover:bg-emerald-500 hover:text-white transition-all group border border-transparent hover:border-white/20">
                      <span className="text-[11px] font-black uppercase tracking-widest">{item}</span>
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                  <button 
                    onClick={async () => { await signOut(); router.push('/'); }}
                    className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-500 hover:text-white transition-all font-black text-[11px] uppercase tracking-widest mt-4 border border-red-500/20"
                  >
                    <LogOut size={14} /> Disconnect Link
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>

        <MobileBottomNavbar />
      </div>
    </>
  );
}