import { useCallback } from 'react';
import { Object3D } from 'three';
import { useCamera } from '@/context/CameraContext';

interface CameraControlsProps {
  containerRef: React.RefObject<Object3D>;
}

const CameraControls: React.FC<CameraControlsProps> = ({ containerRef }) => {
  const { applyPreset, fitToObject } = useCamera();
  
  // Camera preset handlers
  const handleCameraPreset = useCallback((preset: 'isometric' | 'top' | 'side' | 'front') => {
    applyPreset(preset);
  }, [applyPreset]);
  
  const handleFitToContainer = useCallback(() => {
    if (containerRef.current) {
      fitToObject(containerRef.current);
    }
  }, [containerRef, fitToObject]);

  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
      <div className="bg-white bg-opacity-80 p-3 rounded shadow-md">
        <h3 className="text-sm font-bold mb-2">Camera Views</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleCameraPreset('isometric')}
            className="bg-blue-500 text-white text-xs py-1 px-2 rounded"
          >
            Isometric
          </button>
          <button
            onClick={() => handleCameraPreset('top')}
            className="bg-blue-500 text-white text-xs py-1 px-2 rounded"
          >
            Top
          </button>
          <button
            onClick={() => handleCameraPreset('side')}
            className="bg-blue-500 text-white text-xs py-1 px-2 rounded"
          >
            Side
          </button>
          <button
            onClick={() => handleCameraPreset('front')}
            className="bg-blue-500 text-white text-xs py-1 px-2 rounded"
          >
            Front
          </button>
          <button
            onClick={handleFitToContainer}
            className="bg-green-500 text-white text-xs py-1 px-2 rounded col-span-2"
          >
            Fit to Container
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraControls;