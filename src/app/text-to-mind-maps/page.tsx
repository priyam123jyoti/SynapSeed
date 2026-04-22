"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useNodesState, useEdgesState, addEdge, ConnectionLineType, ReactFlowProvider, Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';
import { ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthProvider';
import { generateMindMap } from '@/services/moanaAI';
import { supabase } from '@/lib/supabase';

import { Sidebar } from '@/components/mindmap/Sidebar';
import { FlowCanvas } from '@/components/mindmap/FlowCanvas';
import { MindMapNavbar } from '@/components/mindmap/MindMapNavbar';
import { NodeFocusModal } from '@/components/mindmap/NodeFocusModal';

const COLOR_PALETTE = ['#38bdf8', '#4ade80', '#f472b6', '#fb923c', '#facc15', '#a78bfa', '#94a3b8', '#fb7185'];

// --- FIXED NEURAL NODE (STRICT WIDTH & WRAPPING) ---
const NeuralNode = ({ data }: any) => {
  const isRoot = data.isRoot;
  const topic = data.topic || "Neural Link";
  const description = data.description || "";

  return (
    /* FIX: We force w-[320px] and break-words. 
       This prevents long text from physically stretching the node into its neighbor.
    */
    <div className="w-[320px] max-w-[320px] h-auto relative break-words overflow-hidden">
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <div className="text-left select-none p-2 w-full">
        <div className={`font-black uppercase leading-tight mb-2 ${isRoot ? 'text-2xl text-white' : 'text-lg text-slate-800'}`}>
          {topic}
        </div>
        <div className={`leading-relaxed font-bold ${isRoot ? 'text-sm text-white/80' : 'text-[11px] text-slate-500'}`}>
          {description.length > 180 ? `${description.substring(0, 180)}...` : description}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
};

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
  const [isFullScreen, setIsFullScreen] = useState(false);

  const nodeTypes = useMemo(() => ({ neuralNode: NeuralNode }), []);

  const forceFit = () => {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 200);
  };

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setIsGenerating(true);
    
    try {
      const result: any = await generateMindMap(inputText);
      if (result?.maps) {
        const allNodes: any[] = [];
        const allEdges: any[] = [];
        
        // --- SPACING LOGIC ---
        const NODE_WIDTH = 320;
        const HORIZONTAL_GAP = 150; 
        const VERTICAL_GAP = 400;

        // FIX: Global tracker ensures that if multiple maps are generated, 
        // they don't all start at X=0 and overlap.
        let globalMapCursorX = 0;

        result.maps.forEach((mapData: any) => {
          const getSubtreeWidth = (node: any): number => {
            if (!node.children || node.children.length === 0) return NODE_WIDTH + HORIZONTAL_GAP;
            return node.children.reduce((acc: number, child: any) => acc + getSubtreeWidth(child), 0);
          };

          const currentMapWidth = getSubtreeWidth(mapData);

          const buildTree = (nodeData: any, parentId: string | null = null, level = 0, currentXBoundary = 0, branchColor = '#4ade80') => {
            const id = parentId ? `${parentId}-${Math.random().toString(36).substr(2, 5)}` : `root-${Date.now()}`;
            const isRoot = level === 0;
            const totalBranchWidth = getSubtreeWidth(nodeData);

            const xPos = currentXBoundary + (totalBranchWidth / 2) - (NODE_WIDTH / 2);
            const yPos = level * VERTICAL_GAP;

            allNodes.push({
              id,
              type: 'neuralNode',
              position: { x: xPos, y: yPos },
              data: { topic: nodeData.topic, description: nodeData.description, isRoot, color: branchColor },
              style: { 
                background: isRoot ? '#020617' : 'white', 
                border: `3px solid ${isRoot ? '#38bdf8' : branchColor}`, 
                borderRadius: '24px', 
                padding: '16px', 
                width: NODE_WIDTH, // FIXED WIDTH
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                zIndex: 100 - level
              },
            });

            if (parentId) {
              allEdges.push({ 
                id: `e-${parentId}-${id}`, source: parentId, target: id, type: ConnectionLineType.SmoothStep, animated: true,
                style: { stroke: branchColor, strokeWidth: 3, opacity: 0.5 } 
              });
            }

            if (nodeData.children) {
              let childXCursor = currentXBoundary;
              nodeData.children.forEach((child: any, i: number) => {
                const childColor = level === 0 ? COLOR_PALETTE[i % COLOR_PALETTE.length] : branchColor;
                buildTree(child, id, level + 1, childXCursor, childColor);
                childXCursor += getSubtreeWidth(child); 
              });
            }
          };

          // Start building this specific map at the current global X position
          buildTree(mapData, null, 0, globalMapCursorX);
          
          // Increment global X so the NEXT map starts after this one finishes
          globalMapCursorX += currentMapWidth + 500; 
        });
        
        setNodes(allNodes);
        setEdges(allEdges);
        setActiveView('canvas');
        forceFit(); 
      }
    } finally { setIsGenerating(false); }
  };

  return (
    <ReactFlowProvider>
      <div className="h-screen bg-slate-50 flex flex-col overflow-hidden relative">
        <MindMapNavbar isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 flex overflow-hidden">
          {!isFullScreen && (
            <Sidebar 
              inputText={inputText} setInputText={setInputText} isGenerating={isGenerating} handleGenerate={handleGenerate} 
              maps={maps || []} setMaps={setMaps} activeView={activeView} setActiveView={setActiveView} 
              setHovering={setIsHovering} setNodes={setNodes} setEdges={setEdges} 
              forceFit={forceFit}
            />
          )}
          <FlowCanvas 
            nodes={nodes} edges={edges} 
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} 
            onConnect={(p: any) => setEdges((eds) => addEdge(p, eds))} 
            onNodeDoubleClick={(e: any, n: any) => setFocusedNode(n.data)} 
            setHovering={setIsHovering} activeView={isFullScreen ? 'canvas' : activeView} 
          />
        </main>
        <NodeFocusModal node={focusedNode} onClose={() => setFocusedNode(null)} />
      </div>
    </ReactFlowProvider>
  );
}