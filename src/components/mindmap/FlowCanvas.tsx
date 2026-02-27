"use client";
import React from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';

export const FlowCanvas = ({ 
  nodes, edges, onNodesChange, onEdgesChange, onConnect, 
  onNodeDoubleClick, setHovering, activeView,
  nodeTypes // <--- ADD THIS PROP
}: any) => {
  return (
    <div className={`${activeView === 'dashboard' ? 'hidden lg:block' : 'block'} flex-1 h-full relative bg-slate-50 z-10`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes} // <--- PASS IT HERE
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        onNodeMouseEnter={() => setHovering(true)}
        onNodeMouseLeave={() => setHovering(false)}
        fitView
      >
        <Background color="#cbd5e1" gap={30} size={1} />
        <Controls className="!bg-white !shadow-2xl !border-none !rounded-xl overflow-hidden !m-4" />
        <MiniMap className="!bg-white !rounded-2xl !border-slate-200 !shadow-2xl hidden md:block !m-4" />
      </ReactFlow>
    </div>
  );
};