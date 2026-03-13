"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useNodesState, useEdgesState, ReactFlowProvider } from 'reactflow';
import { ChevronLeft, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthProvider';

import { Sidebar } from '@/components/mindmap/Sidebar';
import { FlowCanvas } from '@/components/mindmap/FlowCanvas';
import { useMindMapLayout } from '@/components/mindmap/useMindMapLayout';

export default function MindMapPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { calculateLayout } = useMindMapLayout();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [maps, setMaps] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<'dashboard' | 'canvas'>('dashboard');
  const [focusedNode, setFocusedNode] = useState<any>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Security Guard
  useEffect(() => {
    if (!loading && !user) router.push('/?error=unauthorized');
  }, [user, loading, router]);

  const createNodeLabel = (topic: string, description: string, isRoot: boolean) => (
    <div className="text-left select-none pointer-events-none p-2">
      <div className={`font-black uppercase leading-tight mb-2 ${isRoot ? 'text-2xl text-white' : 'text-lg text-slate-800'}`}>
        {topic}
      </div>
      <div className={`leading-relaxed font-bold ${isRoot ? 'text-sm text-white/80' : 'text-[11px] text-slate-500'}`}>
        {description.substring(0, 120)}...
      </div>
    </div>
  );

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setIsGenerating(true);
    const { maps: newMaps, allNodes, allEdges } = await calculateLayout(inputText, createNodeLabel);
    setMaps(newMaps);
    setNodes(allNodes);
    setEdges(allEdges);
    setIsGenerating(false);
  };

  if (loading || !user) {
    return (
      <div className="h-screen w-full bg-[#020617] flex flex-col items-center justify-center">
        <ShieldAlert size={48} className="text-emerald-500 animate-pulse mb-4" />
        <h2 className="text-white font-black tracking-widest uppercase text-sm">Validating Neural Link...</h2>
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <div className="h-screen bg-slate-50 flex flex-col overflow-hidden font-sans relative">
        <nav className="h-16 bg-[#020617] text-white flex items-center justify-between px-6 shrink-0 z-[60] border-b border-white/5">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-full hover:bg-white/10 transition-colors"><ChevronLeft size={20} /></Link>
            <div className="flex flex-col text-left">
              <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">MoanaAI</h1>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Neural Mind Map Generator</span>
            </div>
          </div>
        </nav>

        <main className="flex-1 flex overflow-hidden relative">
          <Sidebar 
            inputText={inputText} setInputText={setInputText} isGenerating={isGenerating} 
            handleGenerate={handleGenerate} maps={maps} activeView={activeView} 
            setActiveView={setActiveView} isFullScreen={isFullScreen} setHovering={setIsHovering}
          />
          <FlowCanvas 
            nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} 
            onNodeDoubleClick={(e: any, n: any) => setFocusedNode(n.data)} 
            setHovering={setIsHovering} activeView={activeView} 
          />
        </main>
      </div>
    </ReactFlowProvider>
  );
}