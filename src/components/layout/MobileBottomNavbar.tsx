"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Globe, Image, Briefcase, BookOpen } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation'; // Next.js specific
import Link from 'next/link';

export default function MobileBottomNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState('Home');

  const tabs = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Study Abroad', icon: Globe, path: '/study-abroad' },
    { name: 'Albums', icon: Image, path: '/albums' },
    { name: 'Career Hub', icon: Briefcase, path: '/career' },
    { name: 'Books', icon: BookOpen, path: '/books' },
  ];

  // Sync state with URL if user navigates via browser back/forward or direct link
  useEffect(() => {
    const currentTab = tabs.find((tab) => tab.path === pathname);
    if (currentTab) {
      setActive(currentTab.name);
    }
  }, [pathname]);

  return (
    <div className="md:hidden fixed bottom-2 left-0 right-0 px-6 z-[100]">
      <div className="bg-white/80 backdrop-blur-xl border border-emerald-100 shadow-2xl shadow-emerald-900/10 rounded-[2rem] px-4 py-3 flex justify-between items-center relative">
        
        {tabs.map((tab) => {
          const isActive = active === tab.name;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.name}
              href={tab.path}
              onClick={() => setActive(tab.name)}
              className="relative flex flex-col items-center justify-center w-12 h-10 transition-colors duration-300"
            >
              {/* Active Background Glow */}
              {isActive && (
                <motion.div
                  layoutId="activeTabMobile" // Unique layoutId for mobile vs desktop
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
                  className="text-[8px] font-bold text-emerald-800 uppercase tracking-widest mt-1 relative z-10"
                >
                  {tab.name}
                </motion.span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}