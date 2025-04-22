export interface OptimizationSettings {
  algorithm: string;
  iterations: number;
  tolerance: number;
}

export interface OptimizationResult {
  success: boolean;
  message: string;
  optimizedValue: number;
}

export interface OptimizationState {
  settings: OptimizationSettings;
  result: OptimizationResult | null;
  isLoading: boolean;
  error: string | null;
}