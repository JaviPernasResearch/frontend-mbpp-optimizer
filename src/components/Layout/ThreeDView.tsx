'use client';

import { Canvas } from '@react-three/fiber';
import { useState, useEffect } from 'react';
import { OrbitControls, Box, Text } from '@react-three/drei';
import { useAtom } from 'jotai';
import { binDataState } from '@/states/binDataState';
import { binCountState } from '@/states/binCountState'; 
import { useOptimizationApi } from '@/hooks/useOptimizationApi';
import OptimizedContainer from '../ThreeD/OptimizedContainer';
import { toast } from 'react-toastify';

const ThreeDView = () => {
  // Use the shared container count atom
  const [containerCount] = useAtom(binCountState);
  const [binData] = useAtom(binDataState);
  const { solution, isOptimizing, runOptimization } = useOptimizationApi();
  const [colorBy, setColorBy] = useState<'material' | 'assembly'>('material');
  const [showSlots, setShowSlots] = useState<boolean>(true);
  const [activeContainerIndex, setActiveContainerIndex] = useState<number>(0);
  
  // Get packed parts from solution if available
  const packedParts = solution?.packed_parts || [];
  
  // Effect to observe solution changes
  useEffect(() => {
    if (solution) {
      console.log("Solution loaded in ThreeDView:", solution);
      console.log("Parts to render:", packedParts.length);
      
      // If we have parts and bins_used is not empty
      if (packedParts.length > 0 && solution.bins_used?.length > 0) {
        // Automatically switch to first bin with parts if not currently viewing one
        if (!solution.bins_used.includes(activeContainerIndex)) {
          setActiveContainerIndex(solution.bins_used[0]);
          toast.info(`Switching to container ${solution.bins_used[0]} with packed parts`);
        }
      }
    }
  }, [solution, activeContainerIndex]);

  
  // Determine which containers have parts in them
  const binsWithParts = solution?.bins_used || 
    (binData ? Array.from({ length: containerCount }, (_, i) => i) : []);
      
  // If binData is loaded, render the container model
  if (binData) {
    return (
      <div className="relative w-full h-full">
        {/* Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <button 
            onClick={() => setColorBy(prev => prev === 'material' ? 'assembly' : 'material')}
            className="bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 py-1 px-3 rounded shadow-md transition-all"
          >
            Color by: {colorBy === 'material' ? 'Material' : 'Assembly'}
          </button>
          <button 
            onClick={() => setShowSlots(!showSlots)}
            className="bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 py-1 px-3 rounded shadow-md transition-all"
          >
            {showSlots ? 'Hide Slots' : 'Show Slots'}
          </button>
          
          
          {/* Debug info display */}
          <div className="mt-2 bg-white bg-opacity-80 p-2 rounded text-xs">
            <p><strong>Solution:</strong> {solution ? 'Yes' : 'No'}</p>
            <p><strong>Total Parts:</strong> {packedParts.length}</p>
            <p><strong>Active Container:</strong> {activeContainerIndex}</p>
            <p><strong>Container Parts:</strong> {packedParts.filter(p => p.bin_id === activeContainerIndex).length}</p>
          </div>
        </div>
        
        {/* Container selection menu - now driven by containerCount */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex items-center gap-1 bg-white bg-opacity-75 px-3 py-2 rounded shadow-lg">
          <span className="text-sm mr-2">Container:</span>
          {Array.from({ length: containerCount }, (_, i) => (
            <button
              key={i}
              onClick={() => setActiveContainerIndex(i)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                ${activeContainerIndex === i 
                  ? 'bg-blue-600 text-white' 
                  : binsWithParts.includes(i)
                    ? 'bg-green-100 hover:bg-blue-200'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              title={`Container ${i}${binsWithParts.includes(i) ? ` (${packedParts.filter(p => p.bin_id === i).length} parts)` : ''}`}
            >
              {i}
            </button>
          ))}
          
          {containerCount > 10 && (
            <span className="text-xs italic ml-2">+{containerCount - 10} more</span>
          )}
          
          {containerCount > 1 && (
            <button 
              onClick={() => setActiveContainerIndex((prev) => (prev + 1) % containerCount)}
              className="ml-3 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center"
              title="Next container"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          )}
        </div>
        
        <Canvas 
          camera={{ 
            position: [1000, 600, 1000], 
            far: 10000,
          }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[500, 500, 500]} intensity={0.8} />
          <pointLight position={[-500, -500, -500]} intensity={0.2} />
          <OrbitControls/>
          
          <group rotation={[-Math.PI / 6, Math.PI / 6, 0]}>
            <OptimizedContainer
              containerCount={containerCount}
              packedParts={packedParts}
              colorBy={colorBy}
              showSlots={showSlots}
              activeContainerIndex={activeContainerIndex}
            />
            <Text position={[1100, 0, 0]} color="red" fontSize={50}>X</Text>
            <Text position={[0, 1100, 0]} color="green" fontSize={50}>Y</Text>
            <Text position={[0, 0, 1100]} color="blue" fontSize={50}>Z</Text>
          </group>
        </Canvas>
      </div>
    );
  }
  
  // Otherwise, show a placeholder container
  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [2, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <directionalLight position={[-5, 5, 5]} intensity={0.5} />
        <OrbitControls />
        
        {/* Default container box when no JSON is loaded */}
        <Box args={[2, 1.5, 1]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            attach="material" 
            color="lightgray" 
            opacity={0.7} 
            transparent 
            wireframe={true}
          />
        </Box>
        
        <Text 
          position={[0, -1.5, 0]}
          color="black" 
          fontSize={0.2}
          anchorX="center"
          anchorY="middle"
        >
          Upload a container JSON file to get started
        </Text>
        
        {/* Grid helper for better spatial orientation */}
        <gridHelper args={[10, 10]} />
        <axesHelper args={[5]} />
      </Canvas>
    </div>
  );
};

export default ThreeDView;