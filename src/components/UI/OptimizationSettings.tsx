import React from 'react';
import { useOptimizationSettings } from '../../hooks/useOptimizationSettings';
import { OptimizationSettings } from '@/types/optimization';

const OptimizationSettings: React.FC = () => {

  const { settings, setSettings } = useOptimizationSettings();

  // Handle approach change
  const handleApproachChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings({ 
      ...settings, 
      optimizationApproach: event.target.value as 'constraint-programming' | 'reinforcement-learning'
    });
  };

  // Handle goal toggle
  const handleGoalToggle = (goal: keyof Omit<OptimizationSettings, 'optimizationApproach'>) => {
    setSettings({ ...settings, [goal]: !settings[goal] });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3 mb-4">
        <h3 className="font-medium text-sm mb-2">Optimization Goals</h3>
        
        <div className="flex items-center">
          <input
            id="groupOrders"
            type="checkbox"
            checked={settings.groupSameOrderComponents}
            onChange={() => handleGoalToggle('groupSameOrderComponents')}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="groupOrders" className="ml-2 block text-sm text-gray-700">
            Group components from the same order
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            id="groupMaterials"
            type="checkbox"
            checked={settings.groupSameMaterialComponents}
            onChange={() => handleGoalToggle('groupSameMaterialComponents')}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="groupMaterials" className="ml-2 block text-sm text-gray-700">
            Group components of the same material
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            id="minimizeWaste"
            type="checkbox"
            checked={settings.minimizeSpaceWaste}
            onChange={() => handleGoalToggle('minimizeSpaceWaste')}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="minimizeWaste" className="ml-2 block text-sm text-gray-700">
            Minimize space waste
          </label>
        </div>
      </div>
      
      <div className="pt-3 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-1">Solver Approach</label>
        <select
          value={settings.optimizationApproach}
          onChange={handleApproachChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="constraint-programming">Constraint Programming</option>
          <option value="reinforcement-learning">Reinforcement Learning</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">
          {settings.optimizationApproach === 'constraint-programming' 
            ? 'Uses mathematical constraints to find optimal solutions. More predictable but may be slower for complex problems.'
            : 'Uses AI to learn optimal packing strategies. May find novel solutions but training can take longer.'
          }
        </p>
      </div>
    </div>
  );
};

export default OptimizationSettings;