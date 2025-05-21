import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import { binDataState } from '@/states/binDataState';
import { partsDataState } from '@/states/partsDataState';
import { PackedPart } from '../../types/types';
import BinInstance from './containers/BinInstance';
import { getBinDimensions, getPlacedPartPositioning } from './utils/dimensionUtils';

interface BinSceneProps {
  binCount: number;
  packedParts?: PackedPart[];
  colorBy?: 'material' | 'assembly';
  showSlots?: boolean;
  activeBinIndex?: number;
}

const BinScene: React.FC<BinSceneProps> = ({ 
  binCount, 
  packedParts = [], 
  colorBy = 'material',
  showSlots = true,
  activeBinIndex = 0
}) => {
  const [binData] = useAtom(binDataState);
  const [partsData] = useAtom(partsDataState);
  
  useEffect(() => {
    // Log information about packed parts if we have any
    if (packedParts.length > 0) {
      const currentBinParts = packedParts.filter(part => part.bin_id === activeBinIndex);
      console.log(`Found ${currentBinParts.length} packed parts for bin ${activeBinIndex}`);
      
      if (currentBinParts.length > 0) {
        console.log("Sample packed part:", currentBinParts[0]);
      }
    }
    
    // Log information about original parts if we have any
    if (partsData && partsData.length > 0) {
      console.log("Sample original part:", partsData[0]);
    } else {
      console.log("No parts data available yet - will render empty bin");
    }
  }, [binCount, packedParts, activeBinIndex, partsData]);
  
  // Still check for binData - we need at least the bin structure
  if (!binData) {
    console.warn("No bin data available. Cannot render bin structure.");
    return null;
  }
    
  const dimensions = getBinDimensions(binData);
  
  // Filter parts by bin ID - only if we have packed parts
  const partsByBin = packedParts.length > 0 
    ? Array.from({ length: binCount }, (_, i) => packedParts.filter(part => part.bin_id === i))
    : Array(binCount).fill([]);
  
  // Only count valid parts if we have both packed parts and parts data
  const validPartsCount = (partsData && partsByBin[activeBinIndex]) 
    ? partsByBin[activeBinIndex].filter((part: PackedPart) => 
        partsData.some(p => p.guid === part.part_guid)
      ).length 
    : 0;
  
  if (packedParts.length > 0 && partsData && partsData.length > 0) {
    console.log(`Bin ${activeBinIndex} has ${validPartsCount} parts with valid original part data`);
  }
  
  return (
    <group>
      <BinInstance 
        key={activeBinIndex}
        bin={binData}
        position={[0, 0, dimensions.depth]}
        parts={partsByBin[activeBinIndex] || []}
        colorBy={colorBy}
        showSlots={showSlots}
        binId={activeBinIndex}
        allParts={partsData || []} // Pass empty array if partsData is null
      />
    </group>
  );
};

export default BinScene;