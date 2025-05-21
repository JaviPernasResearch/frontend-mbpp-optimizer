import React, { useEffect } from 'react';
import { Bin, PackedPart, Part } from '../../../types/types';
import BinGroundLabel from '../components/BinGroundLabel';
import BinModule from '../components/BinModule';
import { PlacedPart } from '../components/PlacedPart';
import { getBinDimensions, getSlotPositioning, getPlacedPartPositioning } from '../utils/dimensionUtils';
import { solutionDataState } from '@/states/solutionDataState';
import { useAtom } from 'jotai';

interface BinInstanceProps {
  bin: Bin;
  position: [number, number, number];
  parts: PackedPart[];
  colorBy: 'material' | 'assembly';
  showSlots: boolean;
  binId: number;
  allParts: Part[];
}

const BinInstance: React.FC<BinInstanceProps> = ({ 
  bin, 
  position, 
  parts, 
  colorBy, 
  showSlots, 
  binId, 
  allParts 
}) => {
  const [solution] = useAtom(solutionDataState);
  const dimensions = getBinDimensions(bin);
  
  useEffect(() => {
    console.log(`ThreeDBin: Rendering ${parts.length} parts for bin ${binId}`);
    console.log("Available original parts:", allParts.length);
  }, [parts, binId, allParts]);
  
  return (
    <group position={position} rotation={[0, 0, 0]}>
      <BinGroundLabel 
        binId={binId}
        dimensions={dimensions} 
      />
      
      {bin.modules.map((module) => (
        <BinModule 
          key={module.guid}
          module={module} 
          position={[module.origin.X, module.origin.Y, module.origin.Z]}
          showSlots={showSlots}
        />
      ))}
      
        {/* Only render parts if solution is available and parts exist */}
        {solution && parts.length > 0 && allParts && allParts.length > 0 && 
        parts.map((packedPart)  => {
        try {
          const originalPart = allParts.find(p => p.guid === packedPart.part_guid);
          
          // Check if the original part was found
          if (!originalPart) {
            console.error(`No original part found for packed part ID: ${packedPart.part_guid}`);
            return null;
          }

          // Check if the packed part belongs to the current bin
          if (binId !== packedPart.bin_id){
            return null;
          }

          // Find the module that contains the packed part
          const module = bin.modules.find(m => m.guid === packedPart.module_guid);
          if (!module) {
            console.error(`No module found with guid: ${packedPart.module_guid}`);
            return null;
          }
          
          // Find the slot in the module
          const slot = module.slots.find(s => s.global_index === packedPart.slot_gid);
          
          // Check if the slot was found
          if (!slot) {
            console.error(`No slot found for packed part ID: ${packedPart.part_guid}`);
            return null;
          }
          
          console.log(`Rendering part ${packedPart.part_guid} in slot ${slot.global_index} of module ${module.guid}`);
          console.log(`Slot position:`, slot.origin);
         
          // After finding the module and slot:
          const { slotX, slotY, slotZ } = getSlotPositioning(slot, module.origin);


          // Use the new utility function to calculate part positioning
          const partPositioning = getPlacedPartPositioning(
            slot,
            module.origin,
            originalPart.size,
            packedPart.alignment
          );

          // Add a small sphere at the slot center to visualize slot position
          return (
            <group key={packedPart.part_guid}>
            {/* Debugging sphere at slot center */}
            <mesh position={[slotX, slotY, slotZ]}>
              <sphereGeometry args={[10]} />
              <meshBasicMaterial color="red" wireframe={true} />
            </mesh>
            
            {/* Debugging sphere at part position */}
            <mesh position={partPositioning.position}>
              <sphereGeometry args={[10]} />
              <meshBasicMaterial color="green" wireframe={true} />
            </mesh>
              
              {/* The actual part */}
              <PlacedPart 
                width={partPositioning.dimensions.width}
                height={partPositioning.dimensions.height}
                depth={partPositioning.dimensions.depth}
                position={partPositioning.position}
                materialType={originalPart.material || packedPart.material_type}
                assemblyId={originalPart.assembly_id || packedPart.assembly_id}
                colorBy={colorBy}
                rotation={partPositioning.rotation}
                wireframe={false}
              />
            </group>
          );
        } catch (error) {
          console.error(`Error rendering part ${packedPart.part_guid}:`, error);
          return null;
        }
      })}
    </group>
  );
};

export default BinInstance;