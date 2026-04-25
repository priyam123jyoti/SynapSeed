"use client";

import React from 'react';
import { BrainCircuit, Trash2, Box, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SidebarProps {
  inputText: string;
  setInputText: (val: string) => void;
  isGenerating: boolean;
  handleGenerate: () => void;
  maps: any[];
  setMaps: React.Dispatch<React.SetStateAction<any[]>>;
  activeView: 'dashboard' | 'canvas';
  setActiveView: (view: 'dashboard' | 'canvas') => void;
  setHovering: (val: boolean) => void;
  setNodes: (nodes: any[]) => void;
  setEdges: (edges: any[]) => void;
  forceFit?: () => void; // The new prop to fix the centering issue
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
  setEdges,
  forceFit 
}: SidebarProps) => {

  const loadMapFromHistory = (mapData: any) => {
    // 1. Load the data into the canvas
    setNodes(mapData.nodes);
    setEdges(mapData.edges);
    
    // 2. Switch to the canvas view
    setActiveView('canvas');
    
    // 3. Reset hovering state
    setHovering(false);

    // 4. IMPORTANT: Force the camera to find the map
    if (forceFit) {
      forceFit();
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Delete this neural link?")) return;
    
    const { error } = await supabase
      .from('mind_maps')
      .delete()
      .eq('id', id);

    if (!error) {
      setMaps((prev: any) => prev.filter((m: any) => m.id !== id));
      // If we are deleting the map currently on screen, clear the canvas
      setNodes([]);
      setEdges([]);
      setActiveView('dashboard');
    } else {
      alert("Error deleting map: " + error.message);
    }
  };

  return (
    <aside className={`${activeView === 'canvas' ? 'hidden lg:flex' : 'flex'} w-full lg:w-[450px] border-r border-slate-200 bg-white flex flex-col overflow-hidden z-50`}>
      
      {/* INPUT SECTION */}
      <div className="p-6 border-b border-slate-100 bg-white">
        <h2 className="text-sm font-black text-slate-800 uppercase flex items-center gap-2 mb-4">
          <BrainCircuit size={18} className="text-emerald-500" /> Moana Intelligence
        </h2>
        
        <textarea 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste your notes or describe a concept (e.g., 'Quantum Physics' or 'Botany cell structure')..."
          className="w-full min-h-[35vh] p-6 bg-slate-50 border border-slate-200 rounded-[32px] outline-none text-sm transition-all focus:ring-2 focus:ring-emerald-500/20 resize-none"
        />
        
        <button 
          onClick={handleGenerate}
          disabled={isGenerating || !inputText.trim()}
          className="w-full mt-4 py-5 bg-[#020617] text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-emerald-900/10"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]" />
              Mapping Neural Links...
            </span>
          ) : "Generate Mind Map"}
        </button>
      </div>

      {/* HISTORY SECTION */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Neural History</h3>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
            {maps.length} Maps
          </span>
        </div>

        <div className="space-y-4">
          {maps.length === 0 && !isGenerating && (
            <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-[32px]">
              <p className="text-xs text-slate-400 font-bold">No maps yet.<br/>Start by typing above!</p>
            </div>
          )}

          {maps.map((m: any) => (
            <div key={m.id} className="relative group">
              <button 
                onClick={() => loadMapFromHistory(m)}
                className="w-full h-24 bg-white border border-slate-200 rounded-3xl flex items-center px-6 gap-4 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/5 transition-all text-left shadow-sm group-active:scale-[0.98]"
              >
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-emerald-500 group-hover:bg-emerald-50 transition-colors">
                  <Box size={22} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-[11px] font-black text-slate-800 uppercase truncate pr-4">
                    {m.topic}
                  </h4>
                  <p className="text-[9px] text-slate-400 font-bold mt-1">
                    {new Date(m.created_at).toLocaleDateString(undefined, { 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <ArrowRight size={18} className="text-slate-200 group-hover:text-emerald-500 transform group-hover:translate-x-1 transition-all" />
              </button>

              {/* DELETE BUTTON */}
{/* DELETE BUTTON */}
<button 
  onClick={(e) => handleDelete(e, m.id)} 
  className="absolute -top-2 -right-2 p-2 bg-white shadow-xl rounded-full text-red-400 lg:text-slate-300 lg:hover:text-red-500 hover:scale-110 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all border border-slate-100 z-10"
>
  <Trash2 size={14} />
</button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};