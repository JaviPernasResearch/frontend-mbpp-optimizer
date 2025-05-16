import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';
import { useContainerConfig } from '../../hooks/useContainerConfig';

interface PackedPart {
  part_id: number;
  bin_id: number;
  slot_id: number;
  alignment: number;
  assembly_id: number;
  material_type: string;
  part_type: string;
}

interface OptimizedContainerProps {
  containerCount: number;
  packedParts?: PackedPart[];
}

const PartColors: Record<string, string> = {
  "P2_MFB_19": "#8B4513", // Brown
  "P2_MFB_9": "#A0522D", // Sienna
  "MPX_ROH_15": "#CD853F", // Peru
  "MDF": "#D2B48C", // Tan
  "UNDEFINED": "#D3D3D3" // Light Gray
};

const AssemblyColors: Record<number, string> = {};
const getAssemblyColor = (assemblyId: number): string => {
  if (!AssemblyColors[assemblyId]) {
    // Generate a color based on the assembly ID
    const hue = (assemblyId * 137.5) % 360;
    AssemblyColors[assemblyId] = `hsl(${hue}, 70%, 60%)`;
  }
  return AssemblyColors[assemblyId];
};

const Part: React.FC<{
  width: number,
  height: number,
  depth: number,
  position: [number, number, number],
  materialType: string,
  assemblyId: number, 
  colorBy: 'material' | 'assembly',
  rotation?: [number, number, number]
}> = ({ width, height, depth, position, materialType, assemblyId, colorBy, rotation = [0, 0, 0] }) => {
  const color = colorBy === 'material' 
    ? PartColors[materialType] || PartColors.UNDEFINED
    : getAssemblyColor(assemblyId);
  
  return (
    <Box args={[width, height, depth]} position={position} rotation={rotation}>
      <meshStandardMaterial color={color} transparent opacity={0.85} />
    </Box>
  );
};

const Container: React.FC<{
  width: number,
  height: number,
  depth: number,
  position: [number, number, number],
  parts: PackedPart[],
  colorBy: 'material' | 'assembly'
}> = ({ width, height, depth, position, parts, colorBy }) => {
  // Container outline
  return (
    <group position={position}>
      {/* Container wireframe */}
      <Box args={[width, height, depth]} position={[0, 0, 0]}>
        <meshBasicMaterial color="black" wireframe />
      </Box>
      
      {/* Add slot dividers */}
      <Box args={[width, 0.5, depth]} position={[0, height/4, 0]}>
        <meshBasicMaterial color="gray" opacity={0.3} transparent />
      </Box>
      
      {/* Render parts */}
      {parts.map((part, index) => {
        // In a real application, these would be calculated from the slot placement
        const partWidth = 20; // Assuming parts have width of 20
        const partHeight = part.slot_id === 0 ? 100 : 80;
        const partDepth = 550;
        
        const partX = 0;
        const partY = part.slot_id === 0 ? -height/4 : height/4; 
        const partZ = index * 10 - 20; // Staggered for visibility
        
        const isRotated = part.alignment === 1;
        const rotation: [number, number, number] = isRotated ? [0, Math.PI / 2, 0] : [0, 0, 0];
        
        return (
          <Part 
            key={part.part_id}
            width={isRotated ? partHeight : partWidth}
            height={partHeight}
            depth={isRotated ? partWidth : partDepth}
            position={[partX, partY, partZ]}
            materialType={part.material_type}
            assemblyId={part.assembly_id}
            colorBy={colorBy}
            rotation={rotation}
          />
        );
      })}
      
      {/* Container label */}
      <Text 
        position={[0, -height/2 - 20, 0]}
        color="black" 
        fontSize={15}
        anchorX="center"
        anchorY="middle"
      >
        Container
      </Text>
    </group>
  );
};

const OptimizedContainer: React.FC<OptimizedContainerProps> = ({ containerCount, packedParts = [] }) => {
  const [colorBy, setColorBy] = useState<'material' | 'assembly'>('material');
  
  // Filter parts by container/bin ID
  const partsByBin = Array.from({ length: containerCount }, (_, i) => 
    packedParts.filter(part => part.bin_id === i)
  );
  
  return (
    <div className="relative w-full h-full">
      {/* Color mode toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={() => setColorBy(prev => prev === 'material' ? 'assembly' : 'material')}
          className="bg-white px-3 py-1 rounded shadow text-sm"
        >
          Color by: {colorBy === 'material' ? 'Material' : 'Assembly'}
        </button>
      </div>
      
      <Canvas camera={{ position: [0, 0, 1000], far: 10000 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <group position={[0, 0, 0]}>
          {partsByBin.map((binParts, index) => (
            <Container 
              key={index}
              width={22} 
              height={600} 
              depth={2100}
              position={[index * 40 - (containerCount-1) * 20, 0, 0]} 
              parts={binParts}
              colorBy={colorBy}
            />
          ))}
        </group>
      </Canvas>
    </div>
  );
};

export default OptimizedContainer;