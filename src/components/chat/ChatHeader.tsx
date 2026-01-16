"use client";

import { ChevronLeft, RefreshCw } from 'lucide-react';

interface ChatHeaderProps {
  modeId: string;
  onExit: () => void;
}

export const ChatHeader = ({ modeId, onExit }: ChatHeaderProps) => {
  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <header className="z-10 border-b border-sky-900/50 bg-[#020617]/80 backdrop-blur-md p-4 flex items-center justify-between">
      <button 
        onClick={onExit} 
        className="flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold tracking-widest">EXIT HUB</span>
      </button>

      <div className="flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
        <h1 className="text-[10px] md:text-xs tracking-[0.2em] font-bold text-sky-100">
          MOANA AI: <span className="text-sky-400">{modeId.toUpperCase()}</span>
        </h1>
      </div>

      <button 
        onClick={handleReload} 
        className="text-sky-900 hover:text-sky-400 transition-colors p-1"
        title="Reload Neural Link"
      >
        <RefreshCw className="w-4 h-4" />
      </button>
    </header>
  );
};