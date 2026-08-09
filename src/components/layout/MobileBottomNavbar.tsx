"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Globe, Trophy, Network, BookOpen } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// Import the AuthGuardModal you created
import AuthGuardModal from '@/components/auth/AuthGuardModal';

export default function MobileBottomNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState('Home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const tabs = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Study Abroad', icon: Globe, path: '/global-study' },
    { name: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
    { name: 'Mind Map', icon: Network, path: '/text-to-mind-maps', protected: true },
    { name: 'SynapStore', icon: BookOpen, path: '/affiliate-store' },
  ];

  useEffect(() => {
    const currentTab = tabs.find((tab) => tab.path === pathname);
    if (currentTab) {
      setActive(currentTab.name);
    }
  }, [pathname]);

  // Handle Tab Clicks
  const handleTabClick = async (e: React.MouseEvent, tab: typeof tabs[0]) => {
    // Only intercept the "Mind Map" path
    if (tab.path === '/ai-hub') {
      e.preventDefault(); // Stop the automatic Link navigation
      
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setIsAuthModalOpen(true);
        return;
      }
    }
    
    // If user is logged in (or it's a different tab), go to the path
    setActive(tab.name);
    router.push(tab.path);
  };

  return (
    <>
      <div className="md:hidden fixed bottom-2 left-0 right-0 px-6 z-[100]">
        <div className="bg-white/80 backdrop-blur-xl border border-emerald-100 shadow-2xl shadow-emerald-900/10 rounded-[2rem] px-4 py-3 flex justify-between items-center relative">
          
          {tabs.map((tab) => {
            const isActive = active === tab.name;
            const Icon = tab.icon;

            return (
              <button
                key={tab.name}
                onClick={(e) => handleTabClick(e, tab)}
                className="relative flex flex-col items-center justify-center w-12 h-10 transition-colors duration-300 outline-none"
              >
                {/* Active Background Glow */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabMobile"
                    className="absolute inset-0 bg-emerald-50 rounded-2xl"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                <Icon 
                  size={20} 
                  className={`relative z-10 transition-colors duration-300 ${
                    isActive ? 'text-emerald-700' : 'text-purple-700'
                  }`} 
                />
                
                {isActive && (
                  <motion.span 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[8px] font-bold text-emerald-800 uppercase tracking-widest mt-1 relative z-10 text-center"
                  >
                    {tab.name}
                  </motion.span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Auth Gate Modal */}
      <AuthGuardModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        title="Mind Map AI" 
      />
    </>
  );
}