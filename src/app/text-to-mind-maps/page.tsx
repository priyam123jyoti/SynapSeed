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

const NeuralNode = ({ data }: any) => {
  const isRoot = data.isRoot;
  const topic = data.topic || "Neural Link";
  const description = data.description || "";

  return (
    <div className="w-full h-full relative">
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <div className="text-left select-none p-2">
        <div className={`font-black uppercase leading-tight mb-2 ${isRoot ? 'text-2xl text-white' : 'text-lg text-slate-800'}`}>
          {topic}
        </div>
        <div className={`leading-relaxed font-bold ${isRoot ? 'text-sm text-white/80' : 'text-[11px] text-slate-500'}`}>
          {description.length > 120 ? `${description.substring(0, 120)}...` : description}
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

  useEffect(() => {
    if (!loading && !user) router.push('/?error=unauthorized');
  }, [user, loading, router]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      const { data } = await supabase.from('mind_maps').select('*').order('created_at', { ascending: false });
      if (data) setMaps(data);
    };
    if (user && !loading) fetchHistory();
  }, [user, loading]);

  const saveMapToCloud = async (topic: string, nodesData: any[], edgesData: any[]) => {
    if (!user) return;
    const { data } = await supabase.from('mind_maps').insert([{
      user_id: user.id, topic: topic, nodes: nodesData, edges: edgesData
    }]).select();
    if (data) setMaps(prev => [data[0], ...prev]);
  };

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setIsGenerating(true);
    
    try {
      const result: any = await generateMindMap(inputText);
      if (result?.maps) {
        const allNodes: any[] = [];
        const allEdges: any[] = [];
        
        // --- EXTREME SPACING CONSTANTS ---
        const NODE_WIDTH = 320;
        // Tripled the horizontal gap so sibling branches stay far away from each other
        const HORIZONTAL_GAP = 300; 
        // Increased vertical gap in case node descriptions are very long
        const VERTICAL_GAP = 500;

        result.maps.forEach((mapData: any) => {
          const getSubtreeWidth = (node: any): number => {
            if (!node.children || node.children.length === 0) return NODE_WIDTH + HORIZONTAL_GAP;
            return node.children.reduce((acc: number, child: any) => acc + getSubtreeWidth(child), 0);
          };

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
                borderRadius: '24px', padding: '16px', width: NODE_WIDTH, cursor: 'pointer',
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
          buildTree(mapData);
        });
        
        setNodes(allNodes);
        setEdges(allEdges);
        setActiveView('canvas');
        forceFit(); 
        await saveMapToCloud(inputText, allNodes, allEdges);
      }
    } finally { setIsGenerating(false); }
  };

  if (loading || !user) return (
    <div className="h-screen w-full bg-[#020617] flex flex-col items-center justify-center">
      <ShieldAlert size={48} className="text-emerald-500 animate-pulse mb-4" />
      <h2 className="text-white font-black uppercase text-sm">Validating Neural Link...</h2>
    </div>
  );

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