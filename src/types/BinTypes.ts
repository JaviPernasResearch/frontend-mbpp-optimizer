// Common interface for Vector3
export interface Vector3 {
  X: number;
  Y: number;
  Z: number;
}

// Backend enum values for material types
export type MaterialType = 'UNDEFINED' | 'P2_MFB_19' | 'P2_MFB_9' | 'P2_MFB__8' | 'MPX_ROH_15' | 'MDF';

// Backend enum values for part types
export type PartType = 'UNDEFINED' | 'BLIND' | 'SIDEWALL' | 'KORPUSSEITE_RECHTS' | 
                      'KORPUSSEITE_LINKS' | 'UNTERBODEN_EINSCHL' | 'OBERBODEN_DURCHG' | 
                      'MITTELSEITE' | 'RUECKWAND_EINGENUTET' | 'SK_SEITE_VORNE' | 
                      'SK_SEITE_RECHTS' | 'SK_SEITE_HINTEN' | 'SK_SEITE_LINKS' | 
                      'SK_BODEN' | 'MITTELBODEN' | 'EINLEGEBODEN';

// Backend enum values for module types
export type ModuleType = 'UNDEFINED' | 'LARGE_SLOTS';

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
  module_type: ModuleType;
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
  material: MaterialType;
  part_type: PartType;
  position_nr: string;
  assembly_id: number;
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