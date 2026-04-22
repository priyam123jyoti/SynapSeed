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

        // Destructure array [x, y, zoom] to satisfy TypeScript
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
        
        // --- CURSOR FIX ---
        className="custom-canvas-cursor"
        style={{ 
          backgroundColor: '#f8fafc', // Light slate background
          cursor: 'cell'              // Thick '+' cursor for visibility
        }}
        
        minZoom={0.1} 
        maxZoom={1.5}
        panOnDrag={[0, 1, 2]} 
        onPaneContextMenu={(e) => e.preventDefault()} 
        zoomOnDoubleClick={false} 
        snapToGrid={true}
        snapGrid={[15, 15]}
      >
        <Background 
          color="#cbd5e1" // Soft grey dots
          gap={25} 
          size={1} 
          variant={BackgroundVariant.Dots} 
        />
        
        <Controls position="bottom-right" className="!bg-white !shadow-xl !border-none !rounded-lg" />

        <MiniMap 
          position="bottom-left" 
          className="!bg-white !rounded-xl !shadow-lg hidden md:block !border-2 !border-slate-200"
          nodeColor="#ef4444" 
          maskStrokeColor="#000000" // Bold Black Camera Frame
          maskStrokeWidth={4} 
        />
      </ReactFlow>
    </div>
  );
};