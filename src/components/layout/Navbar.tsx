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
  
  // Profile State
  const [profile, setProfile] = useState<any>(null);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  
  const { user: contextUser } = useAuth(); 
  const user = propUser || contextUser;

  // 1. STACK TRACE FIX: Only fetch profile if user exists. 
  // Reset profile when user logs out to prevent data ghosting.
  useEffect(() => {
    async function getProfile() {
      if (!user?.id) {
        setProfile(null);
        setFetchingProfile(false);
        return;
      }

      setFetchingProfile(true);
      const { data } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single();
      
      if (data) {
        setProfile(data);
      }
      setFetchingProfile(false);
    }
    getProfile();
  }, [user?.id]);

  const navLinks = [
    { name: 'Home', hasDropdown: false, path: '/' },
    { name: 'Leaderboard', hasDropdown: true, path: '/leaderboard' },
    { name: 'Mind Maps', hasDropdown: false, path: '/text-to-mind-maps', protected: true },
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

  const handleAuth = () => {
    if (!user) {
      router.push('/onboarding');
    }
  };

  // 2. LOGIC FIX: No Gmail fallbacks. 
  // If no username exists yet, we use a generic "Seed" or just the Loading state.
  const initial = profile?.username?.charAt(0) || "S";

  return (
    <>
      <nav className="w-full flex items-center justify-between px-8 py-6 bg-transparent font-sans relative z-50">
        

          <div className="flex flex-col leading-none">
            <span className="text-xl font-bold text-emerald-950 tracking-tight">Department of<span className="text-emerald-600"> Botany</span></span>
            <span className="text-[10px] uppercase tracking-widest text-emerald-600/80 font-bold">Powered by Moana AI</span>
          </div>

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
                {/* 3. AVATAR FIX: Use skeleton if fetching, otherwise show profile pic or clean initial */}
                {fetchingProfile ? (
                  <div className="w-full h-full bg-emerald-200 animate-pulse" />
                ) : profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-emerald-700 font-bold text-sm md:text-base uppercase">{initial}</span>
                )}
              </div>
              
              {/* 4. TEXT FIX: Strictly wait for fetchingProfile to be false */}
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
              Register
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