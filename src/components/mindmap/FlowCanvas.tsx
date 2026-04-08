"use client";
import React, { useEffect } from 'react';
import ReactFlow, { Background, Controls, MiniMap, useReactFlow } from 'reactflow';

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
        // TIGHT FIT LOGIC:
        fitView({ 
          padding: 0.1, // Reduced from 0.4 to 0.1 (Makes the map 30% BIGGER on screen)
          duration: 800,
          includeHiddenNodes: true
        });
      }, 400); 
      return () => clearTimeout(timer);
    }
  }, [rootNodeId, activeView, fitView]);

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
        
        // ZOOM CONTROL:
        minZoom={0.4} // Changed from 0.1 -> Stops the map from ever being "tiny"
        maxZoom={1.5}
        
        // SPACE LIMITER:
        translateExtent={[[-2000, -2000], [5000, 5000]]} // Prevents dragging into infinite darkness
        nodeExtent={[[-1000, -1000], [4000, 4000]]} // Keeps nodes within a "Reasonable" box
        
        fitView
        fitViewOptions={{ padding: 0.1 }} // Ensures initial load is tight
        
        panOnDrag={[0, 1, 2]}
        onPaneContextMenu={(e) => e.preventDefault()}
        zoomOnDoubleClick={false}
      >
        <Background color="#cbd5e1" gap={30} size={1} />
        <Controls position="bottom-right" className="!bg-white !shadow-2xl" />
        <MiniMap position="bottom-left" className="!bg-white" />
      </ReactFlow>
    </div>
  );
};