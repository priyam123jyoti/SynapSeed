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
  
  const { setViewport, fitView } = useReactFlow();
  const rootNodeId = nodes[0]?.id;

  useEffect(() => {
    if (nodes.length > 0) {
      const timer = setTimeout(() => {
        // 1. Calculate the exact bounding box of all current nodes
        const nodesRect = getRectOfNodes(nodes);
        
        // 2. Get the dimensions of the actual HTML container
        const container = document.querySelector('.react-flow__renderer');
        if (!container) return;
        
        const width = container.clientWidth;
        const height = container.clientHeight;

        // 3. Calculate the transform (zoom + position) needed to center this box
        // We use a slightly smaller area (0.8) to ensure it feels "Middle-focused"
        const [x, y, zoom] = getTransformForBounds(
          nodesRect,
          width,
          height,
          0.2, // minZoom
          1.2, // maxZoom
          0.15 // padding
        );

        // 4. Strictly set the viewport to the dead-center
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
        
        // Settings for Strict Centering
        minZoom={0.1} 
        maxZoom={1.5}
        preventScrolling={false}
        
        // Interaction
        panOnDrag={[0, 1, 2]} 
        onPaneContextMenu={(e) => e.preventDefault()} 
        zoomOnDoubleClick={false} 
      >
        <Background 
          color="#cbd5e1" 
          gap={25} 
          size={1} 
          variant={BackgroundVariant.Dots} 
        />
        
        <Controls position="bottom-right" className="!bg-white !shadow-xl !border-none" />

        <MiniMap 
          position="bottom-left" 
          className="!bg-white !rounded-xl !shadow-lg hidden md:block !border-2 !border-slate-200"
          nodeColor="#ef4444" 
          maskStrokeColor="#000000"
          maskStrokeWidth={4} 
        />
      </ReactFlow>
    </div>
  );
};