import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { cameraManager } from '@/utils/cameraManager';

interface CameraControllerProps {
  containerSize: { X: number; Y: number; Z: number };
}

const CameraController: React.FC<CameraControllerProps> = ({ containerSize }) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>(null);
  
  // Store the initial setup status
  const initializedRef = useRef(false);
  
  useEffect(() => {
    if (controlsRef.current && !initializedRef.current) {
      // Only initialize camera position once
      cameraManager.registerControls(controlsRef.current);
      initializedRef.current = true;
    }
  }, []);
  
  // Only update camera target when container size changes significantly
  useEffect(() => {
    if (controlsRef.current && initializedRef.current) {
      // Use container size to set target, but don't reset camera position
      const target = [
        containerSize.X / 2,
        containerSize.Y / 2,
        containerSize.Z / 2
      ];
      
      controlsRef.current.target.set(...target);
      controlsRef.current.update();
    }
  }, [containerSize.X, containerSize.Y, containerSize.Z]);
  
  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping={true}
      dampingFactor={0.05}
      rotateSpeed={0.5}
      makeDefault
    />
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(CameraController);