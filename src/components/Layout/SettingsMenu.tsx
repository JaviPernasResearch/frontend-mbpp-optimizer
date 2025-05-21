'use client';

import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FoldablePanel from '../UI/FoldablePanel';
import BinConfig from '../UI/BinConfigPanel';
import OptimizationSettings from '../UI/OptimizationSettingsMenu';
import OptimizationButton from '../UI/OptimizationButton';
import { useBinConfig } from '../../hooks/useBinConfig';
import { useOptimizationSettings } from '@/hooks/useOptimizationSettings';
import { useOptimizationApi } from '@/hooks/useOptimizationApi';

const SettingsMenu = () => {
  const { 
    isBinConfigOpen, 
    isOptimizationSettingsOpen, 
    binData,
    partsData,
    toggleBinConfig, 
    toggleOptimizationSettings,
  } = useBinConfig();
  
  // Access optimization settings from a context or state
  const { settings } = useOptimizationSettings();
  const { isOptimizing, runOptimization, solution } = useOptimizationApi();
  
  // Check if container/parts model is loaded
  const hasContainerModel = !!binData;
  const hasPartsModel = !!partsData;
  
  // Check if optimization settings are configured
  const areSettingsConfigured = settings.minimizeSpaceWaste || 
                              settings.groupSameMaterialComponents || 
                              settings.groupSameOrderComponents;
  
  // Enable optimization button if both container model is loaded and settings are configured
  const isOptimizationEnabled = hasContainerModel && hasPartsModel && areSettingsConfigured;
  
  // Handle optimization button click
  const handleOptimize = async () => {
    if (!hasContainerModel) {
      toast.error('Please upload a container JSON file first');
      return;
    }

    if (!hasPartsModel) {
      toast.error('Please upload a parts JSON file first');
      return;
    }
    
    if (!areSettingsConfigured) {
      toast.error('Please select at least one optimization goal');
      return;
    }
    
    try {
      // Run the optimization with bin data
      await runOptimization(settings);
    } catch (error) {
      console.error('Optimization error:', error);
      toast.error('Failed to optimize: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };
  
  return (
    <div className="w-80 bg-white h-full flex flex-col shadow-md">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-lg font-medium">Container Optimizer</h1>
        <p className="text-sm text-gray-500">Configure and optimize container packing</p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {/* Container Configuration */}
        <FoldablePanel 
          title="Container Configuration" 
          isOpen={isBinConfigOpen}
          onToggle={toggleBinConfig}
        >
          <BinConfig />
        </FoldablePanel>
        
        {/* Optimization Settings */}
        <FoldablePanel 
          title="Optimization Settings" 
          isOpen={isOptimizationSettingsOpen}
          onToggle={toggleOptimizationSettings}
        >
          <OptimizationSettings />
        </FoldablePanel>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <OptimizationButton 
          onOptimize={handleOptimize}
          isEnabled={isOptimizationEnabled}
          isOptimizing={isOptimizing}
        />
        
        <p className="text-xs text-center text-gray-500 mt-2">
          {!hasContainerModel && "Upload a container JSON file first"}
          {!hasPartsModel && "Upload a parts JSON file first"}
          {hasContainerModel && hasPartsModel && !areSettingsConfigured && "Select at least one optimization goal"}
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
}
;
export default SettingsMenu;