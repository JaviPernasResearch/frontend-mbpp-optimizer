import { useState } from 'react';
import { toast } from 'react-toastify';

interface Bin {
  id: number;
  slots: Array<{
    id: number;
    width: number;
    height: number;
    bin_id: number;
    global_index: number;
    origin_x: number;
    origin_y: number;
  }>;
  origin_x: number;
  origin_y: number;
}

interface Part {
  id: number;
  width: number;
  height: number;
  assembly_index: number;
  assembly_id: number;
  material_type: string;
}

interface OptimizationObjective {
  objective_type: number; // 0 = WASTED_SPACE, 1 = SAME_ASSEMBLY_PROXIMITY, etc.
  weight: number;
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
}

interface OptimizationSolution {
  status: string;
  objective_value: number;
  packed_parts: PackedPart[];
}

export function useOptimizationApi() {
  const [solution, setSolution] = useState<OptimizationSolution | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  const runOptimization = async (
    stlData: ArrayBuffer | null,
    containerCount: number,
    settings: any
  ) => {
    if (!stlData) {
      toast.error('Please upload an STL file first');
      return;
    }
    
    setIsOptimizing(true);
    
    try {
      // For now, we'll use hardcoded sample data
      // In a real implementation, you would derive this from the stlData
      const binData: Bin[] = Array(containerCount).fill(null).map((_, index) => ({
        id: index + 1,
        slots: [
          { id: 1, width: 25.0, height: 25.0, bin_id: index + 1, global_index: index * 2, origin_x: 0.0, origin_y: 0.0 },
          { id: 2, width: 25.0, height: 25.0, bin_id: index + 1, global_index: index * 2 + 1, origin_x: 25.0, origin_y: 0.0 }
        ],
        origin_x: 0.0,
        origin_y: 0.0
      }));
      
      const partData: Part[] = [
        { id: 1, width: 20.0, height: 20.0, assembly_index: 0, assembly_id: 101, material_type: "wood" },
        { id: 2, width: 22.0, height: 18.0, assembly_index: 1, assembly_id: 101, material_type: "wood" },
        { id: 3, width: 15.0, height: 25.0, assembly_index: 0, assembly_id: 102, material_type: "metal" },
      ];
      
      // Build objectives based on settings
      const objectives: OptimizationObjective[] = [];
      
      if (settings.minimizeSpaceWaste) {
        objectives.push({ objective_type: 0, weight: 5.0 }); // WASTED_SPACE
      }
      
      if (settings.groupSameOrderComponents) {
        objectives.push({ objective_type: 3, weight: 3.0 }); // ASSEMBLY_BLOCK_WIDTH  
      }
      
      if (settings.groupSameMaterialComponents) {
        objectives.push({ objective_type: 2, weight: 2.0 }); // MATERIAL_GROUPING
      }
      
      const requestBody: OptimizationRequest = {
        bins: binData,
        parts: partData,
        objectives,
        timeout_seconds: 60
      };
      
      // Make API call
      toast.info('Starting optimization...');
      const response = await fetch('http://localhost:8000/optimize/proto-bin-packing', {
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
      setSolution(data);
      toast.success('Optimization completed successfully!');
      
      return data;
    } catch (err: any) {
      toast.error(`Optimization failed: ${err.message}`);
      console.error('Error calling optimization API:', err);
      return null;
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