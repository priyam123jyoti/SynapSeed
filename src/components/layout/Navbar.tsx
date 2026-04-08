"use client"; 

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase'; 
import { useAuth } from '@/contexts/AuthProvider'; 
import { useRouter, usePathname } from 'next/navigation'; 
import Link from 'next/link';
import Image from 'next/image';
import AuthGuardModal from '@/components/auth/AuthGuardModal';

export default function Navbar({ user: propUser }: { user?: any }) {
  const router = useRouter();
  const pathname = usePathname(); 
  const [activeTab, setActiveTab] = useState('Home');
  const [isGuardOpen, setIsGuardOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const { user: contextUser } = useAuth(); 
  
  const user = propUser || contextUser;

  useEffect(() => {
    async function getProfile() {
      if (user?.id) {
        setFetchingProfile(true);
        const { data } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user.id)
          .single();
        if (data) setProfile(data);
        setFetchingProfile(false);
      }
    }
    getProfile();
  }, [user]);

  const navLinks = [
    { name: 'Home', hasDropdown: false, path: '/' },
    { name: 'Study Abroad', hasDropdown: false, path: '/global-study' },
    { name: 'Leaderboard', hasDropdown: true, path: '/leaderboard' },
    { name: 'Mind Maps', hasDropdown: false, path: '/ai-hub', protected: true },
    { name: 'SynapStore', hasDropdown: false, path: '/affiliate-store' },
  ];

  useEffect(() => {
    const currentLink = navLinks.find(link => link.path === pathname);
    if (currentLink) setActiveTab(currentLink.name);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent, link: any) => {
    if (link.protected && !user) {
      e.preventDefault();
      setIsGuardOpen(true);
    }
  };

  const handleAuth = async () => {
    if (!user) {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/onboarding`, 
        },
      });
    }
  };

  // Logic for the Avatar fallback letter
  const initial = profile?.username?.charAt(0) || user?.email?.charAt(0) || "U";

  return (
    <>
      <nav className="w-full flex items-center justify-between px-8 py-6 bg-transparent font-sans relative z-50">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="p-1 rounded-xl transition-all duration-300 shadow-sm overflow-hidden bg-white/10">
            <Image src="/moana-ai-logo.png" alt="Logo" width={40} height={40} className="rounded object-contain" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-bold text-emerald-950 tracking-tight">Synap<span className="text-emerald-600">Seed</span></span>
            <span className="text-[10px] uppercase tracking-widest text-emerald-600/80 font-bold">Powered by Moana AI</span>
          </div>
        </Link>

        {/* Center: Menu */}
        <div className="hidden md:flex items-center bg-white/60 backdrop-blur-xl px-1.5 py-1.5 rounded-full shadow-lg border border-emerald-100/50">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={(e) => handleNavClick(e, link)}
              className={`relative px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                activeTab === link.name ? 'text-white' : 'text-emerald-800 hover:text-emerald-600'
              }`}
            >
              {activeTab === link.name && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full shadow-md"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  style={{ zIndex: -1 }} 
                />
              )}
              <span className="flex items-center gap-1 z-10 relative">
                {link.name}
                {link.hasDropdown && <ChevronDown size={14} />}
              </span>
            </Link>
          ))}
        </div>

        {/* Right Side: Auth / Dynamic Profile Button */}
        <div>
          {user ? (
            <Link 
              href="/profile" 
              className="flex items-center gap-3 p-1 pr-2 md:pr-4 rounded-full bg-white/40 hover:bg-white/70 border border-emerald-100/50 shadow-sm transition-all group active:scale-95"
            >
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-emerald-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-emerald-700 font-bold text-sm md:text-base">{initial.toUpperCase()}</span>
                )}
              </div>
              
              {/* FIXED: No Gmail fallback. Shows skeleton while fetching. */}
              <span className="hidden md:block text-sm font-bold text-emerald-900 truncate max-w-[120px]">
                {fetchingProfile ? (
                  <div className="w-16 h-4 bg-emerald-200/50 animate-pulse rounded" />
                ) : (
                  profile?.username || "Identity"
                )}
              </span>
            </Link>
          ) : (
            <button 
              onClick={handleAuth} 
              className="bg-emerald-900 text-emerald-50 text-sm font-semibold px-8 py-2.5 rounded-full shadow-lg transition-all hover:bg-emerald-800 active:scale-95 cursor-pointer"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      <AuthGuardModal 
        isOpen={isGuardOpen} 
        onClose={() => setIsGuardOpen(false)} 
        title="MIND MAPS" 
      />
    </>
  );
}