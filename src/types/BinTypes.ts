// Common interface for Vector3
export interface Vector3 {
  X: number;
  Y: number;
  Z: number;
}

// API format interfaces (single source of truth)
export interface Slot {
  guid: string;
  index: number;
  global_index: number;
  origin: Vector3;
  size: Vector3;
}

export interface Module {
  guid: string;
  index: number;
  module_type: 'LARGE_SLOTS' | 'UNDEFINED';
  slots: Slot[];
  origin: Vector3;
  size: Vector3;
  area: number;
}

export interface Bin {
  guid: string;
  id: number;
  modules: Module[];
  size: Vector3;
  area: number;
}

export interface Part {
  guid: string;
  size: Vector3;
  material: 'P2_MFB_19' | 'P2_MFB_9' | 'MPX_ROH_15' | 'MDF' | 'UNDEFINED' | string;
  part_type: 'SIDEWALL' | 'MITTELBODEN' | 'EINLEGEBODEN' | 'UNDEFINED' | string;
  position_nr: string;
  assembly_id: number;
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

export interface PackedPart {
  part_id: number;
  bin_id: number;
  slot_id: number;
  alignment: number;
  assembly_id: number;
  material_type: string;
  part_type: string;
}