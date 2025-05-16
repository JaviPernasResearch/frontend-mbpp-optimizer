export interface Vector3 {
  X: number;
  Y: number;
  Z: number;
}

export interface Slot {
  Guid: string;
  Index: number;
  GlobalIndex: number;
  Origin: Vector3;
  Size: Vector3;
  Area?: number;
}

export interface Module {
  Guid: string;
  Index: number;
  ModuleType: number;
  Slots: {
    $type: string;
    $values: Slot[];
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
    $values: Module[];
  };
  Size: Vector3;
  Area: number;
}