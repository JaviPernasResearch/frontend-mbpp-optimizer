import React, { createContext, useContext, useState } from 'react';
import { Object3D } from 'three';

interface CameraContextType {
  applyPreset: (preset: 'isometric' | 'top' | 'side' | 'front') => void;
  fitToObject: (object: Object3D) => void;
}

const defaultContext: CameraContextType = {
  applyPreset: () => {},
  fitToObject: () => {},
};

const CameraContext = createContext<CameraContextType>(defaultContext);

export const CameraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cameraActions, setCameraActions] = useState<{
    applyPreset?: (preset: 'isometric' | 'top' | 'side' | 'front') => void;
    fitToObject?: (object: Object3D) => void;
  }>({});

  const value = {
    applyPreset: (preset: 'isometric' | 'top' | 'side' | 'front') => {
      if (cameraActions.applyPreset) {
        cameraActions.applyPreset(preset);
      }
    },
    fitToObject: (object: Object3D) => {
      if (cameraActions.fitToObject) {
        cameraActions.fitToObject(object);
      }
    },
    setCameraActions,
  };

  return <CameraContext.Provider value={value}>{children}</CameraContext.Provider>;
};

export const useCamera = () => useContext(CameraContext);