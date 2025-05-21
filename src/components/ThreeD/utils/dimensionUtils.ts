import { Bin, Slot } from '../../../types/types';

/**
 * Calculate bin dimensions from all modules and slots
 */
export const getBinDimensions = (bin: Bin) => {
  let maxX = 0, maxY = 0, maxZ = 0;
  
  bin.modules.forEach(module => {
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

/**
 * Calculate the center position of a slot
 * @param slot The slot to calculate positioning for
 * @param moduleOrigin Optional module origin to account for module position
 */
export const getSlotPositioning = (
  slot: any, 
  moduleOrigin?: { X: number; Y: number; Z: number }
) => {
  // Calculate slot dimensions
  const slotWidth = Math.abs(slot.size.X);
  const slotHeight = Math.abs(slot.size.Y);
  const slotDepth = Math.abs(slot.size.Z);

  // Calculate the center position of the slot
  let slotX = slot.origin.X + slotWidth / 2;
  let slotY = slot.origin.Y + slotHeight / 2;
  let slotZ = slot.origin.Z + slotDepth / 2;
  
  // Calculate the bottom position of the slot (for placing parts)
  let slotBottomY = slot.origin.Y;
  
  // If module origin is provided, add it to the positions
  if (moduleOrigin) {
    slotX += moduleOrigin.X;
    slotY += moduleOrigin.Y;
    slotZ += moduleOrigin.Z;
    slotBottomY += moduleOrigin.Y;
  }
  
  return { slotX, slotY, slotZ, slotWidth, slotHeight, slotDepth, slotBottomY };
};

/**
 * Calculate the proper position for a part placed in a slot
 */
export const getPlacedPartPositioning = (
  slot: Slot,
  moduleOrigin: { X: number; Y: number; Z: number },
  partSize: { X: number; Y: number; Z: number },
  alignment: number = 0
) => {
  // Get slot positioning first
  const { slotX, slotZ, slotBottomY } = getSlotPositioning(slot, moduleOrigin);
  
  // Determine if part is rotated based on alignment
  const isRotated = alignment === 1;
  
  // Calculate part dimensions accounting for possible rotation
  const partWidth = isRotated ? partSize.Z : partSize.X;
  const partHeight = partSize.Y;
  const partDepth = isRotated ? partSize.X : partSize.Z;
  
  // Calculate part position
  // X and Z are centered in the slot
  // Y is positioned at the bottom of the slot + half of part height
  const partX = slotX;
  const partY = slotBottomY + (partHeight / 2);
  const partZ = slotZ;
  
  // Calculate rotation based on alignment
  const rotation: [number, number, number] = isRotated ? [0, Math.PI / 2, 0] : [0, 0, 0];
  
  return {
    // Position in three.js format
    position: [partX, partY, partZ] as [number, number, number],
    // Dimensions accounting for rotation
    dimensions: {
      width: partWidth,
      height: partHeight,
      depth: partDepth
    },
    // Rotation in three.js format
    rotation,
    // Flag indicating if the part is rotated
    isRotated
  };
};