import React from 'react';
import { Box } from '@react-three/drei';

interface ModuleSlotProps {
  width: number;
  height: number;
  depth: number;
  position: [number, number, number];
  index: number;
}

const ModuleSlot: React.FC<ModuleSlotProps> = ({ 
  width, 
  height, 
  depth, 
  position, 
  index 
}) => {
  return (
    <Box args={[width, height, depth]} position={position}>
      <meshBasicMaterial color="gray" wireframe opacity={0.3} transparent />
    </Box>
  );
};

export default ModuleSlot;