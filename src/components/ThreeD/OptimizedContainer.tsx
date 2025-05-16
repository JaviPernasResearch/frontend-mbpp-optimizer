import React, { useState, useEffect } from 'react';
import { Box, Text, Grid, Html } from '@react-three/drei';
import { useAtom } from 'jotai';
import { binDataState } from '@/states/binDataState';
import { Bin, Module as ModuleType, PackedPart} from '../../types/BinTypes';
import * as THREE from 'three';

interface OptimizedContainerProps {
  containerCount: number;
  packedParts?: PackedPart[];
  colorBy?: 'material' | 'assembly';
  showSlots?: boolean;
  activeContainerIndex?: number;
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
        // IMOS: X = width, Y = height, Z = depth
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

const ContainerSign: React.FC<{
  containerId: number,
  position: [number, number, number]
}> = ({ containerId, position }) => {
  return (
    <group position={position}>
      {/* Sign post */}
      <Box args={[2, 80, 2]} position={[0, 40, 0]}>
        <meshStandardMaterial color="#555" />
      </Box>
      
      {/* Sign board */}
      <Box args={[60, 40, 2]} position={[0, 90, 0]}>
        <meshStandardMaterial color="#f0f0f0" />
      </Box>
      
      {/* Container number text */}
      <Text
        position={[0, 90, 2]}
        fontSize={20}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        Container {containerId}
      </Text>
    </group>
  );
};

const IMOSContainer: React.FC<{
  bin: Bin,
  position: [number, number, number],
  parts: PackedPart[],
  colorBy: 'material' | 'assembly',
  showSlots: boolean,
  containerId: number
}> = ({ bin, position, parts, colorBy, showSlots, containerId }) => {
  // Calculate container dimensions from all modules
  const getContainerDimensions = () => {
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
  
  const dimensions = getContainerDimensions();
  
  return (
    <group position={position} rotation={[0, 0, 0]}>
      {/* Container sign instead of wireframe box */}
      <ContainerSign 
        containerId={containerId} 
        position={[dimensions.width/2, 0, -50]}
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

const OptimizedContainer: React.FC<OptimizedContainerProps> = ({ 
  containerCount, 
  packedParts = [], 
  colorBy = 'material',
  showSlots = true,
  activeContainerIndex = 0
}) => {
  // Use binData from Jotai
  const [binData] = useAtom(binDataState);
  
  if (!binData) {
    return null; // Return nothing if no bin data is available
  }
  
  // Limit container count to 10
  const limitedContainerCount = Math.min(containerCount, 10);
  
  // Filter parts by container/bin ID
  const partsByBin = Array.from({ length: limitedContainerCount }, (_, i) => 
    packedParts.filter(part => part.bin_id === i)
  );
  
  // Calculate container dimensions for axis positioning
  const getContainerDimensions = () => {
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
  
  const dimensions = getContainerDimensions();
   
  return (
    <group>
      {/* Axes helper at the origin */}
      <primitive object={new THREE.AxesHelper(1000)} />
      
      {/* Add a grid to show the ground plane at the origin */}
      <Grid 
        args={[dimensions.width * 1.5, dimensions.depth * 1.5]} 
        position={[dimensions.width/2, 0, dimensions.depth/2]} 
        cellSize={20}
        cellThickness={0.5}
        cellColor="#6f6f6f"
        sectionSize={100}
        sectionThickness={1}
        sectionColor="#9d4b4b"
        rotation={[-Math.PI/2, 0, 0]}
      />
      
      {/* Only render the active container, positioned in front of the axes */}
      <IMOSContainer 
        key={activeContainerIndex}
        bin={binData}
        position={[0, 0, dimensions.depth]}  // Keep the container at origin
        parts={partsByBin[activeContainerIndex] || []}
        colorBy={colorBy}
        showSlots={showSlots}
        containerId={activeContainerIndex}
      />
    </group>
  );
};

export default OptimizedContainer;