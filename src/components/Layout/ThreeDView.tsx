'use client';

import { Canvas } from '@react-three/fiber';
import { useState } from 'react';
import { OrbitControls, Box, Text } from '@react-three/drei';
import { useContainerConfig } from '../../hooks/useContainerConfig';
import { useOptimizationApi } from '@/hooks/useOptimizationApi';
import { useAtom } from 'jotai';
import { binDataState } from '@/states/binDataState';
import OptimizedContainer from '../ThreeD/OptimizedContainer';

const ThreeDView = () => {
  const { containerCount } = useContainerConfig();
  const [binData] = useAtom(binDataState);
  const { solution } = useOptimizationApi();
  const [colorBy, setColorBy] = useState<'material' | 'assembly'>('material');
  const [showSlots, setShowSlots] = useState<boolean>(true);
  
  // Get packed parts from solution if available
  const packedParts = solution?.packed_parts || [];
  
  // If binData is loaded, render the JSON bin model
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
        </div>
        
        <Canvas camera={{ position: [1000, 600, 1000], far: 10000 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[500, 500, 500]} intensity={0.8} />
          <pointLight position={[-500, -500, -500]} intensity={0.2} />
          <OrbitControls />
          
          <group rotation={[-Math.PI / 6, Math.PI / 6, 0]}>
            <OptimizedContainer
              containerCount={containerCount}
              packedParts={packedParts}
              colorBy={colorBy}
              showSlots={showSlots}
            />
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