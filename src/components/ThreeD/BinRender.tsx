import React from 'react';
import { Box, Text } from '@react-three/drei';
import { useAtom } from 'jotai';
import { binDataState } from '@/states/binDataState';
import { Bin, Module as ModuleType, PackedPart} from '../../types/BinTypes';

interface BinRenderProps {
  binCount: number;
  packedParts?: PackedPart[];
  colorBy?: 'material' | 'assembly';
  showSlots?: boolean;
  activeBinIndex?: number;
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

const Slot: React.FC<{
  width: number,
  height: number,
  depth: number,
  position: [number, number, number],
  index: number
}> = ({ width, height, depth, position, index }) => {
  return (
    <Box args={[width, height, depth]} position={position}>
      <meshBasicMaterial color="gray" wireframe opacity={0.3} transparent />
    </Box>
  );
};

const Module: React.FC<{
  module: ModuleType,
  position: [number, number, number],
  showSlots: boolean
}> = ({ module, position, showSlots }) => {
  return (
    <group position={position}>
      {showSlots && module.slots.map((slot) => {
        // 3D: X = width, Y = height, Z = depth
        // Three.js: X = width, Y = height, Z = depth (standard)
        const slotWidth = Math.abs(slot.size.X);
        const slotHeight = Math.abs(slot.size.Y);
        const slotDepth = Math.abs(slot.size.Z);

        // Position the center of the slot properly
        const slotX = slot.origin.X + slotWidth/2;
        const slotY = slot.origin.Y + slotHeight/2;
        const slotZ = slot.origin.Z + slotDepth/2;
        
        return (
          <Slot 
            key={slot.guid}
            width={slotWidth}
            height={slotHeight}
            depth={slotDepth}
            position={[slotX, slotY, slotZ]}
            index={slot.global_index}
          />
        );
      })}
    </group>
  );
};

const BinGroundLabel: React.FC<{
  binId: number,
  dimensions: { width: number, height: number, depth: number }
}> = ({ binId: binId, dimensions }) => {
  return (
    <group>
      {/* Bin number text on the ground */}
      <Text
        position={[dimensions.width/2, 5, 200]} // Positioned in front of container on the ground
        rotation={[-Math.PI/2, 0, 0]} // Rotate to lie flat on the ground
        fontSize={100}
        color="#3366cc"
        anchorX="center"
        anchorY="middle"
        renderOrder={1} // Ensure text renders above grid
        maxWidth={dimensions.width * 0.8}
      >
        Container {binId}
      </Text>
      
      {/* Optional: Add a transparent background plate for better visibility */}
      <mesh 
        position={[dimensions.width/2, -0.5, 200]}
        rotation={[-Math.PI/2, 0, 0]}
      >
        <planeGeometry args={[dimensions.width * 0.65, 200]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
      </mesh>
    </group>
  );
};

const ThreeDBin: React.FC<{
  bin: Bin,
  position: [number, number, number],
  parts: PackedPart[],
  colorBy: 'material' | 'assembly',
  showSlots: boolean,
  binId: number
}> = ({ bin, position, parts, colorBy, showSlots, binId }) => {
  // Calculate Bin dimensions from all modules
  const getBinDimensions = () => {
    let maxX = 0, maxY = 0, maxZ = 0;
    
    bin.modules.forEach(module => {
      module.slots.forEach(slot => {
        const endX = slot.origin.X + Math.abs(slot.size.X);
        const endY = slot.origin.Y + Math.abs(slot.size.Y);
        const endZ = slot.origin.Z + Math.abs(slot.size.Z);
        
        maxX = Math.max(maxX, endX);
        maxY = Math.max(maxY, endY);
        maxZ = Math.max(maxZ, Math.abs(endZ));
      });
    });
    
    return { width: maxX, height: maxY, depth: maxZ };
  };
  
  const dimensions = getBinDimensions();
  
  return (
    <group position={position} rotation={[0, 0, 0]}>
      {/* Bin ground label instead of sign post */}
      <BinGroundLabel 
        binId={binId}
        dimensions={dimensions} 
      />
      
      {/* Render modules */}
      {bin.modules.map((module) => (
        <Module 
          key={module.guid}
          module={module} 
          position={[module.origin.X, module.origin.Y, module.origin.Z]}
          showSlots={showSlots}
        />
      ))}
      
      {/* Render parts */}
      {parts.map((part) => {
        // Find the appropriate module and slot
        const moduleIndex = Math.min(
          Math.floor(part.slot_id / 100),
          bin.modules.length - 1
        );
        
        const module = bin.modules[moduleIndex];
        const slotIndex = Math.min(
          part.slot_id % 100,
          module.slots.length - 1
        );
        
        const slot = module.slots[slotIndex];
        
        // Part dimensions based on slot size with some margin
        const partWidth = Math.abs(slot.size.X) * 0.95;
        const partHeight = Math.abs(slot.size.Y) * 0.95;
        const partDepth = Math.abs(slot.size.Z) * 0.95;
        
        // Calculate position (center of slot)
        const partX = module.origin.X + slot.origin.X + partWidth/2;
        const partY = module.origin.Y + slot.origin.Y + partHeight/2;
        const partZ = module.origin.Z + slot.origin.Z + partDepth/2;
        
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
    </group>
  );
};

const BinRender: React.FC<BinRenderProps> = ({ 
  binCount, 
  packedParts = [], 
  colorBy = 'material',
  showSlots = true,
  activeBinIndex = 0
}) => {
  // Use binData from Jotai
  const [binData] = useAtom(binDataState);

  
  if (!binData) {
    return null; // Return nothing if no bin data is available
  }
  
  // Filter parts by bin ID
  const partsByBin = Array.from({ length: binCount }, (_, i) => 
    packedParts.filter(part => part.bin_id === i)
  );
  
  // Calculate container dimensions for axis positioning
  const getBinDimensions = () => {
    let maxX = 0, maxY = 0, maxZ = 0;
    
    binData.modules.forEach(module => {
      module.slots.forEach(slot => {
        const endX = slot.origin.X + Math.abs(slot.size.X);
        const endY = slot.origin.Y + Math.abs(slot.size.Y);
        const endZ = Math.abs(slot.size.Z);
        
        maxX = Math.max(maxX, endX);
        maxY = Math.max(maxY, endY);
        maxZ = Math.max(maxZ, Math.abs(endZ));
      });
    });
    
    return { width: maxX, height: maxY, depth: maxZ };
  };
  
  const dimensions = getBinDimensions();
  
  return (
    <group>
      
      {/* Add a colored ground plane for even better visibility
      <mesh 
        position={[dimensions.width/2, -1, dimensions.depth/2]} 
        rotation={[-Math.PI/2, 0, 0]}
      >
        <planeGeometry args={[dimensions.width * 2, dimensions.depth * 2]} />
        <meshBasicMaterial color="#f0f0f0" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh> */}
      
      {/* Only render the active container, positioned in front of the axes */}
      <ThreeDBin 
        key={activeBinIndex}
        bin={binData}
        position={[0, 0, dimensions.depth]}  // Keep the container at origin
        parts={partsByBin[activeBinIndex] || []}
        colorBy={colorBy}
        showSlots={showSlots}
        binId={activeBinIndex}
      />
    </group>
  );
};

export default BinRender;