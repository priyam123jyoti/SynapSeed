"use client";
import React, { memo } from 'react';
import { PlayCircle, Brain, Target } from 'lucide-react';

export const ActionButtons = memo(({ score, onRestart, onReview, onTerminate }: any) => (
  <div className="grid grid-cols-1 gap-4">
    <button onClick={onRestart} className={`relative py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all active:scale-95 overflow-hidden ${score >= 70 ? 'bg-emerald-500 text-emerald-950' : 'bg-amber-500 text-amber-950'}`}>
      <div className="flex items-center justify-center gap-3 relative z-10">
        <PlayCircle size={20} /> <span>{score >= 70 ? "SYNC NEXT CYCLE" : "RE-ESTABLISH LINK"}</span>
      </div>
    </button>
    <div className="grid grid-cols-2 gap-3">
      <button onClick={onReview} className="py-4 bg-slate-900/50 border border-emerald-500/20 rounded-2xl text-emerald-400 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-emerald-950 transition-all">
        <div className="flex items-center justify-center gap-2"><Brain size={14}/> REVIEW</div>
      </button>
      <button onClick={onTerminate} className="py-4 bg-slate-900/50 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
        <div className="flex items-center justify-center gap-2"><Target size={14}/> ABORT</div>
      </button>
    </div>
  </div>
));