import { Bin, PackedPart, Part } from "./types";

export interface OptimizationSolution {
  status: string;
  objective_value: number;
  packed_parts: PackedPart[];
  bins_used: number[];
  error: string | null;
  visualization_urls?: Record<string, string>;
  solve_time_seconds?: number;
}

export interface OptimizationSettings {
  optimizationApproach: 'constraint-programming' | 'reinforcement-learning';
  groupSameOrderComponents: boolean;
  groupSameMaterialComponents: boolean;
  minimizeSpaceWaste: boolean;
}


export interface OptimizationObjective {
  objective_type: 'WASTED_SPACE' | 'ASSEMBLY_BLOCK_WIDTH' | 'MATERIAL_BLOCK_WIDTH' | string;
  weight: number;
  is_enabled: boolean;
}

export interface OptimizationRequest {
  bins: Bin[];
  parts: Part[];
  objectives: OptimizationObjective[];
  timeout_seconds: number;
}