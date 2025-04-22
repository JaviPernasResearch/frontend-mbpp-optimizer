import React, { useState } from 'react';
import FoldablePanel from './FoldablePanel';

const ContainerConfig = () => {
  const [isContainerConfigOpen, setContainerConfigOpen] = useState(false);
  const [isOptimizationSettingsOpen, setOptimizationSettingsOpen] = useState(false);

  const toggleContainerConfig = () => {
    setContainerConfigOpen(!isContainerConfigOpen);
  };

  const toggleOptimizationSettings = () => {
    setOptimizationSettingsOpen(!isOptimizationSettingsOpen);
  };

  return (
    <div className="p-4">
      <FoldablePanel title="Container Configuration" isOpen={isContainerConfigOpen} onToggle={toggleContainerConfig}>
        {/* Add container configuration inputs here */}
        <div>
          <label htmlFor="containerWidth">Width:</label>
          <input type="number" id="containerWidth" className="border rounded p-1" />
        </div>
        <div>
          <label htmlFor="containerHeight">Height:</label>
          <input type="number" id="containerHeight" className="border rounded p-1" />
        </div>
      </FoldablePanel>

      <FoldablePanel title="Optimization Settings" isOpen={isOptimizationSettingsOpen} onToggle={toggleOptimizationSettings}>
        {/* Add optimization settings inputs here */}
        <div>
          <label htmlFor="optimizationLevel">Optimization Level:</label>
          <input type="number" id="optimizationLevel" className="border rounded p-1" />
        </div>
      </FoldablePanel>

      <div className="mt-4">
        <button className="bg-blue-500 text-white rounded p-2">
          Optimize
        </button>
      </div>
    </div>
  );
};

export default ContainerConfig;