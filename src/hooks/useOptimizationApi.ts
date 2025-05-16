import { useState } from 'react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { useAtom } from 'jotai';
import { binDataState } from '@/states/binDataState';
import { IMOSBin } from '@/types/BinTypes';

// Updated interfaces to match the backend schemas
interface Vector3 {
  X: number;
  Y: number;
  Z: number;
}

interface Slot {
  guid: string;
  index: number;
  global_index: number;
  origin: Vector3;
  size: Vector3;
}

interface Module {
  guid: string;
  index: number;
  module_type: 'LARGE_SLOTS' | 'UNDEFINED';
  slots: Slot[];
  origin: Vector3;
  size: Vector3;
  area: number;
}

interface Bin {
  guid: string;
  id: number;
  modules: Module[];
  size: Vector3;
  area: number;
}

interface Part {
  guid: string;
  size: Vector3;
  material: 'P2_MFB_19' | 'P2_MFB_9' | 'UNDEFINED' | string;
  part_type: 'SIDEWALL' | 'UNDEFINED' | string;
  position_nr: string;
  assembly_id: number;
}

interface OptimizationObjective {
  objective_type: 'WASTED_SPACE' | 'ASSEMBLY_BLOCK_WIDTH' | 'MATERIAL_BLOCK_WIDTH' | string;
  weight: number;
  is_enabled: boolean;
}

interface OptimizationRequest {
  bins: Bin[];
  parts: Part[];
  objectives: OptimizationObjective[];
  timeout_seconds: number;
}

interface PackedPart {
  part_id: number;
  bin_id: number;
  slot_id: number;
  alignment: number;
  assembly_id: number;
  material_type: string;
  part_type: string;
}

interface OptimizationSolution {
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

export function useOptimizationApi() {
  const [binData] = useAtom(binDataState);
  const [solution, setSolution] = useState<OptimizationSolution | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  const createBinFromJsonData = (jsonBin: IMOSBin, containerCount: number): Bin[] => {
    return Array(containerCount).fill(null).map((_, index) => {
      // Convert from IMOS format to API format
      return {
        guid: index === 0 ? jsonBin.Guid : uuidv4(),
        id: index,
        modules: jsonBin.Modules.$values.map(m => ({
          guid: m.Guid,
          index: m.Index,
          module_type: m.ModuleType === 1 ? 'LARGE_SLOTS' : 'UNDEFINED',
          slots: m.Slots.$values.map(s => ({
            guid: s.Guid,
            index: s.Index,
            global_index: s.GlobalIndex,
            origin: {
              X: s.Origin.X,
              Y: s.Origin.Y,
              Z: s.Origin.Z
            },
            size: {
              X: s.Size.X,
              Y: s.Size.Y,
              Z: s.Size.Z
            }
          })),
          origin: {
            X: m.Origin.X,
            Y: m.Origin.Y,
            Z: m.Origin.Z
          },
          size: {
            X: m.Size.X,
            Y: m.Size.Y,
            Z: m.Size.Z
          },
          area: m.Area
        })),
        size: {
          X: jsonBin.Size.X,
          Y: jsonBin.Size.Y,
          Z: jsonBin.Size.Z
        },
        area: jsonBin.Area
      };
    });
  };
  
  // Create sample parts for demonstration
  const createSampleParts = (): Part[] => {
    return [
      {
        guid: uuidv4(),
        size: { X: 22.0, Y: 750.0, Z: 600.0 },
        material: "P2_MFB_19",
        part_type: "SIDEWALL",
        position_nr: "P1",
        assembly_id: 101
      },
      {
        guid: uuidv4(),
        size: { X: 22.0, Y: 800.0, Z: 600.0 },
        material: "P2_MFB_19",
        part_type: "SIDEWALL",
        position_nr: "P2",
        assembly_id: 101
      },
      {
        guid: uuidv4(),
        size: { X: 22.0, Y: 600.0, Z: 450.0 },
        material: "P2_MFB_9",
        part_type: "MITTELBODEN",
        position_nr: "P3",
        assembly_id: 102
      },
      {
        guid: uuidv4(),
        size: { X: 15.0, Y: 550.0, Z: 500.0 },
        material: "MPX_ROH_15",
        part_type: "EINLEGEBODEN",
        position_nr: "P4",
        assembly_id: 102
      }
    ];
  };

  const runOptimization = async (
    containerCount: number,
    settings: OptimizationSettings
  ) => {
    // Check if any container model is available
    if (!binData) {
      toast.error('Please upload a container JSON file first');
      return null;
    }
    
    setIsOptimizing(true);
    
    try {
      // Create the bins from JSON data
      const bins = createBinFromJsonData(binData, containerCount);
      
      // Create sample parts
      const parts = createSampleParts();
      
      // Build objectives based on settings
      const objectives: OptimizationObjective[] = [];
      
      if (settings.minimizeSpaceWaste) {
        objectives.push({ 
          objective_type: "WASTED_SPACE", 
          weight: 5.0, 
          is_enabled: true
        });
      }
      
      if (settings.groupSameOrderComponents) {
        objectives.push({ 
          objective_type: "ASSEMBLY_BLOCK_WIDTH", 
          weight: 3.0, 
          is_enabled: true
        });
      }
      
      if (settings.groupSameMaterialComponents) {
        objectives.push({ 
          objective_type: "MATERIAL_BLOCK_WIDTH", 
          weight: 2.0, 
          is_enabled: true
        });
      }
      
      const requestBody: OptimizationRequest = {
        bins,
        parts,
        objectives,
        timeout_seconds: 60
      };
      
      // Make API call
      toast.info('Starting optimization...');
      console.log("Sending optimization request:", requestBody);
      
      const response = await fetch('http://localhost:8000/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Optimization result:", data);
      setSolution(data);
      toast.success('Optimization completed successfully!');
      
      return data;
    } catch (err: any) {
      // If the server is not running, return a mock solution
      console.error('Error calling optimization API:', err);
      toast.warning('Using fallback solution (server not available)');
      
      const mockSolution: OptimizationSolution = {
        status: "optimal",
        objective_value: 24.5,
        packed_parts: [
          {
            part_id: 1,
            bin_id: 0,
            slot_id: 0,
            alignment: 0,
            assembly_id: 101,
            material_type: "P2_MFB_19",
            part_type: "SIDEWALL"
          },
          {
            part_id: 2,
            bin_id: 0,
            slot_id: 0,
            alignment: 0,
            assembly_id: 101,
            material_type: "P2_MFB_19",
            part_type: "SIDEWALL"
          },
          {
            part_id: 3,
            bin_id: 0,
            slot_id: 1,
            alignment: 0,
            assembly_id: 102,
            material_type: "P2_MFB_9",
            part_type: "MITTELBODEN" 
          },
          {
            part_id: 4,
            bin_id: 0, 
            slot_id: 1,
            alignment: 1,
            assembly_id: 102,
            material_type: "MPX_ROH_15",
            part_type: "EINLEGEBODEN"
          }
        ],
        bins_used: [0],
        error: null,
        solve_time_seconds: 0.45
      };
      
      setSolution(mockSolution);
      return mockSolution;
    } finally {
      setIsOptimizing(false);
    }
  };

  return {
    solution,
    isOptimizing,
    runOptimization
  };
}