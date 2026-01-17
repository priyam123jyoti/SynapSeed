"use client";

import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface SyncCelebrationProps {
  score: number;
  onComplete: () => void;
}

export const SyncCelebration = ({ score, onComplete }: SyncCelebrationProps) => {
  const [status, setStatus] = useState('INITIALIZING...');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // OPTIMIZATION: Memoize Tier Data to prevent object recreation
  const tier = useMemo(() => {
    if (score === 100) return { color: '#fbbf24', audio: '/audio/hundred-percent.mp3', delay: 7000, label: "BOTANY GOD DETECTED", particles: 'rocket' };
    if (score >= 80) return { color: '#10b981', audio: '/audio/eighty-nineghty-percent.mp3', delay: 5000, label: "ELITE SYNC COMPLETE", particles: 'standard' };
    if (score >= 40) return { color: '#3b82f6', audio: '/audio/fourty-saventy-percenty.mp3', delay: 4500, label: "UPLINK STABLE", particles: 'none' };
    return { color: '#ef4444', audio: '/audio/below-thirty-percent.mp3', delay: 4000, label: "CRITICAL LINK FAILURE", particles: 'none' };
  }, [score]);

  // OPTIMIZATION: Use useCallback for side-effect triggers
  const triggerConfetti = useCallback(() => {
    if (tier.particles === 'rocket') {
      const duration = 5000;
      const animationEnd = Date.now() + duration;
      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        confetti({ particleCount: 40, spread: 360, origin: { x: Math.random() * 0.3 + 0.1, y: Math.random() * 0.3 + 0.2 } });
        confetti({ particleCount: 40, spread: 360, origin: { x: Math.random() * 0.3 + 0.6, y: Math.random() * 0.3 + 0.2 } });
      }, 400);
    } else if (tier.particles === 'standard') {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: [tier.color, '#ffffff'] });
    }
  }, [tier]);

  useEffect(() => {
    audioRef.current = new Audio(tier.audio);
    audioRef.current.volume = 0.8;
    audioRef.current.play().catch(() => console.warn("Audio blocked"));

    const runTimeline = async () => {
      await new Promise(r => setTimeout(r, 800));
      setStatus('ANALYZING NEURAL DATA...');
      await new Promise(r => setTimeout(r, 1200));
      setStatus(tier.label);
      triggerConfetti();
      await new Promise(r => setTimeout(r, tier.delay));
      onComplete();
    };

    runTimeline();
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [tier, onComplete, triggerConfetti]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[250] flex flex-col items-center justify-center bg-[#020617] overflow-hidden will-change-opacity"
    >
      {/* 0 LAG: Using CSS Variables for dynamic colors to avoid inline style re-paints */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ background: `radial-gradient(circle at center, ${tier.color}33 0%, transparent 70%)` }} />
      
      <div className="relative z-20 flex flex-col items-center">
        <motion.div 
          animate={{ scale: [1, 1.03, 1] }} 
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-64 h-64 rounded-full border-2 flex flex-col items-center justify-center backdrop-blur-3xl shadow-2xl"
          style={{ borderColor: tier.color, backgroundColor: `${tier.color}05` }}
        >
          <span className="text-8xl font-black text-white italic tracking-tighter">{score}%</span>
        </motion.div>

        <div className="mt-16 text-center h-20"> {/* Fixed height prevents layout shift */}
          <AnimatePresence mode="wait">
            <motion.h2 
              key={status}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-white text-5xl md:text-7xl font-black italic uppercase tracking-tighter"
            >
              {status}
            </motion.h2>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};