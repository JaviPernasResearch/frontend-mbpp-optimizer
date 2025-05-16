import { PackedPart } from "./BinTypes";

export interface OptimizationSolutionState {
  status: string;
  objective_value: number;
  packed_parts: PackedPart[];
  bins_used: number[];
  error: string | null;
  visualization_urls?: Record<string, string>;
  solve_time_seconds?: number;
}

export interface OptimizationSettingsState {
  optimizationApproach: 'constraint-programming' | 'reinforcement-learning';
  groupSameOrderComponents: boolean;
  groupSameMaterialComponents: boolean;
  minimizeSpaceWaste: boolean;
}
// export interface OptimizationState {
//   settings: OptimizationSettings;
//   result: OptimizationResult | null;
//   isLoading: boolean;
//   error: string | null;
// }