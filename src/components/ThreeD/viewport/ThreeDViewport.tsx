import { Canvas } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { AxesHelper, Object3D } from 'three';
import BinScene from '../scene/BinScene';
import CameraController from './CameraController';


interface ThreeDViewportProps {
  containerRef: React.RefObject<Object3D>;
  containerSize: { X: number; Y: number; Z: number };
  binCount: number;
  packedParts: any[];
  colorBy: 'material' | 'assembly';
  showSlots: boolean;
  showGrid: boolean;
  showAxes: boolean;
  activeBinIndex: number;
}

const ThreeDViewport: React.FC<ThreeDViewportProps> = ({
  containerRef,
  containerSize,
  binCount,
  packedParts,
  colorBy,
  showSlots,
  showGrid,
  showAxes,
  activeBinIndex
}) => {
  return (
    <Canvas 
      camera={{ 
        position: [2000, 1500, 2000],
        far: 20000,
        fov: 45,
        near: 100,
      }}
      key="main-canvas"
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[500, 500, 500]} intensity={0.8} />
      <pointLight position={[-500, -500, -500]} intensity={0.2} />
      
      {/* Our camera controller component */}
      <CameraController containerSize={containerSize} />
      
      <group rotation={[0, 0, 0]} ref={containerRef}>
        <BinScene
          binCount={binCount}
          packedParts={packedParts}
          colorBy={colorBy}
          showSlots={showSlots}
          activeBinIndex={activeBinIndex}
        />
        <Text position={[1100, 0, 0]} color="red" fontSize={50}>X</Text>
        <Text position={[0, 1100, 0]} color="green" fontSize={50}>Y</Text>
        <Text position={[0, 0, 1100]} color="blue" fontSize={50}>Z</Text>
        
        {/* Add a ground grid - only show if showGrid is true */}
        {showGrid && (
          <gridHelper 
            args={[5000, 50]}
            position={[500, -10, 500]}
          />
        )}
        
        {/* Axes helper at the origin - only show if showAxes is true */}
        {showAxes && (
          <primitive object={new AxesHelper(5000)} />
        )}
      </group>
    </Canvas>
  );
};

export default ThreeDViewport;