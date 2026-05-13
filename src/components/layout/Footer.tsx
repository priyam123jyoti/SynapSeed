'use client';

import { Download } from 'lucide-react';

export default function Footer() {
  const handleInstall = () => {
    // Dispatch the custom event that our PWAInstaller is listening for
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-pwa-installer'));
    }
  };

  return (
    <footer className="mt-20 pb-32 px-6 text-center space-y-6">
      <div className="max-w-xs mx-auto p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm transition-all hover:shadow-md">
        <h4 className="text-slate-900 font-bold text-sm mb-2">BotanyHub on your Phone</h4>
        <p className="text-slate-500 text-[11px] mb-4 leading-relaxed px-2">
          Install the official app for faster access, offline reading, and a full-screen experience.
        </p>
        
        <button 
          onClick={handleInstall}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-emerald-100"
        >
          <Download className="w-4 h-4" />
          Install Mobile App
        </button>
      </div>
      
      <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-medium">
        © 2026 Botany Dept • Dhakuakhana College
      </p>
    </footer>
  );
}