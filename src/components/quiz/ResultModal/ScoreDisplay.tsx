"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface ScoreDisplayProps {
  score: number;
  color: string;
}

export const ScoreDisplay = ({ score, color }: ScoreDisplayProps) => (
  <div className="relative mb-4 flex flex-col items-center select-none">
    <motion.div
      initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 0.2 
      }}
      className="relative flex items-center justify-center"
    >
      {/* Background Pulse Shadow */}
      <div className={`absolute inset-0 blur-3xl opacity-20 ${color.replace('text', 'bg')} rounded-full animate-pulse`} />
      
      <span className={`text-9xl font-black ${color} tracking-tighter drop-shadow-2xl italic z-10`}>
        {score}
      </span>
      
      <motion.span 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`text-3xl font-black ${color} absolute -right-8 bottom-4`}
      >
        %
      </motion.span>
    </motion.div>
    
    {/* Technical Metadata Line */}
    <div className="mt-2 text-[8px] text-white/20 font-bold tracking-[0.6em] uppercase">
      Accuracy_Coefficient_Syncing
    </div>
  </div>
);