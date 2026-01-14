"use client";

import React from 'react';
import { PlayCircle, Brain, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface ActionButtonsProps {
  score: number;
  onRestart: () => void;
  onReview: () => void;
  onTerminate: () => void;
}

export const ActionButtons = ({ score, onRestart, onReview, onTerminate }: ActionButtonsProps) => (
  <div className="grid grid-cols-1 gap-4">
    {/* PRIMARY ACTION: RE-ENTRY */}
    <button 
      onClick={onRestart} 
      className={`group relative overflow-hidden py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] transition-all active:scale-95 shadow-2xl
        ${score >= 70 
          ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20' 
          : 'bg-slate-800 text-white hover:bg-slate-700'}
      `}
    >
      {/* Glint Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      
      <div className="flex items-center justify-center gap-3 relative z-10">
        <PlayCircle size={20} className={score >= 70 ? 'animate-pulse' : ''} /> 
        {score >= 70 ? "INITIATE NEXT CYCLE" : "RE-ATTEMPT PROTOCOL"}
      </div>

      {/* High Score Celebration Ping */}
      {score >= 70 && (
        <div className="absolute inset-0 bg-emerald-400 animate-ping opacity-10 pointer-events-none" />
      )}
    </button>

    {/* SECONDARY ACTIONS */}
    <div className="grid grid-cols-2 gap-3">
      <button 
        onClick={onReview} 
        className="group py-4 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 rounded-2xl text-emerald-400/70 hover:text-emerald-400 font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
      >
        <Brain size={14} className="group-hover:rotate-12 transition-transform" /> 
        Neural_Review
      </button>

      <button 
        onClick={onTerminate} 
        className="group py-4 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-red-500/50 hover:text-red-400 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
      >
        <Target size={14} className="group-hover:scale-110 transition-transform" /> 
        De-Link_System
      </button>
    </div>

    {/* Moana Status Indicator */}
    <div className="flex items-center justify-center gap-2 mt-2 opacity-20">
      <Zap size={10} className="text-emerald-500 fill-emerald-500" />
      <span className="text-[8px] font-black tracking-[0.4em] text-white uppercase">
        System_Ready_For_Input
      </span>
    </div>
  </div>
);