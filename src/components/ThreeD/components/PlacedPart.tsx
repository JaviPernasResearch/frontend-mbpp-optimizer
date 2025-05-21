import React from 'react';
import { Box } from '@react-three/drei';

// Color mapping for materials
const PartColors: Record<string, string> = {
  "P2_MFB_19": "#8B4513", // Brown
  "P2_MFB_9": "#A0522D", // Sienna
  "MPX_ROH_15": "#CD853F", // Peru
  "MDF": "#D2B48C", // Tan
  "UNDEFINED": "#D3D3D3" // Light Gray
};

// Material for different assembly IDs
const AssemblyColors: Record<number, string> = {};
const getAssemblyColor = (assemblyId: number): string => {
  if (!AssemblyColors[assemblyId]) {
    const hue = (assemblyId * 137.5) % 360;
    AssemblyColors[assemblyId] = `hsl(${hue}, 70%, 60%)`;
  }
  return AssemblyColors[assemblyId];
};

interface PlacedPartProps {
  width: number;
  height: number;
  depth: number;
  position: [number, number, number];
  materialType: string;
  assemblyId: number;
  colorBy: 'material' | 'assembly';
  rotation?: [number, number, number];
  wireframe?: boolean;
}

const PlacedPart: React.FC<PlacedPartProps> = ({ 
  width, 
  height, 
  depth, 
  position, 
  materialType, 
  assemblyId, 
  colorBy, 
  rotation = [0, 0, 0], 
  wireframe = false 
}) => {
  const color = colorBy === 'material' 
    ? PartColors[materialType] || PartColors.UNDEFINED
    : getAssemblyColor(assemblyId);
  
  return (
    <Box args={[width, height, depth]} position={position} rotation={rotation}>
      <meshStandardMaterial 
        color={color} 
        transparent 
        opacity={0.85} 
        wireframe={wireframe} 
      />
    </Box>
  );
};

export { PlacedPart, PartColors, getAssemblyColor };