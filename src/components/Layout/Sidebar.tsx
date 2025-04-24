'use client';

import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FoldablePanel from '../UI/FoldablePanel';
import ContainerConfig from '../UI/ContainerConfig';
import OptimizationSettings from '../UI/OptimizationSettings';
import OptimizationButton from '../UI/OptimizationButton';
import { useSidebar } from '../../hooks/useSidebar';

const Sidebar = () => {
  const { 
    isContainerConfigOpen, 
    isOptimizationSettingsOpen, 
    toggleContainerConfig, 
    toggleOptimizationSettings 
  } = useSidebar();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800">Settings Panel</h2>
        <p className="text-2sm text-gray-600 mt-1">Optimization Parameters</p>
      </div>
      
      {/* Settings sub-panels */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <FoldablePanel 
          title="Container Configuration" 
          isOpen={isContainerConfigOpen} 
          onToggle={toggleContainerConfig}
        >
          <ContainerConfig />
        </FoldablePanel>
        
        <FoldablePanel 
          title="Optimization Settings" 
          isOpen={isOptimizationSettingsOpen} 
          onToggle={toggleOptimizationSettings}
        >
          <OptimizationSettings />
        </FoldablePanel>
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <OptimizationButton onOptimize={() => toast('Optimization started!')} />
        <p className="text-xs text-center text-gray-500 mt-2">
          Configure settings above before optimizing
        </p>
      </div>
    </div>
  );
};

export default Sidebar;