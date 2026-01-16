"use client";

import React from 'react';
import { PlayCircle, Brain, Target, Zap } from 'lucide-react';

interface ActionButtonsProps {
  score: number;
  onRestart: () => void;
  onReview: () => void;
  onTerminate: () => void;
}

export const ActionButtons = ({ score, onRestart, onReview, onTerminate }: ActionButtonsProps) => (
  <div className="grid grid-cols-1 gap-6">
    {/* PRIMARY: THE NEURAL LINK BUTTON */}
    <button 
      onClick={onRestart} 
      className={`group relative py-6 rounded-2xl font-black text-sm uppercase tracking-[0.3em] transition-all active:scale-[0.98] 
        shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t border-white/20
        ${score >= 70 
          ? 'bg-gradient-to-b from-[#10b981] to-[#059669] text-emerald-950 hover:shadow-emerald-500/20' 
          : 'bg-gradient-to-b from-[#fbbf24] to-[#d97706] text-amber-950 hover:shadow-amber-500/20'}
      `}
    >
      {/* Premium Metallic Sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
      
      <div className="flex items-center justify-center gap-4 relative z-10">
        <PlayCircle size={24} strokeWidth={2.5} /> 
        <span className="tracking-[0.4em]">
          {score >= 70 ? "SYNC NEXT CYCLE" : "RE-ESTABLISH LINK"}
        </span>
      </div>
    </button>

    {/* SECONDARY: PREMIUM FROSTED BLOCKS */}
    <div className="grid grid-cols-2 gap-4">
      <button 
        onClick={onReview} 
        className="group relative py-5 bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 rounded-2xl text-emerald-400 font-bold text-[11px] uppercase tracking-[0.25em] transition-all hover:bg-emerald-500 hover:text-emerald-950 shadow-lg"
      >
        <div className="flex items-center justify-center gap-2">
          <Brain size={16} strokeWidth={2.5} /> 
          REVIEW
        </div>
      </button>

      <button 
        onClick={onTerminate} 
        className="group relative py-5 bg-slate-900/80 backdrop-blur-md border border-red-500/30 rounded-2xl text-red-400 font-bold text-[11px] uppercase tracking-[0.25em] transition-all hover:bg-red-500 hover:text-white shadow-lg"
      >
        <div className="flex items-center justify-center gap-2">
          <Target size={16} strokeWidth={2.5} /> 
          ABORT
        </div>
      </button>
    </div>

    {/* STATUS FOOTER: MINIMALIST LUXURY */}
    <div className="flex items-center justify-center gap-3 mt-2">
      <div className="h-[1px] w-8 bg-emerald-500/30" />
      <div className="flex items-center gap-2">
        <Zap size={12} className="text-emerald-500 animate-pulse" />
        <span className="text-[9px] font-bold tracking-[0.5em] text-emerald-500/60 uppercase">
          MOANA SYSTEMS ACTIVE
        </span>
      </div>
      <div className="h-[1px] w-8 bg-emerald-500/30" />
    </div>
  </div>
);