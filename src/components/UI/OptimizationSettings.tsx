import React, { useState } from 'react';
import FoldablePanel from './FoldablePanel';

interface OptimizationSettingsState {
  optimizationLevel: 'low' | 'medium' | 'high';
  enableFeatureX: boolean;
  enableFeatureY: boolean;
}

const OptimizationSettings: React.FC = () => {
  const [settings, setSettings] = useState<OptimizationSettingsState>({
    optimizationLevel: 'medium',
    enableFeatureX: false,
    enableFeatureY: false,
  });

  // Properly type the event parameter
  const handleOptimizationLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings({ 
      ...settings, 
      optimizationLevel: event.target.value as 'low' | 'medium' | 'high' 
    });
  };

  // Type the feature parameter
  const handleFeatureToggle = (feature: keyof Pick<OptimizationSettingsState, 'enableFeatureX' | 'enableFeatureY'>) => {
    setSettings({ ...settings, [feature]: !settings[feature] });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700">Optimization Level</label>
        <select
          value={settings.optimizationLevel}
          onChange={handleOptimizationLevelChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      
      <div className="flex items-center">
        <input
          id="featureX"
          type="checkbox"
          checked={settings.enableFeatureX}
          onChange={() => handleFeatureToggle('enableFeatureX')}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label htmlFor="featureX" className="ml-2 block text-sm text-gray-700">
          Enable Feature X
        </label>
      </div>
      
      <div className="flex items-center">
        <input
          id="featureY"
          type="checkbox"
          checked={settings.enableFeatureY}
          onChange={() => handleFeatureToggle('enableFeatureY')}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label htmlFor="featureY" className="ml-2 block text-sm text-gray-700">
          Enable Feature Y
        </label>
      </div>
    </div>
  );
};

export default OptimizationSettings;