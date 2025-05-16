import React from 'react';
import { Box, Text } from '@react-three/drei';
import { useAtom } from 'jotai';
import { binDataState } from '@/states/binDataState';
import { IMOSBin, Module as ModuleType } from '../../types/BinTypes';

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
  colorBy?: 'material' | 'assembly';
  showSlots?: boolean;
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
      <Text 
        position={[0, 0, depth/2 + 5]}
        color="black" 
        fontSize={10}
        anchorX="center"
        anchorY="middle"
      >
        {`Slot ${index}`}
      </Text>
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
      {showSlots && module.Slots.$values.map((slot) => {
        // Convert the IMOS coordinates to Three.js coordinates
        // Note: IMOS uses Y for height, Z for depth, X for width
        // Three.js uses standard: X = width, Y = height, Z = depth
        const slotWidth = Math.abs(slot.Size.X);
        const slotHeight = Math.abs(slot.Size.Y);
        const slotDepth = Math.abs(slot.Size.Z);
        
        // Calculate position from the slot origin (center of the slot in IMOS)
        const slotX = slot.Origin.X + slotWidth/2;
        const slotY = slot.Origin.Y + slotHeight/2;
        const slotZ = slot.Origin.Z + slotDepth/2;
        
        return (
          <Slot 
            key={slot.Guid}
            width={slotWidth}
            height={slotHeight}
            depth={slotDepth}
            position={[slotX, slotY, slotZ]}
            index={slot.GlobalIndex}
          />
        );
      })}
    </group>
  );
};

const IMOSContainer: React.FC<{
  bin: IMOSBin,
  position: [number, number, number],
  parts: PackedPart[],
  colorBy: 'material' | 'assembly',
  showSlots: boolean
}> = ({ bin, position, parts, colorBy, showSlots }) => {
  // Calculate container dimensions from all modules
  const getContainerDimensions = () => {
    let maxX = 0, maxY = 0, maxZ = 0;
    
    bin.Modules.$values.forEach(module => {
      module.Slots.$values.forEach(slot => {
        const endX = slot.Origin.X + Math.abs(slot.Size.X);
        const endY = slot.Origin.Y + Math.abs(slot.Size.Y);
        const endZ = slot.Origin.Z + Math.abs(slot.Size.Z);
        
        maxX = Math.max(maxX, endX);
        maxY = Math.max(maxY, endY);
        maxZ = Math.max(maxZ, Math.abs(endZ));
      });
    });
    
    return { width: maxX, height: maxY, depth: maxZ };
  };
  
  const dimensions = getContainerDimensions();
  
  return (
    <group position={position}>
      {/* Container wireframe */}
      <Box args={[dimensions.width, dimensions.height, dimensions.depth]} position={[dimensions.width/2, dimensions.height/2, dimensions.depth/2]}>
        <meshBasicMaterial color="black" wireframe />
      </Box>
      
      {/* Render modules */}
      {bin.Modules.$values.map((module) => (
        <Module 
          key={module.Guid}
          module={module} 
          position={[module.Origin.X, module.Origin.Y, module.Origin.Z]}
          showSlots={showSlots}
        />
      ))}
      
      {/* Render parts */}
      {parts.map((part) => {
        // Find the appropriate module and slot
        // Logic to find which module this part belongs to based on slot_id
        const moduleIndex = Math.min(
          Math.floor(part.slot_id / 100), // Rough approximation
          bin.Modules.$values.length - 1
        );
        
        const module = bin.Modules.$values[moduleIndex];
        // Find the slot within the module that matches this part's slot_id
        const slotIndex = Math.min(
          part.slot_id % 100, // Rough approximation
          module.Slots.$values.length - 1
        );
        
        const slot = module.Slots.$values[slotIndex];
        
        // Part dimensions based on slot size with some margin
        const partWidth = Math.abs(slot.Size.X) * 0.95;
        const partHeight = Math.abs(slot.Size.Y) * 0.95;
        const partDepth = Math.abs(slot.Size.Z) * 0.95;
        
        // Calculate position (center of slot)
        const partX = module.Origin.X + slot.Origin.X + partWidth/2;
        const partY = module.Origin.Y + slot.Origin.Y + partHeight/2;
        const partZ = module.Origin.Z + slot.Origin.Z + partDepth/2;
        
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
        position={[dimensions.width/2, -20, dimensions.depth/2]}
        color="black" 
        fontSize={15}
        anchorX="center"
        anchorY="middle"
      >
        Container {bin.Id}
      </Text>
    </group>
  );
};

const OptimizedContainer: React.FC<OptimizedContainerProps> = ({ 
  containerCount, 
  packedParts = [], 
  colorBy = 'material',
  showSlots = true
}) => {
  // Use binData from Jotai
  const [binData] = useAtom(binDataState);
  
  if (!binData) {
    return null; // Return nothing if no bin data is available
  }
  
  // Filter parts by container/bin ID
  const partsByBin = Array.from({ length: containerCount }, (_, i) => 
    packedParts.filter(part => part.bin_id === i)
  );
  
  return (
    <group>
      {Array.from({ length: containerCount }).map((_, index) => (
        <IMOSContainer 
          key={index}
          bin={binData}
          position={[index * 1200, 0, 0]}
          parts={partsByBin[index] || []}
          colorBy={colorBy}
          showSlots={showSlots}
        />
      ))}
    </group>
  );
};

export default OptimizedContainer;