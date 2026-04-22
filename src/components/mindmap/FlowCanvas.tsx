"use client";
import React, { useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  useReactFlow, 
  BackgroundVariant,
  getRectOfNodes,
  getTransformForBounds
} from 'reactflow';

export const FlowCanvas = ({ 
  nodes, edges, onNodesChange, onEdgesChange, onConnect, 
  onNodeDoubleClick, setHovering, activeView,
  nodeTypes 
}: any) => {
  
  const { setViewport } = useReactFlow();
  const rootNodeId = nodes[0]?.id;

  useEffect(() => {
    if (nodes.length > 0) {
      const timer = setTimeout(() => {
        const nodesRect = getRectOfNodes(nodes);
        const container = document.querySelector('.react-flow__renderer');
        if (!container) return;
        
        const width = container.clientWidth;
        const height = container.clientHeight;

        const [x, y, zoom] = getTransformForBounds(
          nodesRect,
          width,
          height,
          0.1, 
          1.5, 
          0.15 
        );

        setViewport({ x, y, zoom }, { duration: 1000 });
      }, 500); 
      return () => clearTimeout(timer);
    }
  }, [rootNodeId, nodes.length, activeView, setViewport]);

  return (
    <div className={`${activeView === 'dashboard' ? 'hidden lg:block' : 'block'} flex-1 h-full relative bg-black z-10`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes} 
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        onNodeMouseEnter={() => setHovering(true)}
        onNodeMouseLeave={() => setHovering(false)}
        
        // --- PERFECT VISIBILITY SETTINGS ---
        className="custom-canvas-cursor"
        style={{ 
          backgroundColor: '#000000', // Pure Black
          cursor: 'crosshair'       // Fallback high-visibility cursor
        }}
        
        minZoom={0.1} 
        maxZoom={1.5}
        preventScrolling={false}
        panOnDrag={[0, 1, 2]} 
        onPaneContextMenu={(e) => e.preventDefault()} 
        zoomOnDoubleClick={false} 
        snapToGrid={true}
        snapGrid={[20, 20]}
      >
        <Background 
          color="#334155" // Slightly brighter blue-grey for "Neon" effect on black
          gap={25} 
          size={1} 
          variant={BackgroundVariant.Dots} 
        />
        
        <Controls position="bottom-right" className="!bg-slate-900 !border-slate-700 !fill-white !shadow-2xl" />

        <MiniMap 
          position="bottom-left" 
          className="!bg-slate-900 !rounded-xl !shadow-lg hidden md:block !border-2 !border-slate-800"
          nodeColor="#ef4444" 
          maskStrokeColor="#ffffff" // White camera border looks better on black
          maskStrokeWidth={4} 
          maskColor="rgba(0, 0, 0, 0.6)" // Dim the non-visible area
        />
      </ReactFlow>
    </div>
  );
};