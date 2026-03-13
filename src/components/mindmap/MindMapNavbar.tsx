"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const MindMapNavbar = () => {
  return (
    <nav className="h-16 bg-[#020617] text-white flex items-center justify-between px-6 shrink-0 z-[60] border-b border-white/5">
      <div className="flex items-center gap-4">
        <Link 
          href="/" 
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <div className="flex flex-col text-left">
          <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">
            MoanaAI
          </h1>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Neural Mind Map Generator
          </span>
        </div>
      </div>
      
      {/* Space for future buttons like 'Export' or 'Save' */}
      <div className="flex items-center gap-3">
        <div className="hidden md:block px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[9px] font-black text-emerald-400 uppercase tracking-widest">
          Neural Link Active
        </div>
      </div>
    </nav>
  );
};