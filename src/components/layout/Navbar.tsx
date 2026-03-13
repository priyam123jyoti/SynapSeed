"use client"; 

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Globe } from 'lucide-react';
import { supabase } from '@/lib/supabase'; 
import { useAuth } from '@/contexts/AuthProvider'; 
import { useRouter, usePathname } from 'next/navigation'; 
import Link from 'next/link';
import Image from 'next/image';
import AuthGuardModal from '@/components/auth/AuthGuardModal'; // Import the new component

export default function Navbar({ user: propUser }: { user?: any }) {
  const router = useRouter();
  const pathname = usePathname(); 
  const [activeTab, setActiveTab] = useState('Home');
  const [isGuardOpen, setIsGuardOpen] = useState(false); // Modal state
  const { user: contextUser } = useAuth(); 
  
  const user = propUser || contextUser;

  const navLinks = [
    { name: 'Home', hasDropdown: false, path: '/' },
    { name: 'Study Abroad', hasDropdown: false, path: '/global-study' },
    { name: 'Leaderboard', hasDropdown: true, path: '/leaderboard' },
    { name: 'Mind Maps', hasDropdown: false, path: '/ai-hub', protected: true }, // Added protected flag
    { name: 'SynapStore', hasDropdown: false, path: '/affiliate-store' },
  ];

  useEffect(() => {
    const currentLink = navLinks.find(link => link.path === pathname);
    if (currentLink) setActiveTab(currentLink.name);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent, link: any) => {
    if (link.protected && !user) {
      e.preventDefault(); // Stop navigation
      setIsGuardOpen(true); // Open the modal
    }
  };

  const handleAuth = async () => {
    if (user) {
      await supabase.auth.signOut(); 
      router.refresh();
    } else {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? window.location.origin : '', 
        },
      });
    }
  };

  return (
    <>
      <nav className="w-full flex items-center justify-between px-8 py-6 bg-transparent font-sans relative z-50">
        {/* ... Logo Section ... */}
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
              onClick={(e) => handleNavClick(e, link)} // Added click handler
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
          {/* ... Language Button ... */}
        </div>

        {/* Right Side: Auth */}
        <div>
          <button onClick={handleAuth} className="bg-emerald-900 text-emerald-50 text-sm font-semibold px-8 py-2.5 rounded-full shadow-lg transition-all hover:bg-emerald-800 active:scale-95 cursor-pointer">
            {user ? 'Logout' : 'Login'}
          </button>
        </div>
      </nav>

      {/* The Guard Modal Component */}
      <AuthGuardModal 
        isOpen={isGuardOpen} 
        onClose={() => setIsGuardOpen(false)} 
        title="MIND MAPS" 
      />
    </>
  );
}