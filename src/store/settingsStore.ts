import { create } from 'zustand';

interface SettingsState {
  containerConfig: {
    length: number;
    width: number;
    height: number;
  };
  optimizationSettings: {
    enableOptimization: boolean;
    optimizationLevel: number;
  };
  setContainerConfig: (config: { length: number; width: number; height: number }) => void;
  setOptimizationSettings: (settings: { enableOptimization: boolean; optimizationLevel: number }) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  containerConfig: {
    length: 100,
    width: 50,
    height: 30,
  },
  optimizationSettings: {
    enableOptimization: false,
    optimizationLevel: 1,
  },
  setContainerConfig: (config) => set({ containerConfig: config }),
  setOptimizationSettings: (settings) => set({ optimizationSettings: settings }),
}));