export interface OptimizationSettingsState {
  optimizationApproach: 'constraint-programming' | 'reinforcement-learning';
  groupSameOrderComponents: boolean;
  groupSameMaterialComponents: boolean;
  minimizeSpaceWaste: boolean;
}

// export interface OptimizationResult {
//   success: boolean;
//   message: string;
//   optimizedValue: number;
// }

// export interface OptimizationState {
//   settings: OptimizationSettings;
//   result: OptimizationResult | null;
//   isLoading: boolean;
//   error: string | null;
// }