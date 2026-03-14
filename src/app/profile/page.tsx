"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  User, Mail, Crown, LogOut, ShieldCheck, 
  BarChart3, Settings, ChevronRight, AlertCircle, ArrowLeft, Briefcase, GraduationCap
} from 'lucide-react';
import Link from 'next/link';

// --- INTEGRATING YOUR EXISTING COMPONENTS ---
import Navbar from '@/components/layout/Navbar';
import MobileBottomNavbar from '@/components/layout/MobileBottomNavbar';

export default function ProfilePage() {
  const { user, signOut }: any = useAuth();
  const router = useRouter();
  
  // Profile State
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (data) {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  // Avatar Logic: First letter of username (or email if loading)
  const displayString = profile?.username || user?.email || "U";
  const firstLetter = displayString.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <Navbar />

      <div className="flex-1 pb-32 lg:pb-12">
        {/* Profile Header / Banner */}
        <div className="h-48 bg-[#020617] w-full relative">
          <div className="max-w-7xl mx-auto h-full px-8 md:px-20 relative">
            <div className="absolute -bottom-16 flex items-end gap-6">
              
              {/* Profile Avatar Component */}
              <div className="w-32 h-32 rounded-[40px] bg-emerald-500 border-8 border-slate-50 flex items-center justify-center text-4xl font-black text-white shadow-xl select-none overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  firstLetter
                )}
              </div>
              
              <div className="mb-4">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  {loading ? '...' : `@${profile?.username || user?.email?.split('@')[0]}`}
                </h1>
                <p className="text-slate-500 font-bold text-sm flex items-center gap-2 mt-1">
                  <Mail size={14} /> {user?.email}
                </p>
              </div>
            </div>
            
            <Link 
              href="/ai-hub" 
              className="absolute top-8 right-8 hidden lg:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white text-[10px] font-black uppercase tracking-widest transition-all"
            >
              <ArrowLeft size={14} /> Back to AI Hub
            </Link>
          </div>
        </div>

        {/* Main Content Grid */}
        <main className="max-w-7xl mx-auto mt-24 px-8 md:px-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: IDENTITY, SUBSCRIPTION & USAGE */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* NEW: Neural Identity Card */}
            <section className="bg-white rounded-[40px] p-8 border border-slate-200 shadow-sm relative overflow-hidden">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-6 flex items-center gap-2">
                <User size={14} /> Neural Identity
              </h4>
              
              {loading ? (
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Bio */}
                  {profile?.bio && (
                    <p className="text-slate-700 font-medium leading-relaxed">
                      "{profile.bio}"
                    </p>
                  )}
                  
                  {/* Occupation & Institution */}
                  <div className="flex flex-wrap gap-4 pt-2">
                    {profile?.occupation && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 border border-slate-100">
                        <Briefcase size={14} className="text-emerald-500" />
                        {profile.occupation}
                      </div>
                    )}
                    {profile?.institution && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 border border-slate-100">
                        <GraduationCap size={14} className="text-emerald-500" />
                        {profile.institution}
                      </div>
                    )}
                  </div>

                  {/* Interests Tags */}
                  {profile?.interests && profile.interests.length > 0 && (
                    <div className="pt-6 border-t border-slate-100">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Trained Interests</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.interests.map((tag: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-bold border border-emerald-100">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Subscription Card */}
            <section className="bg-white rounded-[40px] p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                <Crown size={120} className="text-emerald-500" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-6">
                  <Crown size={14} /> Membership Status
                </div>
                
                <div className="flex justify-between items-start md:items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight">Neural Pro Plan</h3>
                    <p className="text-slate-500 font-medium mt-1">Full access to advanced mapping logic & AI Hub</p>
                  </div>
                  <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full font-black text-[10px] uppercase tracking-widest">
                    Active
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-4">
                  <button className="px-6 py-3 bg-emerald-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-md active:scale-95">
                    Manage Billing
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT: ACCOUNT SETTINGS */}
          <div className="space-y-6">
            
            {/* Stats (Moved to right column to balance the layout) */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
                  <BarChart3 className="text-slate-300 mb-3" size={20} />
                  <div className="text-2xl font-black text-slate-900 tracking-tighter">42</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Neural Links</div>
               </div>
               <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
                  <ShieldCheck className="text-emerald-400 mb-3" size={20} />
                  <div className="text-2xl font-black text-slate-900 tracking-tighter">Active</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Identity Status</div>
               </div>
            </div>

            {/* Account Control */}
            <div className="bg-white rounded-[40px] p-6 border border-slate-200 shadow-sm overflow-hidden">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-2">Account Control</h4>
              
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group">
                  <div className="flex items-center gap-3 text-emerald-900">
                    <User size={18} className="text-slate-400" />
                    <span className="text-sm font-bold">Edit Profile</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group">
                  <div className="flex items-center gap-3 text-emerald-900">
                    <Settings size={18} className="text-slate-400" />
                    <span className="text-sm font-bold">App Preferences</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="pt-4 mt-4 border-t border-slate-100">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold text-sm"
                  >
                    <LogOut size={18} />
                    Disconnect Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <MobileBottomNavbar />
    </div>
  );
}