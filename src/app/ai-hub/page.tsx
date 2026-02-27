"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useNodesState, useEdgesState, addEdge, ConnectionLineType } from 'reactflow';
import 'reactflow/dist/style.css';
import { ChevronLeft, X, Maximize2, Minimize2, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { generateMindMap } from '@/services/moanaAI';

import { Sidebar } from '@/components/mindmap/Sidebar';
import { FlowCanvas } from '@/components/mindmap/FlowCanvas';

const COLOR_PALETTE = ['#38bdf8', '#4ade80', '#f472b6', '#fb923c', '#facc15', '#a78bfa', '#94a3b8', '#fb7185'];

export default function MindMapPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [maps, setMaps] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<'dashboard' | 'canvas'>('dashboard');
  const [focusedNode, setFocusedNode] = useState<any>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false); // Controls the "Hover Msg"
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Track mouse for the floating tooltip
  useEffect(() => {
    const handleMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const createNodeLabel = (topic: string, description: string, isRoot: boolean) => (
    <div className="text-left select-none pointer-events-none">
      <div className={`font-black uppercase leading-tight mb-2 ${isRoot ? 'text-3xl text-white' : 'text-xl text-slate-800'}`}>
        {topic}
      </div>
      <div className={`leading-relaxed font-bold ${isRoot ? 'text-base text-white/90' : 'text-sm text-slate-600'}`}>
        {description.substring(0, 120)}...
      </div>
    </div>
  );

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setIsGenerating(true);
    const result = await generateMindMap(inputText);
    
    if (result?.maps) {
      setMaps(result.maps);
      const allNodes: any[] = [];
      const allEdges: any[] = [];
      
      result.maps.forEach((mapData: any, mapIndex: number) => {
        const verticalOffset = mapIndex * 2000;
        const buildMap = (nodeData: any, parentId: string | null = null, angleRange = [0, 2 * Math.PI], level = 0, branchColor = '#4F6D7A') => {
          const id = parentId ? `${parentId}-${nodeData.topic.replace(/\s/g, '').toLowerCase()}` : `root-${mapIndex}`;
          const isRoot = level === 0;
          const radius = isRoot ? 0 : 450 + (level * 250);
          const midAngle = (angleRange[0] + angleRange[1]) / 2;

          allNodes.push({
            id,
            position: { x: 1000 + radius * Math.cos(midAngle), y: 1000 + verticalOffset + radius * Math.sin(midAngle) },
            style: { 
                background: isRoot ? '#4F6D7A' : 'white', 
                border: `4px solid ${isRoot ? 'white' : branchColor}`, 
                borderRadius: '24px', padding: '24px', width: isRoot ? 400 : 340, cursor: 'pointer' 
            },
            data: { 
              label: createNodeLabel(nodeData.topic, nodeData.description, isRoot),
              fullData: nodeData, 
              color: branchColor
            }
          });

          if (parentId) {
            allEdges.push({ 
                id: `e-${parentId}-${id}`, 
                source: parentId, 
                target: id, 
                type: ConnectionLineType.SmoothStep, 
                style: { stroke: branchColor, strokeWidth: level === 1 ? 6 : 4 } 
            });
          }

          if (nodeData.children) {
            const span = (angleRange[1] - angleRange[0]) / nodeData.children.length;
            nodeData.children.forEach((child: any, i: number) => {
              const newColor = level === 0 ? COLOR_PALETTE[i % COLOR_PALETTE.length] : branchColor;
              buildMap(child, id, [angleRange[0] + (i * span), angleRange[0] + ((i + 1) * span)], level + 1, newColor);
            });
          }
        };
        buildMap(mapData);
      });

      setNodes(allNodes);
      setEdges(allEdges);
    }
    setIsGenerating(false);
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden font-sans relative">
      
      {/* FLOATING HOVER MESSAGE (The part I forgot!) */}
      {isHovering && (
        <div 
          className="fixed pointer-events-none z-[9999] bg-[#020617] text-white text-[10px] font-black uppercase px-4 py-2 rounded-full shadow-2xl lg:block hidden border border-white/20 whitespace-nowrap transition-opacity duration-200"
          style={{ left: mousePos.x + 20, top: mousePos.y + 20 }}
        >
          ⚡ {activeView === 'dashboard' ? 'Double-Click to Enter card' : 'Double Click to Focus'}
        </div>
      )}

      {/* MOBILE DASHBOARD BUTTON */}
      {activeView === 'canvas' && (
        <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]">
          <button 
            onClick={() => setActiveView('dashboard')}
            className="bg-[#020617] text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 font-black uppercase text-[10px] tracking-widest border border-white/20 active:scale-95"
          >
            <LayoutGrid size={18} /> Dashboard
          </button>
        </div>
      )}

      {/* FOCUS MODAL */}
      {focusedNode && (
        <div className="fixed inset-0 z-[100] bg-[#020617]/90 backdrop-blur-lg flex items-center justify-center p-6" onClick={() => setFocusedNode(null)}>
          <div className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl relative p-10 space-y-6" onClick={e => e.stopPropagation()}>
            <button onClick={() => setFocusedNode(null)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full text-slate-800"><X size={20} /></button>
            <div className="flex items-center gap-4">
              <div className="w-4 h-10 rounded-full" style={{ backgroundColor: focusedNode.color }} />
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{focusedNode.fullData.topic}</h2>
            </div>
            <p className="text-xl text-slate-600 font-medium leading-relaxed">{focusedNode.fullData.description}</p>
          </div>
        </div>
      )}

      <nav className="h-16 bg-[#020617] text-white flex items-center justify-between px-6 shrink-0 z-[60]">
        <div className="flex items-center gap-4">
          <Link href="/#" className="p-2 rounded-full hover:bg-white/10"><ChevronLeft size={20} /></Link>
          <div className="flex flex-col text-left">
            <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-500">MoanaAI</h1>
            <span className="text-[10px] font-bold text-slate-400">Text to Mind Map</span>
          </div>
        </div>
        
        <button onClick={() => setIsFullScreen(!isFullScreen)} className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase bg-white/10 hover:bg-white/20 transition-all border border-white/10">
          {isFullScreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          {isFullScreen ? "Exit Focus" : "Full Screen Mode"}
        </button>
      </nav>

      <main className="flex-1 flex overflow-hidden relative">
        <Sidebar 
          inputText={inputText} setInputText={setInputText} isGenerating={isGenerating} 
          handleGenerate={handleGenerate} maps={maps} activeView={activeView} 
          setActiveView={setActiveView} isFullScreen={isFullScreen} 
          setHovering={setIsHovering}
        />
        <FlowCanvas 
          nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} 
          onConnect={onConnect} onNodeDoubleClick={(e: any, n: any) => setFocusedNode(n.data)} 
          setHovering={setIsHovering} activeView={activeView} 
        />
      </main>
    </div>
  );
}