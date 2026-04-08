"use client";
import React, { useEffect } from 'react';
import ReactFlow, { Background, Controls, MiniMap, useReactFlow } from 'reactflow';

export const FlowCanvas = ({ 
  nodes, edges, onNodesChange, onEdgesChange, onConnect, 
  onNodeDoubleClick, setHovering, activeView,
  nodeTypes 
}: any) => {
  
  const { fitView } = useReactFlow();

  // Automatically center the camera when nodes are loaded or view is toggled
  useEffect(() => {
    if (nodes.length > 0) {
      const timer = setTimeout(() => {
        fitView({ 
          padding: 0.4, // Adds breathing room around the map
          duration: 1000 // Smooth panning effect
        });
      }, 300); // Slight delay to wait for container to settle
      return () => clearTimeout(timer);
    }
  }, [nodes, activeView, fitView]);

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