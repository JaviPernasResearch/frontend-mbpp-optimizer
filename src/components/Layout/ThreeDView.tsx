'use client';

import { useState, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { Object3D } from 'three';
import { toast } from 'react-toastify';
import { binDataState } from '@/states/binDataState';
import { binCountState } from '@/states/binCountState'; 
import { useOptimizationApi } from '@/hooks/useOptimizationApi';
import { CameraProvider } from '@/context/CameraContext';
import ThreeDViewport from '../ThreeD/viewport/ThreeDViewport';
import CameraControls from '../ThreeD/controls/CameraControls';
import BinSelector from '../ThreeD/controls/BinSelector';
import ViewControls from '../ThreeD/controls/ViewControls';
import PlaceholderView from '../ThreeD/viewport/PlaceholderView';
import DebugPanel from '../ThreeD/utils/DebugPanel';

const ThreeDView = () => {
  // Core state
  const [binCount] = useAtom(binCountState);
  const [binData] = useAtom(binDataState);
  const { solution } = useOptimizationApi();
  const [colorBy, setColorBy] = useState<'material' | 'assembly'>('material');
  const [showSlots, setShowSlots] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showAxes, setShowAxes] = useState<boolean>(true);
  const [activeBinIndex, setActiveBinIndex] = useState<number>(0);
  
  // Track if user has manually selected a bin
  const [userSelectedBin, setUserSelectedBin] = useState<boolean>(false);
  
  // Reference to the container group for camera fitting
  const containerRef = useRef<Object3D>(new Object3D());
  
  // Get packed parts from solution if available
  const packedParts = solution?.packed_parts || [];
  
  // Effect to observe solution changes
  useEffect(() => {
    if (solution) {
      console.log("Solution loaded in ThreeDView:", solution);
      console.log("Parts to render:", packedParts.length);
      
      // Only auto-switch bins on initial solution load, not when user has selected bins manually
      if (packedParts.length > 0 && solution.bins_used?.length > 0 && !userSelectedBin) {
        // Only switch if current bin has no parts
        const currentBinHasParts = solution.bins_used.includes(activeBinIndex);
        if (!currentBinHasParts) {
          setActiveBinIndex(solution.bins_used[0]);
          toast.info(`Switching to container ${solution.bins_used[0]} with packed parts`);
        }
      }
    }
  }, [solution, packedParts, activeBinIndex, userSelectedBin]);
  
  // Custom bin setter that tracks user selection
  const handleBinChange = (binIndex: number) => {
    setActiveBinIndex(binIndex);
    setUserSelectedBin(true);
  };
  
  // Determine which containers have parts in them
  const binsWithParts = solution?.bins_used || 
    (binData ? Array.from({ length: binCount }, (_, i) => i) : []);
  
  // Get container size for camera target
  const containerSize = binData?.size || { X: 1000, Y: 600, Z: 1000 };

  // If binData is loaded, render the container model
  if (binData) {
    return (
      <CameraProvider>
        <div className="relative w-full h-full">
          {/* Camera controls panel */}
          <CameraControls containerRef={containerRef} />
          
          {/* View settings panel */}
          <ViewControls 
            colorBy={colorBy} 
            showSlots={showSlots}
            showGrid={showGrid}
            showAxes={showAxes}
            setColorBy={setColorBy}
            setShowSlots={setShowSlots}
            setShowGrid={setShowGrid}
            setShowAxes={setShowAxes}
          />
          
          {/* Debug information panel */}
          <DebugPanel 
            solution={solution}
            packedParts={packedParts}
            activeBinIndex={activeBinIndex}
          />
          
          {/* Container selector */}
          <BinSelector
            binCount={binCount}
            activeBinIndex={activeBinIndex}
            setActiveBinIndex={handleBinChange}
            binsWithParts={binsWithParts}
            packedParts={packedParts}
          />
          
          {/* Main 3D viewport */}
          <ThreeDViewport 
            containerRef={containerRef}
            containerSize={containerSize}
            binCount={binCount}
            packedParts={packedParts}
            colorBy={colorBy}
            showSlots={showSlots}
            showGrid={showGrid}
            showAxes={showAxes}
            activeBinIndex={activeBinIndex}
          />
        </div>
      </CameraProvider>
    );
  }
  
  // Return placeholder view when no container data
  return <PlaceholderView showGrid={showGrid} />;
};

export default ThreeDView;