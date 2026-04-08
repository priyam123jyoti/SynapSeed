"use client";
import React, { useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  useReactFlow, 
  BackgroundVariant 
} from 'reactflow';

export const FlowCanvas = ({ 
  nodes, edges, onNodesChange, onEdgesChange, onConnect, 
  onNodeDoubleClick, setHovering, activeView,
  nodeTypes 
}: any) => {
  
  const { fitView } = useReactFlow();
  const rootNodeId = nodes[0]?.id;

  useEffect(() => {
    if (nodes.length > 0) {
      const timer = setTimeout(() => {
        fitView({ 
          padding: 0.15, 
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
        minZoom={0.2} 
        maxZoom={1.2}
        panOnDrag={[0, 1, 2]} 
        onPaneContextMenu={(e) => e.preventDefault()} 
        zoomOnDoubleClick={false} 
        snapToGrid={true}
        snapGrid={[15, 15]}
      >
        <Background 
          color="#cbd5e1" 
          gap={25} 
          size={1} 
          variant={BackgroundVariant.Dots} 
        />
        
        <Controls position="bottom-right" className="!bg-white !shadow-xl !border-none !rounded-lg" />

        {/* --- MINIMAP CUSTOMIZATION --- */}
        <MiniMap 
          position="bottom-left" 
          className="!bg-white !rounded-xl !shadow-lg hidden md:block !border-2 !border-slate-200"
          
          // 1. Make the nodes inside the minimap Red
          nodeColor="#ef4444" 
          
          // 2. Make the 'mask' (the area outside the camera) a light transparent red if desired
          // maskColor="rgba(239, 68, 68, 0.1)" 
          
          // 3. Make the Camera Angle (Viewport) border Bold Black
          maskStrokeColor="#000000"
          maskStrokeWidth={4} 
        />
      </ReactFlow>
    </div>
  );
};