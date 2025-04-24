'use client';

import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FoldablePanel from '../UI/FoldablePanel';
import ContainerConfig from '../UI/ContainerConfig';
import OptimizationSettings from '../UI/OptimizationSettings';
import OptimizationButton from '../UI/OptimizationButton';
import { useContainerConfig } from '../../hooks/useContainerConfig';
import { useOptimizationSettings } from '@/hooks/useOptimizationSettings';
import { useOptimizationApi } from '@/hooks/useOptimizationApi';

const SettingsMenu = () => {
  const { 
    isContainerConfigOpen, 
    isOptimizationSettingsOpen, 
    toggleContainerConfig, 
    toggleOptimizationSettings,
    stlData, // Get the STL data to check if loaded
    containerCount
  } = useContainerConfig();
  
  // Access optimization settings from a context or state
  const { settings } = useOptimizationSettings();
  const { isOptimizing, runOptimization, solution } = useOptimizationApi();
  
  // Check if settings are properly configured
  const areSettingsConfigured = Boolean(
    // At least one optimization goal must be selected
    (settings?.groupSameOrderComponents || 
     settings?.groupSameMaterialComponents || 
     settings?.minimizeSpaceWaste)
  );
  
  // Button is enabled only when STL is loaded AND settings are configured
  const isOptimizationEnabled = Boolean(stlData) && areSettingsConfigured;

  const handleOptimize = async () => {
    if (!isOptimizationEnabled) {
      if (!stlData) {
        toast.warning('Please upload an STL file first');
      } else if (!areSettingsConfigured) {
        toast.warning('Select at least one optimization goal');
      }
      return;
    }
    
    // The actual API call
    const result = await runOptimization(stlData, containerCount, settings);
    console.log('Optimization result:', result);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800">Settings Panel</h2>
        <p className="text-sm text-gray-600 mt-1">Optimization Parameters</p>
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
        <OptimizationButton 
          onOptimize={handleOptimize}
          isEnabled={isOptimizationEnabled}
          isOptimizing={isOptimizing}
        />
        <p className="text-xs text-center text-gray-500 mt-2">
          {!stlData && "Upload a container model first"}
          {stlData && !areSettingsConfigured && "Select at least one optimization goal"}
          {isOptimizationEnabled && !isOptimizing && "Ready to optimize"}
          {isOptimizing && "Optimization in progress..."}
        </p>
        
        {/* Display optimization results if available */}
        {solution && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-medium text-base mb-1">Optimization Results</h3>
            <p className="text-sm">Status: {solution.status}</p>
            <p className="text-sm">Score: {solution.objective_value.toFixed(2)}</p>
            <p className="text-sm mt-2">Parts placed: {solution.packed_parts.length}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsMenu;