"use client";
import React, { useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  useReactFlow, 
  BackgroundVariant // Fix for the "dots" type error
} from 'reactflow';

export const FlowCanvas = ({ 
  nodes, edges, onNodesChange, onEdgesChange, onConnect, 
  onNodeDoubleClick, setHovering, activeView,
  nodeTypes 
}: any) => {
  
  const { fitView } = useReactFlow();
  
  // Track root ID to only trigger zoom when the data actually changes
  const rootNodeId = nodes[0]?.id;

  useEffect(() => {
    if (nodes.length > 0) {
      const timer = setTimeout(() => {
        fitView({ 
          padding: 0.15, // Large view without touching edges
          duration: 800,
          includeHiddenNodes: true
        });
      }, 400); 
      return () => clearTimeout(timer);
    }
  }, [rootNodeId, nodes.length, activeView, fitView]);

  return (
    <div className={`${activeView === 'dashboard' ? 'hidden lg:block' : 'block'} flex-1 h-full relative bg-slate-50 z-10`}>
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
        
        // Boundaries and Zoom
        minZoom={0.2} 
        maxZoom={1.2}
        
        // Interaction Fixes
        panOnDrag={[0, 1, 2]} 
        onPaneContextMenu={(e) => e.preventDefault()} 
        zoomOnDoubleClick={false} 
        
        // Aesthetic 
        snapToGrid={true}
        snapGrid={[15, 15]}
      >
        {/* Using BackgroundVariant.Dots resolves the TS(2322) error */}
        <Background 
          color="#cbd5e1" 
          gap={25} 
          size={1} 
          variant={BackgroundVariant.Dots} 
        />
        <Controls position="bottom-right" className="!bg-white !shadow-xl !border-none !rounded-lg" />
        <MiniMap position="bottom-left" className="!bg-white !rounded-xl !shadow-lg hidden md:block" />
      </ReactFlow>
    </div>
  );
};