"use client";

import React from 'react';
import { BrainCircuit, Send, History, Trash2, Clock, Box, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SidebarProps {
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  isGenerating: boolean;
  handleGenerate: () => Promise<void>;
  maps: any[];
  setMaps: React.Dispatch<React.SetStateAction<any[]>>;
  activeView: 'dashboard' | 'canvas';
  setActiveView: (v: 'dashboard' | 'canvas') => void;
  setHovering: (v: boolean) => void;
  setNodes: (n: any[]) => void;
  setEdges: (e: any[]) => void;
}

export const Sidebar = ({ 
  inputText, 
  setInputText, 
  isGenerating, 
  handleGenerate, 
  maps, 
  setMaps,
  activeView,
  setActiveView, 
  setHovering,
  setNodes,
  setEdges
}: SidebarProps) => {

  // --- DELETE LOGIC ---
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Permanently delete this neural link?")) return;

    const { error } = await supabase.from('mind_maps').delete().eq('id', id);
    if (!error) {
      setMaps(prev => prev.filter(m => m.id !== id));
    }
  };

  return (
    <aside className={`${activeView === 'canvas' ? 'hidden lg:flex' : 'flex'} w-full lg:w-[450px] border-r border-slate-200 bg-white flex flex-col overflow-hidden z-50`}>
      
      {/* Input Section */}
      <div className="p-6 space-y-6 border-b border-slate-100">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-800 uppercase flex items-center gap-2">
              <BrainCircuit size={18} className="text-emerald-500" /> Neural Generator
            </h2>
          </div>

          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste text or describe a concept to visualize..."
            className="w-full min-h-[20vh] lg:min-h-[25vh] p-6 bg-slate-50 border border-slate-200 rounded-[32px] resize-none focus:border-emerald-400 focus:bg-white outline-none text-sm font-medium transition-all shadow-inner"
          />

          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !inputText.trim()}
            className="w-full py-5 bg-[#020617] text-white font-black rounded-2xl uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-emerald-600 transition-all disabled:opacity-50"
          >
            {isGenerating ? "Mapping Neural Pathways..." : "Generate Neural Map"}
          </button>
        </div>
      </div>

      {/* Neural History Header */}
      <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-2">
        <History size={14} className="text-slate-400" />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Neural History</span>
      </div>

      {/* History Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {maps.length > 0 ? (
          maps.map((m: any) => (
            <div key={m.id} className="group relative">
              <button 
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                onClick={() => {
                  setNodes(m.nodes);
                  setEdges(m.edges);
                  setActiveView('canvas');
                  setHovering(false);
                }} 
                className="w-full h-24 bg-white border border-slate-200 rounded-3xl flex items-center px-6 gap-4 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all text-left group shadow-sm active:scale-95"
              >
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-emerald-500 transition-colors">
                  <Box size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[11px] font-black text-slate-800 uppercase truncate">{m.topic}</h4>
                  <div className="flex items-center gap-1 mt-1 text-slate-400">
                    <Clock size={10} />
                    <span className="text-[9px] font-bold">{new Date(m.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <ArrowRight size={18} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
              </button>
              
              <button 
                onClick={(e) => handleDelete(e, m.id)}
                className="absolute -top-2 -right-2 p-2 bg-white border border-slate-100 shadow-md rounded-full text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-[10px] font-bold text-slate-400 uppercase">No neural links saved yet.</p>
          </div>
        )}
      </div>
    </aside>
  );
};