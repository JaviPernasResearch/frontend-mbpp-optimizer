// Common interface for Vector3 used in both IMOS and API schemas
export interface Vector3 {
  X: number;
  Y: number;
  Z: number;
}

// IMOS format interfaces (for JSON loading)
export interface IMOSSlot {
  Guid: string;
  Index: number;
  GlobalIndex: number;
  Origin: Vector3;
  Size: Vector3;
  Area?: number;
}

export interface IMOSModule {
  Guid: string;
  Index: number;
  ModuleType: number;
  Slots: {
    $type: string;
    $values: IMOSSlot[];
  };
  Origin: Vector3;
  Size: Vector3;
  Area: number;
}

export interface IMOSBin {
  Guid: string;
  Id: number;
  Modules: {
    $type: string;
    $values: IMOSModule[];
  };
  Size: Vector3;
  Area: number;
}

// API format interfaces (for optimization API)
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

// Helper function to convert from IMOS format to API format
export const convertIMOSToAPIBin = (imosBin: IMOSBin, containerId: number): Bin => {
  return {
    guid: containerId === 0 ? imosBin.Guid : crypto.randomUUID(),
    id: containerId,
    modules: imosBin.Modules.$values.map(m => ({
      guid: m.Guid,
      index: m.Index,
      module_type: m.ModuleType === 1 ? 'LARGE_SLOTS' : 'UNDEFINED',
      slots: m.Slots.$values.map(s => ({
        guid: s.Guid,
        index: s.Index,
        global_index: s.GlobalIndex,
        origin: s.Origin,
        size: s.Size
      })),
      origin: m.Origin,
      size: m.Size,
      area: m.Area
    })),
    size: imosBin.Size,
    area: imosBin.Area
  };
};