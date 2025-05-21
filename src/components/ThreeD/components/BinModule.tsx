import React from 'react';
import { Module as ModuleType } from '../../../types/types';
import ModuleSlot from './ModuleSlot';
import {getSlotPositioning} from '../utils/dimensionUtils';

interface BinModuleProps {
  module: ModuleType;
  position: [number, number, number];
  showSlots: boolean;
}

const BinModule: React.FC<BinModuleProps> = ({ 
  module, 
  position, 
  showSlots 
}) => {
  return (
    <group position={position}>
      {showSlots && module.slots.map((slot) => {
        // Get the slot dimensions and position using the getSlotPositioning function
        const { slotWidth, slotHeight, slotDepth, slotX, slotY, slotZ} = getSlotPositioning(slot);

        return (
          <ModuleSlot 
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

export default BinModule;