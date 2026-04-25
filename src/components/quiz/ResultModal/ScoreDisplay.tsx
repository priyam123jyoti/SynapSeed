"use client";

import React, { memo } from 'react';
import { motion } from 'framer-motion';

interface ScoreDisplayProps {
  score: number;
  color: string;
}

export const ScoreDisplay = memo(({ score, color }: ScoreDisplayProps) => {
  const safeColor = color || "text-emerald-400";
  const glowColor = safeColor.replace('text', 'bg');

  return (
    <div className="relative mb-4 flex flex-col items-center select-none" aria-label={`Final Score: ${score} percent`}>
      {/* SEO DATA: Hidden text for search engine crawlers */}
      <span className="sr-only">The student achieved an accuracy score of {score}%.</span>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative flex items-center justify-center min-h-[160px]" // Min-height prevents Layout Shift
      >
        <div className={`absolute inset-0 blur-3xl opacity-20 ${glowColor} rounded-full animate-pulse`} aria-hidden="true" />
        
        <span className={`text-9xl font-black ${safeColor} tracking-tighter drop-shadow-2xl italic z-10`}>
          {score}
        </span>
        
        <span className={`text-3xl font-black ${safeColor} absolute -right-8 bottom-4`} aria-hidden="true">
          %
        </span>
      </motion.div>
      
      <div className="mt-2 text-[8px] text-white/20 font-bold tracking-[0.6em] uppercase">
        Accuracy_Coefficient_Syncing
      </div>
    </div>
  );
});

ScoreDisplay.displayName = 'ScoreDisplay';