'use client';

import { Canvas } from '@react-three/fiber';
import { useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import { Box } from '@react-three/drei';

const BoardsContainer = () => {
  useEffect(() => {
    // Any additional setup can be done here
  }, []);

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      <Box args={[1, 1, 1]} position={[0, 0, 0]}>
        <meshStandardMaterial attach="material" color="brown" />
      </Box>
      {/* Additional 3D elements can be added here */}
    </Canvas>
  );
};

export default BoardsContainer;