"use client"; 

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation'; 
import { useAuth } from '@/contexts/AuthProvider'; 

export default function AIFloatingButton({ user: propUser }: { user?: any }) {
  const router = useRouter();
  const { user: contextUser } = useAuth();
  
  const user = propUser || contextUser;
  const [isDenied, setIsDenied] = useState(false);

  const robotColors = [
    "#10b981", "#34d399", "#60a5fa", "#818cf8", "#a78bfa",
    "#fb7185", "#fb923c", "#facc15", "#22d3ee", "#ffffff"
  ];

  const handleProtectedNavigation = () => {
    if (user) {
      // UPGRADE: Pointing to your NEW folder name
      router.push('/moana-gateway'); 
    } else {
      setIsDenied(true); 
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-[100]">
      
      {/* ACCESS DENIED TOOLTIP */}
      <AnimatePresence>
        {isDenied && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: -20, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute bottom-full right-0 mb-6 w-64 p-5 bg-slate-950 border-2 border-red-500 rounded-[2rem] shadow-[0_0_50px_rgba(239,68,68,0.3)] backdrop-blur-2xl z-[110]"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-500/20 p-2 rounded-xl text-red-500">
                <ShieldAlert size={20} className="animate-pulse" />
              </div>
              <span className="text-white text-xs font-black uppercase tracking-widest">Security</span>
            </div>

            <h3 className="text-white text-xl font-black tracking-tighter mb-4 leading-none">
              LOGIN TO USE <span className="text-red-500 uppercase">MOANA</span>
            </h3>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDenied(false);
              }}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2 group/btn shadow-lg shadow-red-900/40 cursor-pointer"
            >
              <CheckCircle2 size={14} />
              Acknowledge & Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLOW EFFECT */}
      <motion.div
        animate={{
          scale: isDenied ? [1, 1.3, 1] : [1, 1.2, 1],
          opacity: isDenied ? [0.6, 0.9, 0.6] : [0.3, 0.6, 0.3],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className={`absolute inset-0 blur-2xl rounded-full transition-colors duration-700 ${
          isDenied ? 'bg-red-600' : 'bg-gradient-to-r from-emerald-400 to-cyan-500'
        }`}
      />

      {/* THE BUTTON */}
      <motion.button
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleProtectedNavigation}
        className={`relative group flex items-center gap-3 backdrop-blur-xl p-2 pr-6 rounded-full border transition-all duration-500 cursor-pointer ${
          isDenied 
            ? 'bg-red-950/90 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]' 
            : 'bg-slate-950/80 border-white/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
        }`}
      >
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className={`absolute inset-0 rounded-full opacity-20 blur-sm ${
              isDenied ? 'bg-red-500' : 'bg-gradient-to-tr from-emerald-500 to-teal-300'
            }`}
          />
          <div className={`relative p-3 rounded-full shadow-inner transition-colors duration-500 ${
            isDenied ? 'bg-gradient-to-br from-red-600 to-red-900' : 'bg-gradient-to-br from-emerald-600 to-teal-700'
          }`}>
            <motion.div
              animate={isDenied ? { color: "#ffffff" } : { color: robotColors }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="flex items-center justify-center"
            >
              <Bot size={22} />
            </motion.div>
          </div>
          <motion.div
            animate={{ y: [-10, 10, -10], x: [-1, 1, -1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-md"
          >
            <Sparkles size={10} className={isDenied ? "text-red-600" : "text-emerald-600"} />
          </motion.div>
        </div>

        <div className="flex flex-col items-start leading-none text-left">
          <span className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1 transition-colors ${
            isDenied ? 'text-red-400' : 'text-emerald-400'
          }`}>
            {isDenied ? 'Locked' : 'Research AI'}
          </span>
          <span className="text-sm font-medium text-slate-200">
            Meet Moana
          </span>
        </div>
      </motion.button>
    </div>
  );
}