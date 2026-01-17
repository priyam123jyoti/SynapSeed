"use client";

import { memo } from 'react';
import { motion, Variants } from 'framer-motion'; // Added Variants type import
import { Sparkles } from 'lucide-react';

// Using 'as const' fixes the "type: string is not assignable" error
const cardVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)", 
    transition: { 
      type: "spring", 
      damping: 25, 
      stiffness: 100 
    } 
  },
} as const; 

interface BattleCardProps {
  mode: any;
  onNavigate: (path: string, subject: string, title: string) => void;
}

const BattleCard = ({ mode, onNavigate }: BattleCardProps) => {
  return (
    <motion.button
      variants={cardVariants as Variants} // Cast here to satisfy the prop type
      whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.03)" }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onNavigate(mode.path, mode.subjectKey, mode.title)}
      className="group relative overflow-hidden p-6 bg-transparent backdrop-blur-md border border-white/10 rounded-[2rem] text-left hover:border-emerald-500/40 transition-all duration-500 outline-none"
    >
      <div className="flex items-start gap-5 relative z-10">
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${mode.color} shadow-lg group-hover:rotate-6 transition-transform`}>
          <mode.icon size={26} className="text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            {mode.title}
            <Sparkles size={14} className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-sm text-slate-400 mt-1">{mode.desc}</p>
        </div>
      </div>
      
      {/* Background Glow Effect */}
      <div className={`absolute -right-6 -bottom-6 w-32 h-32 bg-gradient-to-br ${mode.color} blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-700`} />
    </motion.button>
  );
};

export default memo(BattleCard);