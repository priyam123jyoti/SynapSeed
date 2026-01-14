"use client"; // REQUIRED for hooks and animations

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Globe } from 'lucide-react';
// Changed to relative paths as requested
import { supabase } from '@/lib/supabase'; 
import { useAuth } from '@/contexts/AuthProvider'; 
import { useRouter, usePathname } from 'next/navigation'; // Next.js specific
import Link from 'next/link';

// Added '?' to user to make it optional and fix the TS error
export default function Navbar({ user: propUser }: { user?: any }) {
  const router = useRouter();
  const pathname = usePathname(); // This detects the URL automatically
  const [activeTab, setActiveTab] = useState('Home');
  const { user: contextUser } = useAuth(); 
  
  const user = propUser || contextUser;

  // Sync activeTab with the actual URL on load/change
  useEffect(() => {
    const currentLink = navLinks.find(link => link.path === pathname);
    if (currentLink) setActiveTab(currentLink.name);
  }, [pathname]);

  const handleAuth = async () => {
    if (user) {
      await supabase.auth.signOut(); 
    } else {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? window.location.origin : '', 
        },
      });
    }
  };

  const navLinks = [
    { name: 'Home', hasDropdown: false, path: '/' },
    { name: 'Study Abroad', hasDropdown: false, path: '/study-abroad' },
    { name: 'Albums', hasDropdown: true, path: '/albums' },
    { name: 'Career Hub', hasDropdown: false, path: '/career' },
    { name: 'Books', hasDropdown: false, path: '/books' },
  ];

  return (
    <nav className="w-full flex items-center justify-between px-8 py-6 bg-transparent font-sans relative z-50">
      
      {/* 1. Left Side: Moana AI Logo */}
      <Link href="/" className="flex items-center gap-3 cursor-pointer group">
        <div className="p-1 rounded-xl transition-all duration-300 shadow-sm overflow-hidden">
          <img 
            src="/moana-ai-logo.png"  // Pointing to public folder
            alt="Moana AI Logo" 
            className="w-10 rounded h-10 object-contain mix-blend-multiply" 
          />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-xl font-bold text-emerald-950 tracking-tight font-display">
            Synap<span className="text-emerald-600">Seed</span>
          </span>
          <span className="text-[10px] uppercase tracking-widest text-emerald-600/80 font-bold">
            Powered by Moana AI
          </span>
        </div>
      </Link>

      {/* 2. Center: The "Greenhouse" Glass Pill Menu */}
      <div className="hidden md:flex items-center bg-white/60 backdrop-blur-xl px-1.5 py-1.5 rounded-full shadow-lg shadow-emerald-100/50 border border-emerald-100/50">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.path}
            className={`relative px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
              activeTab === link.name ? 'text-white' : 'text-emerald-800 hover:text-emerald-600'
            }`}
          >
            {activeTab === link.name && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full shadow-md shadow-emerald-200"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ zIndex: -1 }} 
              />
            )}
            <span className="flex items-center hover:cursor-pointer gap-1 z-10 relative">
              {link.name}
              {link.hasDropdown && (
                <ChevronDown 
                  size={14} 
                  className={activeTab === link.name ? "text-emerald-100" : "text-emerald-400"} 
                />
              )}
            </span>
          </Link>
        ))}
        
        <div className="w-px h-5 bg-emerald-200/50 mx-2"></div>
        
        <button className="flex hover:cursor-pointer items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50 rounded-full transition-colors">
          <Globe size={16} className="text-emerald-600 " />
          <span>EN</span>
          <ChevronDown size={14} className="opacity-50" />
        </button>
      </div>

      {/* 3. Right Side: Premium Action Button */}
      <div>
        <button
          onClick={handleAuth}
          className="bg-emerald-900 text-emerald-50 text-sm font-semibold px-8 py-2.5 rounded-full shadow-lg shadow-emerald-900/20 border border-emerald-800 transition-all duration-300 ease-in-out hover:bg-emerald-800 hover:scale-105 hover:shadow-xl hover:shadow-emerald-900/30 cursor-pointer flex items-center gap-2 active:scale-95"
        >
          {user ? 'Logout' : 'Login'}
        </button>
      </div>

    </nav>
  );
}