"use client"; // Required for audio, canvas-confetti, and motion

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface SyncCelebrationProps {
  score: number;
  onComplete: () => void;
}

export const SyncCelebration = ({ score, onComplete }: SyncCelebrationProps) => {
  const [status, setStatus] = useState('INITIALIZING...');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 🎵 Terminology & Asset Mapping (Preserved exactly from original)
  const getTierData = () => {
    if (score === 100) {
      return { 
        color: '#fbbf24', 
        audio: '/audio/hundred-percent.mp3', 
        delay: 7000, 
        label: "BOTANY GOD DETECTED" 
      }; 
    }
    if (score >= 80) {
      return { 
        color: '#10b981', 
        audio: '/audio/eighty-nineghty-percent.mp3', 
        delay: 5000, 
        label: "ELITE SYNC COMPLETE" 
      };
    }
    if (score >= 40) {
      return { 
        color: '#3b82f6', 
        audio: '/audio/fourty-saventy-percenty.mp3', 
        delay: 4500, 
        label: "UPLINK STABLE" 
      };
    }
    return { 
      color: '#ef4444', 
      audio: '/audio/below-thirty-percent.mp3', 
      delay: 4000, 
      label: "CRITICAL LINK FAILURE" 
    };
  };

  const tier = getTierData();

  useEffect(() => {
    // Audio initialization for Next.js environment
    audioRef.current = new Audio(tier.audio);
    audioRef.current.volume = 0.8;
    
    const playAudio = async () => {
      try {
        await audioRef.current?.play();
      } catch (err) {
        console.warn("Autoplay blocked. User must click 'Finish' to hear audio.");
      }
    };

    playAudio();

    const timeline = async () => {
      await new Promise(r => setTimeout(r, 800));
      setStatus('ANALYZING NEURAL DATA...');
      
      await new Promise(r => setTimeout(r, 1200));
      setStatus(tier.label);

      if (score === 100) {
        triggerRocketFirecrackers();
      } else if (score >= 80) {
        triggerStandardConfetti(tier.color);
      }

      // Wait for the specific audio duration before proceeding to Result Card
      await new Promise(r => setTimeout(r, tier.delay));
      onComplete();
    };

    timeline();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [score, onComplete, tier.audio, tier.delay, tier.label]);

  const triggerRocketFirecrackers = () => {
    const duration = 5000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 45, spread: 360, ticks: 100, zIndex: 300 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 60 * (timeLeft / duration);
      
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.4), y: randomInRange(0.2, 0.5) } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.6, 0.9), y: randomInRange(0.2, 0.5) } });
    }, 300);
  };

  const triggerStandardConfetti = (color: string) => {
    confetti({ 
      particleCount: 150, 
      spread: 80, 
      origin: { y: 0.6 }, 
      colors: [color, '#ffffff', '#ffd700'] 
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[250] flex flex-col items-center justify-center bg-[#020617] overflow-hidden"
    >
      {/* 🌟 God-Tier Pulsing Background (100% only) */}
      {score === 100 && (
        <motion.div 
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-yellow-500/10 pointer-events-none" 
        />
      )}

      {/* Neural Grid - Pure CSS Preservation */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,var(--tier-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--tier-color)_1px,transparent_1px)] bg-[size:45px_45px]" 
          style={{ '--tier-color': tier.color } as React.CSSProperties}
        />
      </div>

      {/* ROCKET STREAKS (Visual Logic Preserved) */}
      {score === 100 && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: '100vh', x: `${15 * i + 12}%`, opacity: 1 }}
              animate={{ y: '-20vh', opacity: 0 }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.3, ease: "circOut" }}
              className="absolute w-1 h-32 bg-gradient-to-t from-transparent via-yellow-400 to-white shadow-[0_0_20px_#fbbf24]"
            />
          ))}
        </div>
      )}

      {/* Main UI Circle */}
      <div className="relative z-20 flex flex-col items-center">
        <motion.div 
          animate={score === 100 ? { scale: [1, 1.1, 1], rotate: [0, 2, -2, 0] } : { scale: [1, 1.05, 1] }} 
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div 
            className="w-60 h-60 rounded-full border-4 flex flex-col items-center justify-center backdrop-blur-3xl shadow-2xl transition-all duration-500"
            style={{ 
              borderColor: tier.color, 
              backgroundColor: `${tier.color}15`, 
              boxShadow: `0 0 100px ${tier.color}30` 
            }}
          >
            <motion.span 
              animate={score === 100 ? { y: [0, -15, 0], scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: Infinity, duration: 0.4 }}
              className="text-8xl font-black text-white italic tracking-tighter drop-shadow-2xl"
            >
              {score}%
            </motion.span>
            <span className="text-xs font-mono font-bold mt-2 uppercase tracking-widest" style={{ color: tier.color }}>
              Sync Level
            </span>
          </div>
        </motion.div>

        {/* Dynamic Status Text */}
        <div className="mt-16 text-center px-6">
          <AnimatePresence mode="wait">
            <motion.h2 
              key={status}
              initial={{ scale: 0.5, opacity: 0, filter: 'blur(10px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              className="text-white text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none"
            >
              {status}
            </motion.h2>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};