"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Maximize2, Minimize2, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  isFullScreen: boolean;
  setIsFullScreen: (val: boolean) => void;
  activeView: 'dashboard' | 'canvas';
  setActiveView: (view: 'dashboard' | 'canvas') => void;
}

export const MindMapNavbar = ({ isFullScreen, setIsFullScreen, activeView, setActiveView }: NavbarProps) => {
  return (
    <nav className="h-16 bg-[#021417] text-white flex items-center justify-between px-6 shrink-0 z-[60] border-b border-white/5">
      <div className="flex items-center gap-4">
        {/* MOBILE BACK BUTTON: Only shows when viewing the map on small devices */}
        {activeView === 'canvas' ? (
          <button 
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2 p-2 pr-4 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors text-emerald-400 lg:hidden"
          >
            <ChevronLeft size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
          </button>
        ) : (
          <Link 
            href="/" 
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
        )}

        <div className="hidden md:flex flex-col text-left">
          <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">
            MoanaAI
          </h1>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
             Mind Map Gen
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* DESKTOP ONLY: Dashboard Toggle */}
        <button 
          onClick={() => setActiveView(activeView === 'dashboard' ? 'canvas' : 'dashboard')}
          className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          <LayoutDashboard size={14} /> 
          {activeView === 'dashboard' ? 'View Map' : 'View Editor'}
        </button>

        {/* DESKTOP ONLY: Full Screen / Focus Toggle */}
        <button 
          onClick={() => setIsFullScreen(!isFullScreen)}
          className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl border transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest ${
            isFullScreen 
            ? 'border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' 
            : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
          }`}
        >
          {isFullScreen ? (
            <><Minimize2 size={14} /> Exit Focus</>
          ) : (
            <><Maximize2 size={14} /> Full Screen</>
          )}
        </button>
      </div>
    </nav>
  );
};