"use client";
import React from 'react';
import { Zap, Box, ArrowRight, Trash2 } from 'lucide-react';

export const Sidebar = ({ 
  inputText, setInputText, isGenerating, handleGenerate, maps, activeView, setActiveView, isFullScreen, setHovering 
}: any) => {
  if (isFullScreen) return null;

  return (
    <aside className={`${activeView === 'canvas' ? 'hidden lg:flex' : 'flex'} w-full lg:w-[450px] border-r border-slate-200 bg-white flex flex-col overflow-y-auto z-50`}>
      
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-800 uppercase flex items-center gap-2">
              <Zap size={16} className="text-amber-500 fill-amber-500" /> Text to Mind Maps
            </h2>
            {inputText && (
              <button onClick={() => setInputText("")} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                <Trash2 size={18} />
              </button>
            )}
          </div>

          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste text to visualize..."
            className="w-full min-h-[35vh] lg:min-h-[50vh] p-6 bg-slate-50 border border-slate-200 rounded-[32px] resize-none focus:border-sky-400 focus:bg-white outline-none text-base font-medium transition-all shadow-inner"
          />

          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-5 bg-[#020617] text-white font-black rounded-2xl uppercase text-[11px] tracking-[0.2em] shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isGenerating ? "Mapping Neural Pathways..." : "Generate Mind Map Here"}
          </button>
        </div>
      </div>

      {maps.length > 0 && (
        <div className="px-6 pb-10 space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Active Sessions</h3>
          {maps.map((m: any, i: number) => (
            <button 
              key={i} 
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              onClick={() => {
                setActiveView('canvas');
                setHovering(false); // Hide message when moving to map
              }} 
              className="w-full h-24 bg-white border border-slate-200 rounded-3xl flex items-center px-6 gap-4 hover:border-sky-500 hover:bg-sky-50 transition-all text-left group shadow-sm active:scale-95"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-sky-500 transition-colors"><Box size={24} /></div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[12px] font-black text-slate-800 uppercase truncate">{m.topic}</h4>
                <p className="text-[10px] text-sky-500 font-bold uppercase tracking-tighter mt-1">Ready to visualize</p>
              </div>
              <ArrowRight size={18} className="text-slate-300 group-hover:text-sky-500 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      )}
    </aside>
  );
};