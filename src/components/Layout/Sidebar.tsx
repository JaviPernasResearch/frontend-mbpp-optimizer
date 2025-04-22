'use client';

import React, { useState } from 'react';
import FoldablePanel from '../UI/FoldablePanel';
import ContainerConfig from '../UI/ContainerConfig';
import OptimizationSettings from '../UI/OptimizationSettings';
import OptimizationButton from '../UI/OptimizationButton';

const Sidebar = () => {
  const [isContainerConfigOpen, setContainerConfigOpen] = useState(false);
  const [isOptimizationSettingsOpen, setOptimizationSettingsOpen] = useState(false);

  const toggleContainerConfig = () => {
    setContainerConfigOpen(!isContainerConfigOpen);
  };

  const toggleOptimizationSettings = () => {
    setOptimizationSettingsOpen(!isOptimizationSettingsOpen);
  };

  return (
    <aside className="w-64 bg-gray-100 p-4 shadow-md">
      <h2 className="text-lg font-semibold mb-4">Settings</h2>
      <FoldablePanel title="Container Configuration" isOpen={isContainerConfigOpen} onToggle={toggleContainerConfig}>
        <ContainerConfig />
      </FoldablePanel>
      <FoldablePanel title="Optimization Settings" isOpen={isOptimizationSettingsOpen} onToggle={toggleOptimizationSettings}>
        <OptimizationSettings />
      </FoldablePanel>
      <OptimizationButton onOptimize={() => {}} />
    </aside>
  );
};

export default Sidebar;