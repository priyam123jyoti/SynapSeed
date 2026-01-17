"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Atoms - Adjust paths if necessary
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
  const [phase, setPhase] = useState<'syncing' | 'display'>('syncing');

  // OPTIMIZATION: Memoize rank data so it doesn't recalculate on re-renders
  const rank = useMemo(() => {
    if (score === 100) return { 
        title: "BIOLOGICAL DEITY • MOANA_SAPIEN", 
        sub: "NEURAL SYNC PERFECT. STATUS: EVOLVED. 🔥🔥",
        color: "text-yellow-400", border: "border-yellow-500/50", bg: "bg-yellow-400/10", glow: "shadow-[0_0_60px_rgba(250,204,21,0.4)]"
    };
    if (score >= 80) return { 
        title: "APEX RESEARCHER", 
        sub: "Excellent. Genetic potential maximized.",
        color: "text-emerald-400", border: "border-emerald-500/50", bg: "bg-emerald-400/10", glow: "shadow-[0_0_50px_rgba(16,185,129,0.3)]"
    };
    if (score >= 40) return { 
        title: "FIELD SPECIALIST", 
        sub: "Baseline achieved. Optimization recommended.",
        color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-400/10", glow: "shadow-[0_0_50px_rgba(59,130,246,0.2)]"
    };
    return { 
        title: "NEURAL ANOMALY", 
        sub: "EVOLUTION TAKES TIME. ANALYZE AND ADAPT.",
        color: "text-red-400", border: "border-red-500/20", bg: "bg-red-400/10", glow: "shadow-[0_0_30px_rgba(248,113,113,0.1)]"
    };
  }, [score]);

  return (
    <AnimatePresence mode="wait">
      {phase === 'syncing' ? (
        <SyncCelebration key="sync" score={score} onComplete={() => setPhase('display')} />
      ) : (
        <motion.div 
          key="display"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617]/98 backdrop-blur-3xl p-4 overflow-hidden"
        >
          <div className={`absolute inset-0 opacity-10 ${rank.bg} animate-pulse pointer-events-none`} />
          <motion.div 
            initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
            className={`bg-slate-950/80 backdrop-blur-md border ${rank.border} p-8 md:p-10 rounded-[3rem] max-w-md w-full text-center relative ${rank.glow}`}
          >
            <RankBadge title={rank.title} color={rank.color} bg={rank.bg} />
            <ScoreDisplay score={score} color={rank.color} />
            <div className="space-y-3 mb-10 relative z-10">
                <h3 className={`text-xl font-black uppercase tracking-tight ${rank.color}`}>{rank.sub}</h3>
                <p className="text-[9px] text-emerald-200/30 uppercase font-black tracking-[0.5em]">MOANA_NEURAL_INDEX_V1.0</p>
            </div>
            <ActionButtons score={score} onRestart={onRestart} onReview={onReview} onTerminate={onTerminate} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};