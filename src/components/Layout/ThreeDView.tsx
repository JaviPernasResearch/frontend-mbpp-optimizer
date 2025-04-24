'use client';

import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import { Box } from '@react-three/drei';
import {STLLoader} from 'three/addons/loaders/STLLoader.js';
import { useContainerConfig } from '../../hooks/useContainerConfig';
import * as THREE from 'three';

const StlModel = ({ stlData, wireframe }: { stlData: ArrayBuffer | null, wireframe: boolean }) => {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    if (!stlData) return;

    const loader = new STLLoader();
    const loadedGeometry = loader.parse(stlData);
    
    // Center the geometry
    loadedGeometry.center();
    setGeometry(loadedGeometry);
  }, [stlData]);

  if (!geometry) return null;

  return (
    <mesh>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial color="lightblue" wireframe={wireframe} />
    </mesh>
  );
};

const ThreeDView = () => {
  const { stlData } = useContainerConfig();
  const [wireframe, setWireframe] = useState(false);
  
  return (
    <div className="relative w-full h-full">
      {/* Wireframe toggle button */}
      <button
        onClick={() => setWireframe(!wireframe)}
        className="absolute top-4 right-4 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 py-1 px-3 rounded shadow-md transition-all"
      >
        {wireframe ? 'Solid View' : 'Wireframe View'}
      </button>
      
      <Canvas camera={{ position: [2, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <directionalLight position={[-5, 5, 5]} intensity={0.5} />
        <OrbitControls />
        
        {/* Default container box when no STL is loaded */}
        {!stlData && (
          <Box args={[2, 1.5, 1]} position={[0, 0, 0]}>
            <meshStandardMaterial 
              attach="material" 
              color="lightgray" 
              opacity={0.7} 
              transparent 
              wireframe={wireframe}
            />
          </Box>
        )}
        
        {/* Render STL model when available */}
        {stlData && <StlModel stlData={stlData} wireframe={wireframe} />}
        
        {/* Grid helper for better spatial orientation */}
        <gridHelper args={[10, 10]} />
        <axesHelper args={[5]} />
      </Canvas>
    </div>
  );
};

export default ThreeDView;