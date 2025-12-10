import React from 'react';
import { CharacterAnalysis } from '../types';
import { Box, Layers, activity, PenTool, Hash } from 'lucide-react';

interface AnalysisCardProps {
  data: CharacterAnalysis;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ data }) => {
  return (
    <div className="bg-cyber-panel border border-cyber-secondary/30 p-6 rounded-lg shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-2 opacity-20 pointer-events-none">
        <Box size={100} className="text-cyber-primary" />
      </div>
      
      <h2 className="text-2xl font-display text-cyber-primary mb-1 tracking-wider uppercase border-b border-cyber-secondary/30 pb-2">
        {data.characterName} <span className="text-xs text-white/50 align-top">REF: {data.archetype}</span>
      </h2>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-cyber-dark/50 p-3 rounded border-l-2 border-cyber-accent">
          <p className="text-xs text-cyber-primary uppercase">Complexity</p>
          <p className="text-xl font-bold">{data.complexity}</p>
        </div>
        <div className="bg-cyber-dark/50 p-3 rounded border-l-2 border-cyber-secondary">
          <p className="text-xs text-cyber-secondary uppercase">Est. Height</p>
          <p className="text-xl font-bold">{data.estimatedHeight}</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm uppercase text-gray-400 font-bold mb-2 flex items-center gap-2">
          <Layers size={14} /> Topology Strategy
        </h3>
        <p className="text-sm text-gray-300 bg-black/40 p-3 rounded leading-relaxed">
          {data.topologyStrategy}
        </p>
      </div>
      
      <div className="mt-4">
        <h3 className="text-sm uppercase text-gray-400 font-bold mb-2 flex items-center gap-2">
          <PenTool size={14} /> Rigging Notes
        </h3>
        <p className="text-sm text-gray-300 bg-black/40 p-3 rounded leading-relaxed italic">
          {data.riggingNotes}
        </p>
      </div>

      <div className="mt-6">
        <h3 className="text-sm uppercase text-gray-400 font-bold mb-2 flex items-center gap-2">
           <Hash size={14} /> Detected Materials
        </h3>
        <div className="flex flex-wrap gap-2">
          {data.materials.map((mat, i) => (
            <div key={i} className="flex items-center gap-2 bg-black/60 px-3 py-1 rounded-full border border-gray-800">
              <div 
                className="w-3 h-3 rounded-full shadow-[0_0_5px_rgba(255,255,255,0.5)]" 
                style={{ backgroundColor: mat.baseColorHex }}
              />
              <span className="text-xs font-mono">{mat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};