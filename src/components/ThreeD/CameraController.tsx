import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { cameraManager } from '@/utils/cameraManager';
import { Vector3 } from 'three';

interface CameraControllerProps {
  containerSize?: {
    X: number;
    Y: number;
    Z: number;
  };
}

const CameraController: React.FC<CameraControllerProps> = ({ containerSize }) => {
  const { camera } = useThree();  // This is safe because we're inside the Canvas
  const controlsRef = useRef<any>(null);
  
  // Register the camera when component mounts
  useEffect(() => {
    if (camera) {
      cameraManager.setCamera(camera);
    }
  }, [camera]);
  
  // Set initial camera position when component mounts
  useEffect(() => {
    // Small delay to ensure camera and controls are registered
    const timer = setTimeout(() => {
      cameraManager.getPresets().isometric();
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Update target based on container size
  useEffect(() => {
    if (containerSize && controlsRef.current) {
      const targetX = containerSize.X / 2 || 500;
      const targetY = containerSize.Y / 2 || 0;
      const targetZ = containerSize.Z / 2 || 500;
      
      controlsRef.current.target.set(targetX, targetY, targetZ);
      controlsRef.current.update();
    }
  }, [containerSize]);
  
  return (
    <OrbitControls 
      ref={(controls) => {
        if (controls) {
          controlsRef.current = controls;
          cameraManager.registerControls(controls);
        }
      }}
      makeDefault
      target={new Vector3(500, 0, 500)} // Initial target
      maxDistance={10000}
      minDistance={200}
      maxPolarAngle={Math.PI / 2 - 0.1}
      enableDamping={true}
      dampingFactor={0.1}
    />
  );
};

export default CameraController;