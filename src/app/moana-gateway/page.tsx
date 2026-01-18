"use client";

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion'; 
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase'; 

// Constants & Components
import { MODES } from '@/constants/modes'; 
import Gateway3D from '@/components/moana-gateway/Gateway3D';
import BattleCard from '@/components/moana-gateway/BattleCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.08, delayChildren: 0.2 } 
  }, 
};

export default function MoanaGateway() {
  const router = useRouter();
  const [userName, setUserName] = useState("Researcher");

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.user_metadata?.full_name) {
        setUserName(data.user.user_metadata.full_name.split(' ')[0]);
      }
    };
    fetchUser();
  }, []);

  // Memoized to prevent BattleCard re-renders
  const handleNavigate = useCallback((path: string, subject: string, title: string) => {
    router.push(`${path}?subject=${subject}&name=${title}`);
  }, [router]);

  return (
    <div className="relative min-h-screen bg-[#020617] overflow-hidden flex flex-col">
      {/* 3D LAYER: Locked with memo() */}
      <Gateway3D />

      {/* UI LAYER */}
      <div className="relative z-10 flex-1 flex flex-col p-6 max-w-5xl mx-auto w-full">
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12 pt-4"
        >
          <button 
            onClick={() => router.push('/')} 
            className="p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all group outline-none"
          >
            <ArrowLeft size={20} className="text-white group-hover:-translate-x-1 transition-transform" />
          </button>
          
          <div className="text-right">
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">
              MOANA <span className="text-emerald-500 underline decoration-double underline-offset-4">V1.0</span>
            </h1>
            <p className="text-[16px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-1">
              HI, {userName}
            </p>
          </div>
        </motion.nav>

{/* Hero Section */}
<motion.div 
  initial={{ opacity: 0, x: -30 }} 
  animate={{ opacity: 1, x: 0 }} 
  transition={{ duration: 0.8, ease: "easeOut" }} // Smooth linear-ish ease
  className="mb-12 will-change-transform" // Hardware acceleration
>
  <h2 className="text-4xl font-black text-white leading-tight tracking-tight">          
    SELECT <br />
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 pb-2 block">
      BATTLE MODE
    </span>
  </h2>
  <div className="h-1.5 w-20 bg-emerald-500 mt-6 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
</motion.div>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-20"
        >
          {MODES.map((mode) => (
            <BattleCard key={mode.id} mode={mode} onNavigate={handleNavigate} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}