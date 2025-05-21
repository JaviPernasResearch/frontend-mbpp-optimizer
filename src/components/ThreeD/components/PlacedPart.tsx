import React from 'react';
import { Box } from '@react-three/drei';
import { getMaterialColor, getAssemblyColor } from '@/utils/colorUtils';
import { MaterialType } from '@/types/types';

interface PlacedPartProps {
  width: number;
  height: number;
  depth: number;
  position: [number, number, number];
  materialType: MaterialType;
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
  // Use shared color utilities
  const color = colorBy === 'material' 
    ? getMaterialColor(materialType)
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

export { PlacedPart };