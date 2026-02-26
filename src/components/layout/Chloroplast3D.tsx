"use client";

import { useState, useEffect, memo } from 'react';
import { Maximize2, X, Box } from 'lucide-react';

const Chloroplast3D = () => {
  const [isFull, setIsFull] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Sketchfab URL with optimized parameters
  const modelUrl = "https://sketchfab.com/models/9a244f04a73d46cd8801fd3d9d40726b/embed?autostart=1&internal=1&ui_theme=dark&transparent=0";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when maximized
  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = isFull ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isFull, mounted]);

  if (!mounted) return <div className="w-full h-full bg-slate-100 animate-pulse rounded-[1rem]" />;

  return (
    <>
      {/* 1. MINIMIZED CARD */}
      <div className="w-full h-full min-h-[400px] rounded-[1rem] overflow-hidden border border-emerald-100 shadow-xl bg-white relative flex flex-col">
        <div className="flex-1 w-full relative">
          <iframe 
            title="Chloroplast Min" 
            className="absolute inset-0 w-full h-full border-0" 
            src={modelUrl} 
            allow="autoplay; fullscreen; xr-spatial-tracking" 
            loading="lazy" // Performance boost
          />
        </div>
        
        <button 
          onClick={() => setIsFull(true)}
          className="absolute bottom-6 right-6 bg-emerald-900 border-2 border-white text-white p-3 rounded-2xl shadow-2xl flex items-center gap-2 hover:bg-emerald-800 active:scale-95 z-10 transition-transform"
        >
          <Maximize2 size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest px-1">Full Lab</span>
        </button>
      </div>

      {/* 2. MAXIMIZED OVERLAY */}
      {isFull && (
        <div className="fixed inset-0 z-[99999] bg-black flex flex-col animate-in fade-in duration-300">
          <div className="bg-emerald-950 p-4 flex justify-between items-center border-b border-emerald-800/50">
            <div className="flex items-center gap-3 pl-2">
              <Box className="text-emerald-400" size={20} />
              <h2 className="text-white font-bold text-sm tracking-tight">Specimen Lab: Chloroplast</h2>
            </div>
            <button 
              onClick={() => setIsFull(false)}
              className="bg-white/10 hover:bg-white/20 text-white p-2 px-4 rounded-xl transition-all flex items-center gap-2"
            >
              <span className="text-xs font-bold font-mono">EXIT LAB</span>
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 bg-black relative">
            <iframe 
              title="Chloroplast Max" 
              className="absolute inset-0 w-full h-full border-0" 
              src={modelUrl} 
              allow="autoplay; fullscreen; xr-spatial-tracking" 
            />
          </div>
        </div>
      )}
    </>
  );
};

// VITAL: Prevents re-renders of the heavy 3D model
export default memo(Chloroplast3D);