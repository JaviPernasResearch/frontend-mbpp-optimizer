import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { cameraManager } from '@/utils/cameraManager';
import { useCamera } from '@/context/CameraContext';
import { Object3D } from 'three';

interface CameraControllerProps {
  containerSize: { X: number; Y: number; Z: number };
}

const CameraController: React.FC<CameraControllerProps> = ({ containerSize }) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>(null);
  const cameraContext = useCamera() as any; // Access the context with setCameraActions
  
  // Store the initial setup status
  const initializedRef = useRef(false);
  
  useEffect(() => {
    // This registers the camera with the camera manager
    if (camera) {
      cameraManager.setCamera(camera);
    }
    
    if (controlsRef.current) {
      cameraManager.registerControls(controlsRef.current);

      // Make the camera actions available through context
      cameraContext.setCameraActions({
        applyPreset: (preset: 'isometric' | 'top' | 'side' | 'front') => {
          const presets = cameraManager.getPresets();
          if (presets[preset]) {
            presets[preset]();
          }
        },
        fitToObject: (object: Object3D) => {
          cameraManager.fitCameraToObject(object);
        }
      });

      initializedRef.current = true;
    }
    
    // Cleanup function
    return () => {
      cameraManager.setCamera(null);
      cameraManager.registerControls(null);
    };
  }, [camera, cameraContext]);
  
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