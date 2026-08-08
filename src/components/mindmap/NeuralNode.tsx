import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const NeuralNode = ({ data }: any) => {
  // Extracting data safely
  const topic = data.fullData?.topic || data.topic || "Neural Link";
  const description = data.fullData?.description || data.description || "";
  const isRoot = data.isRoot || false;

  return (
    <div className="w-full h-full">
      {/* Handles for lines */}
      <Handle type="target" position={Position.Top} className="opacity-0" />
      
      <div className="text-left select-none p-2 w-full">
        <div className={`font-black uppercase leading-tight mb-2 ${isRoot ? 'text-2xl text-white' : 'text-lg text-slate-800'}`}>
          {topic}
        </div>
        {description && (
          <div className={`leading-relaxed font-bold ${isRoot ? 'text-sm text-white/80' : 'text-[11px] text-slate-500'}`}>
            {description.length > 120 ? `${description.substring(0, 120)}...` : description}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
};

export default memo(NeuralNode);