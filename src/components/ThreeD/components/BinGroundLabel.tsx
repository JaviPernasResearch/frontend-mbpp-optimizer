import React from 'react';
import { Text } from '@react-three/drei';

interface BinGroundLabelProps {
  binId: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
}

const BinGroundLabel: React.FC<BinGroundLabelProps> = ({ 
  binId, 
  dimensions 
}) => {
  return (
    <group>
      <Text
        position={[dimensions.width/2, 5, 200]}
        rotation={[-Math.PI/2, 0, 0]}
        fontSize={100}
        color="#3366cc"
        anchorX="center"
        anchorY="middle"
        renderOrder={1}
        maxWidth={dimensions.width * 0.8}
      >
        Container {binId}
      </Text>
      
      <mesh 
        position={[dimensions.width/2, -0.5, 200]}
        rotation={[-Math.PI/2, 0, 0]}
      >
        <planeGeometry args={[dimensions.width * 0.65, 200]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
      </mesh>
    </group>
  );
};

export default BinGroundLabel;