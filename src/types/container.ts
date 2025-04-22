export interface ContainerConfig {
  length: number;
  width: number;
  height: number;
  material: string;
}

export interface OptimizationSettings {
  optimizeForWeight: boolean;
  optimizeForCost: boolean;
  maxWeight: number;
  maxCost: number;
}

export interface ContainerState {
  config: ContainerConfig;
  optimization: OptimizationSettings;
}