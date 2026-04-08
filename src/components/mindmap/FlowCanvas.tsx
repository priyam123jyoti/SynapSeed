"use client";
import React, { useEffect, useMemo } from 'react';
import ReactFlow, { Background, Controls, MiniMap, useReactFlow } from 'reactflow';

export const FlowCanvas = ({ 
  nodes, edges, onNodesChange, onEdgesChange, onConnect, 
  onNodeDoubleClick, setHovering, activeView,
  nodeTypes 
}: any) => {
  
  const { fitView } = useReactFlow();

  // FIX 1: We only want to trigger the camera pan when a NEW map is loaded, 
  // NOT every time you click or select a node. We do this by tracking ONLY the first node's ID.
  const rootNodeId = nodes[0]?.id;

  useEffect(() => {
    if (nodes.length > 0) {
      const timer = setTimeout(() => {
        fitView({ 
          padding: 0.4, 
          duration: 1000 
        });
      }, 300); 
      return () => clearTimeout(timer);
    }
  // Notice we use rootNodeId here instead of `nodes`
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
        minZoom={0.1}
        maxZoom={1.5}
        fitView
        
        // FIX 2: Prevent default browser menus and buggy mouse actions
        panOnDrag={[0, 1, 2]} // Allows smooth panning with Left, Middle, OR Right mouse buttons
        onPaneContextMenu={(e) => e.preventDefault()} // Stops right-click from opening the browser menu and breaking the map
        zoomOnDoubleClick={false} // Stops the map from zooming when you double-click a node to read it
      >
        <Background color="#cbd5e1" gap={30} size={1} />
        <Controls 
          position="bottom-right" 
          className="!bg-white !shadow-2xl !border-none !rounded-xl overflow-hidden !m-4" 
        />
        <MiniMap 
          position="bottom-left"
          className="!bg-white !rounded-2xl !border-slate-200 !shadow-2xl hidden md:block !m-4" 
        />
      </ReactFlow>
    </div>
  );
};