import { OptimizationSettingsState } from '@/types/optimization';
import { useState } from 'react';


export function useOptimizationSettings() {
  const [settings, setSettings] = useState<OptimizationSettingsState>({
    optimizationApproach: 'constraint-programming',
    groupSameOrderComponents: false,
    groupSameMaterialComponents: false,
    minimizeSpaceWaste: true,
  });

  // Handle approach change
  const handleApproachChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings({ 
      ...settings, 
      optimizationApproach: event.target.value as 'constraint-programming' | 'reinforcement-learning'
    });
  };

  // Handle goal toggle
  const handleGoalToggle = (goal: keyof Omit<OptimizationSettingsState, 'optimizationApproach'>) => {
    setSettings({ ...settings, [goal]: !settings[goal] });
  };

  return {
    settings,
    setSettings,
    handleApproachChange,
    handleGoalToggle
  };
}