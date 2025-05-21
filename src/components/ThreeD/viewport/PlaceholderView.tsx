import { Canvas } from '@react-three/fiber';
import { Box, Text, OrbitControls } from '@react-three/drei';

interface PlaceholderViewProps {
  showGrid: boolean;
}

const PlaceholderView: React.FC<PlaceholderViewProps> = ({ showGrid }) => {
  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [2, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <directionalLight position={[-5, 5, 5]} intensity={0.5} />
        <OrbitControls />
        
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
        
        {showGrid && <gridHelper args={[10, 10]} />}
      </Canvas>
    </div>
  );
};

export default PlaceholderView;