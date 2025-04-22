export interface Settings {
  theme: 'light' | 'dark';
  containerDimensions: {
    width: number;
    height: number;
    depth: number;
  };
  optimizationLevel: 'low' | 'medium' | 'high';
  enableNotifications: boolean;
}

export interface ContainerConfig {
  material: string;
  color: string;
  texture: string;
}

export interface OptimizationSettings {
  algorithm: string;
  iterations: number;
  tolerance: number;
}