"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Beaker, Zap } from 'lucide-react';

interface Props {
  topic: string | null;
}

export const LoadingScreen = ({ topic }: Props) => (
  <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center font-mono selection:bg-emerald-500/30">
    <div className="relative">
      {/* Moana Orbital Ring */}
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
        className="absolute inset-0 border-2 border-t-emerald-500 border-r-transparent border-b-emerald-900/30 border-l-transparent rounded-full w-24 h-24 -m-6"
      />
      
      {/* Core Biological Scanner Icon */}
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1],
          filter: ["drop-shadow(0 0 0px #10b981)", "drop-shadow(0 0 15px #10b981)", "drop-shadow(0 0 0px #10b981)"]
        }} 
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="flex items-center justify-center"
      >
        <Beaker size={48} className="text-emerald-400" />
      </motion.div>

      {/* Rotating Data Bits */}
      <motion.div 
        animate={{ rotate: -360 }} 
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        className="absolute inset-0 w-24 h-24 -m-6 flex items-start justify-center"
      >
        <Zap size={10} className="text-emerald-500" />
      </motion.div>
    </div>

    {/* Text Logic */}
    <div className="mt-16 text-center space-y-4">
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-black text-white tracking-tighter uppercase"
      >
        MOANA <span className="text-emerald-500 underline decoration-double underline-offset-8">V1.0</span> INITIALIZING
      </motion.h2>

      <div className="flex flex-col items-center gap-2">
        <p className="text-[10px] text-emerald-500/80 font-bold tracking-[0.4em] uppercase">
          Neural Link: Establishing Connection
        </p>
        
        <div className="h-1 w-48 bg-slate-800 rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400 to-transparent w-1/2"
          />
        </div>

        <p className="mt-2 text-[11px] text-slate-400 font-bold tracking-widest uppercase animate-pulse">
          {topic ? `SYNCING ${topic} ARCHIVES...` : "CONFIGURING PROTOCOL..."}
        </p>
      </div>
    </div>

    {/* Technical Footnote */}
    <div className="absolute bottom-10 text-[8px] text-emerald-900 font-bold tracking-[0.5em] uppercase">
      Quantum_Processor_Active // Biometric_Check_Passed
    </div>
  </div>
);