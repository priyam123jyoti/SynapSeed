"use client";

import React from 'react';
import { BrainCircuit, History, Trash2, Clock, Box, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const Sidebar = ({ 
  inputText, setInputText, isGenerating, handleGenerate, 
  maps, setMaps, activeView, setActiveView, setHovering, setNodes, setEdges 
}: any) => {

  const loadMapFromHistory = (mapData: any) => {
    // We just pass the raw nodes. The Custom Node handles the visual part now!
    setNodes(mapData.nodes);
    setEdges(mapData.edges);
    setActiveView('canvas');
    setHovering(false);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Delete this neural link?")) return;
    const { error } = await supabase.from('mind_maps').delete().eq('id', id);
    if (!error) setMaps((prev: any) => prev.filter((m: any) => m.id !== id));
  };

  return (
    <aside className={`${activeView === 'canvas' ? 'hidden lg:flex' : 'flex'} w-full lg:w-[450px] border-r border-slate-200 bg-white flex flex-col overflow-hidden z-50`}>
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-sm font-black text-slate-800 uppercase flex items-center gap-2 mb-4">
          <BrainCircuit size={18} className="text-emerald-500" /> Mind Map Generator
        </h2>
        {/* INCREASED HEIGHT HERE */}
        <textarea 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Describe a concept..."
          className="w-full min-h-[40vh] p-6 bg-slate-50 border border-slate-200 rounded-[32px] outline-none text-sm transition-all focus:ring-2 focus:ring-emerald-500/20"
        />
        <button 
          onClick={handleGenerate}
          disabled={isGenerating || !inputText.trim()}
          className="w-full mt-4 py-5 bg-[#020617] text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-emerald-600 transition-all disabled:opacity-50"
        >
          {isGenerating ? "Moana is Mapping..." : "Generate Mind Map Here"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {maps.map((m: any) => (
          <div key={m.id} className="relative group">
            <button 
              onClick={() => loadMapFromHistory(m)}
              className="w-full h-24 bg-white border border-slate-200 rounded-3xl flex items-center px-6 gap-4 hover:border-emerald-500 transition-all text-left shadow-sm"
            >
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-emerald-500">
                <Box size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[11px] font-black text-slate-800 uppercase truncate">{m.topic}</h4>
                <p className="text-[9px] text-slate-400 font-bold">{new Date(m.created_at).toLocaleDateString()}</p>
              </div>
              <ArrowRight size={18} className="text-slate-300 group-hover:text-emerald-500" />
            </button>
            <button onClick={(e) => handleDelete(e, m.id)} className="absolute -top-2 -right-2 p-2 bg-white shadow-md rounded-full text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
};