"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Moana Atom Components (Ensure these are in your ResultModal subfolder)
import { RankBadge } from './ResultModal/RankBadge';
import { ScoreDisplay } from './ResultModal/ScoreDisplay';
import { ActionButtons } from './ResultModal/ActionButtons';
import { SyncCelebration } from './ResultModal/SyncCelebration';

interface ResultsModalProps {
  score: number;
  onReview: () => void;
  onTerminate: () => void;
  onRestart: () => void;
}

export const ResultsModal = ({ score, onReview, onTerminate, onRestart }: ResultsModalProps) => {
  // Phase Controller: syncing (celebration) -> display (result card)
  const [phase, setPhase] = useState<'syncing' | 'display'>('syncing');

  // Moana Neural Index: Rank Logic
  const getRankData = () => {
    if (score === 100) return { 
        title: "BIOLOGICAL DEITY • MOANA_SAPIEN", 
        sub: "NEURAL SYNC PERFECT. STATUS: EVOLVED. 🔥🔥",
        color: "text-yellow-400", 
        border: "border-yellow-500/50",
        bg: "bg-yellow-400/10",
        glow: "shadow-[0_0_60px_rgba(250,204,21,0.4)]"
    };
    if (score >= 80) return { 
        title: "APEX RESEARCHER", 
        sub: "Excellent. Genetic potential maximized.",
        color: "text-emerald-400", 
        border: "border-emerald-500/50",
        bg: "bg-emerald-400/10",
        glow: "shadow-[0_0_50px_rgba(16,185,129,0.3)]"
    };
    if (score >= 70) return { 
        title: "MASTER ANALYST", 
        sub: "PROTOCOL SUCCESSFUL. NEARING GENIUS THRESHOLD.",
        color: "text-cyan-400", 
        border: "border-cyan-500/40",
        bg: "bg-cyan-400/10",
        glow: "shadow-[0_0_50px_rgba(34,211,238,0.2)]"
    };
    if (score >= 60) return { 
        title: "FIELD SPECIALIST", 
        sub: "Data confirmed. But can you break the species limit?",
        color: "text-blue-400", 
        border: "border-blue-500/30",
        bg: "bg-blue-400/10",
        glow: "shadow-[0_0_50px_rgba(59,130,246,0.2)]"
    };
    if (score >= 50) return { 
        title: "SURVIVALIST", 
        sub: "Baseline achieved. Optimization required for next cycle.",
        color: "text-indigo-400", 
        border: "border-indigo-500/30",
        bg: "bg-indigo-400/10",
        glow: "shadow-[0_0_40px_rgba(99,102,241,0.2)]"
    };
    if (score >= 40) return { 
        title: "EMBRYO STAGE",
        sub: "Growth is inevitable. Review the neural data.",
        color: "text-orange-400", 
        border: "border-orange-500/20",
        bg: "bg-orange-400/10",
        glow: "shadow-[0_0_30px_rgba(251,146,60,0.1)]"
    };
    return { 
        title: "NEURAL ANOMALY", 
        sub: "EVOLUTION TAKES TIME. ANALYZE AND ADAPT.",
        color: "text-red-400", 
        border: "border-red-500/20",
        bg: "bg-red-400/10",
        glow: "shadow-[0_0_30px_rgba(248,113,113,0.1)]"
    };
  };

  const rank = getRankData();

  return (
    <AnimatePresence mode="wait">
      {phase === 'syncing' ? (
        /* PHASE 1: MOANA SYNC CELEBRATION */
        <SyncCelebration 
          key="sync-celebration" 
          score={score} 
          onComplete={() => setPhase('display')} 
        />
      ) : (
        /* PHASE 2: MOANA FINAL DATA CARD */
        <motion.div 
          key="result-display"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617]/98 backdrop-blur-3xl p-4 overflow-hidden"
        >
          {/* Ambient Bio-Organic Pulse */}
          <div className={`absolute inset-0 opacity-10 ${rank.bg} animate-pulse pointer-events-none`} />

          <motion.div 
            initial={{ scale: 0.8, y: 50, opacity: 0 }} 
            animate={{ scale: 1, y: 0, opacity: 1 }} 
            transition={{ type: "spring", damping: 18, stiffness: 120 }}
            className={`bg-slate-950/80 backdrop-blur-md border ${rank.border} p-8 md:p-10 rounded-[3rem] max-w-md w-full text-center relative ${rank.glow} overflow-hidden`}
          >
            {/* Visual Header Decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />

            {/* Sub-Components Orchestration */}
            <RankBadge title={rank.title} color={rank.color} bg={rank.bg} />
            
            <ScoreDisplay score={score} color={rank.color} />
            
            <div className="space-y-3 mb-10 relative z-10">
                <motion.h3 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className={`text-xl font-black uppercase tracking-tight drop-shadow-md ${rank.color}`}
                >
                    {rank.sub}
                </motion.h3>
                
                <div className="flex justify-center gap-4 opacity-30 items-center">
                    <div className="h-[1px] w-6 bg-emerald-500" />
                    <p className="text-[9px] text-emerald-200 uppercase font-black tracking-[0.5em]">
                        MOANA_NEURAL_INDEX_V1.0
                    </p>
                    <div className="h-[1px] w-6 bg-emerald-500" />
                </div>
            </div>

            <ActionButtons 
              score={score} 
              onRestart={onRestart} 
              onReview={onReview} 
              onTerminate={onTerminate} 
            />

            {/* Footer Tech Readout */}
            <div className="mt-8 pt-4 border-t border-white/5 opacity-20 text-[7px] uppercase tracking-[0.3em] text-white">
              Data_Encrypted // Neural_Link_Standby // Moana_System
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};