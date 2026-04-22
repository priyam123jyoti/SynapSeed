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
  
  // rootNodeId helps detect when a NEW mind map is loaded vs just moving nodes
  const rootNodeId = nodes[0]?.id;

  useEffect(() => {
    if (nodes.length > 0) {
      const timer = setTimeout(() => {
        // 1. Calculate the exact bounding box of the entire mind map
        const nodesRect = getRectOfNodes(nodes);
        
        // 2. Target the React Flow container to get current window dimensions
        const container = document.querySelector('.react-flow__renderer');
        if (!container) return;
        
        const width = container.clientWidth;
        const height = container.clientHeight;

        // 3. FIX: Use Array destructuring [x, y, zoom] to avoid TS(2339) error
        const [x, y, zoom] = getTransformForBounds(
          nodesRect,
          width,
          height,
          0.1,  // minZoom
          1.5,  // maxZoom
          0.15  // padding (15% margin around the map)
        );

        // 4. Smoothly glide the camera to the dead center
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
        
        // --- VISIBILITY & CONTRAST FIX ---
        style={{ 
          cursor: 'cell', // Bold '+' cursor with black outline: impossible to lose
          backgroundColor: '#f8fafc' 
        }}
        
        // Camera Boundaries
        minZoom={0.1} 
        maxZoom={1.5}
        preventScrolling={false}
        
        // Interaction Logic
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

        <MiniMap 
          position="bottom-left" 
          className="!bg-white !rounded-xl !shadow-lg hidden md:block !border-2 !border-slate-200"
          nodeColor="#ef4444" // Nodes are Red in the minimap
          maskStrokeColor="#000000" // Camera border is Bold Black
          maskStrokeWidth={4} 
        />
      </ReactFlow>
    </div>
  );
};