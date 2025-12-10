export interface MeshPart {
  name: string;
  type: 'Cube' | 'Sphere' | 'Cylinder' | 'Cone';
  dimensions: string;
  material: string;
  description: string;
}

export interface CharacterAnalysis {
  characterName: string;
  archetype: string;
  estimatedHeight: string;
  complexity: 'Low' | 'Medium' | 'High';
  topologyStrategy: string;
  parts: MeshPart[];
  riggingNotes: string;
  materials: {
    name: string;
    roughness: number;
    metallic: number;
    baseColorHex: string;
  }[];
}

export interface GeminiResponse {
  analysis: CharacterAnalysis;
  blenderScript: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  GENERATING = 'GENERATING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}