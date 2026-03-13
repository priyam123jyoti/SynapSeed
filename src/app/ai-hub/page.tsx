"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useNodesState, useEdgesState, addEdge, ConnectionLineType, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import { ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthProvider';
import { generateMindMap } from '@/services/moanaAI';

import { Sidebar } from '@/components/mindmap/Sidebar';
import { FlowCanvas } from '@/components/mindmap/FlowCanvas';
import { MindMapNavbar } from '@/components/mindmap/MindMapNavbar';
import { NodeFocusModal } from '@/components/mindmap/NodeFocusModal';

const COLOR_PALETTE = ['#38bdf8', '#4ade80', '#f472b6', '#fb923c', '#facc15', '#a78bfa', '#94a3b8', '#fb7185'];

export default function MindMapPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [maps, setMaps] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<'dashboard' | 'canvas'>('dashboard');
  const [focusedNode, setFocusedNode] = useState<any>(null);
  const [isHovering, setIsHovering] = useState(false);

  // --- SECURITY GUARD ---
  useEffect(() => {
    if (!loading && !user) {
      router.push('/?error=unauthorized');
    }
  }, [user, loading, router]);

  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

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
    
    try {
      const result = await generateMindMap(inputText);
      
      if (result?.maps) {
        setMaps(result.maps);
        const allNodes: any[] = [];
        const allEdges: any[] = [];
        
        const NODE_WIDTH = 320;
        const HORIZONTAL_GAP = 120;
        const VERTICAL_GAP = 450;

        result.maps.forEach((mapData: any, mapIndex: number) => {
          // Increased gap to 10,000 to prevent any possible overlap (Grapes)
          const mapYOffset = mapIndex * 10000;

          const getBranchWidth = (node: any): number => {
            if (!node.children || node.children.length === 0) return NODE_WIDTH + HORIZONTAL_GAP;
            return node.children.reduce((acc: number, child: any) => acc + getBranchWidth(child), 0);
          };

          const buildTree = (nodeData: any, parentId: string | null = null, level = 0, currentXBoundary = 0, branchColor = '#4ade80') => {
            const id = parentId ? `${parentId}-${nodeData.topic.replace(/\s/g, '').toLowerCase()}-${Math.random().toString(36).substr(2, 5)}` : `root-${mapIndex}`;
            const isRoot = level === 0;
            const totalBranchWidth = getBranchWidth(nodeData);

            const xPos = currentXBoundary + (totalBranchWidth / 2) - (NODE_WIDTH / 2);
            const yPos = mapYOffset + (level * VERTICAL_GAP);

            allNodes.push({
              id,
              position: { x: xPos, y: yPos },
              // IMPORTANT: Using default node style to ensure your custom label renders
              style: { 
                background: isRoot ? '#020617' : 'white', 
                border: `3px solid ${isRoot ? '#38bdf8' : branchColor}`, 
                borderRadius: '24px', padding: '12px', width: NODE_WIDTH, cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
              },
              data: { 
                label: createNodeLabel(nodeData.topic, nodeData.description, isRoot),
                fullData: nodeData, color: branchColor
              }
            });

            if (parentId) {
              allEdges.push({ 
                id: `e-${parentId}-${id}`, source: parentId, target: id, type: ConnectionLineType.SmoothStep, animated: true,
                style: { stroke: branchColor, strokeWidth: 4, opacity: 0.6 } 
              });
            }

            if (nodeData.children) {
              let nextChildXBoundary = currentXBoundary;
              nodeData.children.forEach((child: any, i: number) => {
                const childColor = level === 0 ? COLOR_PALETTE[i % COLOR_PALETTE.length] : branchColor;
                buildTree(child, id, level + 1, nextChildXBoundary, childColor);
                nextChildXBoundary += getBranchWidth(child);
              });
            }
          };
          buildTree(mapData);
        });
        setNodes(allNodes);
        setEdges(allEdges);
      }
    } catch (error) {
      console.error("Mapping Error:", error);
    } finally {
      setIsGenerating(false);
    }
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
      <div className="h-screen bg-slate-50 flex flex-col overflow-hidden relative">
        <MindMapNavbar />
        <main className="flex-1 flex overflow-hidden relative">
          <Sidebar 
            inputText={inputText} setInputText={setInputText} isGenerating={isGenerating} 
            handleGenerate={handleGenerate} maps={maps} activeView={activeView} 
            setActiveView={setActiveView} setHovering={setIsHovering}
          />
          <FlowCanvas 
            nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} 
            onConnect={onConnect} onNodeDoubleClick={(e: any, n: any) => setFocusedNode(n.data)} 
            setHovering={setIsHovering} activeView={activeView} 
          />
        </main>
        <NodeFocusModal node={focusedNode} onClose={() => setFocusedNode(null)} />
      </div>
    </ReactFlowProvider>
  );
}