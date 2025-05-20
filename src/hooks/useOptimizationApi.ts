import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAtom } from 'jotai';
import { binDataState } from '@/states/binDataState';
import { Bin, Part } from '@/types/BinTypes';
import { createContainerCopies, sendBinToBackend } from '@/services/BinLoaderService';
import { OptimizationObjective, OptimizationRequest, OptimizationSettings, OptimizationSolution } from '@/types/optimization';
import { containerCountState } from '@/states/containerCountState';
import { partsDataState } from '@/states/partsDataState';
import { Console } from 'console';

export function useOptimizationApi() {
  const [binData] = useAtom(binDataState);
  const [partsData] = useAtom(partsDataState);
  const [containerCount] = useAtom(containerCountState);
  const [solution, setSolution] = useState<OptimizationSolution | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  // Create sample parts for demonstration
  const createSampleParts = (): Part[] => {
    return [
      {
        guid: crypto.randomUUID(),
        size: { X: 22.0, Y: 750.0, Z: 600.0 },
        material: "P2_MFB_19",
        part_type: "SIDEWALL",
        position_nr: "P1",
        assembly_id: 101
      },
      {
        guid: crypto.randomUUID(),
        size: { X: 22.0, Y: 800.0, Z: 600.0 },
        material: "P2_MFB_19",
        part_type: "SIDEWALL",
        position_nr: "P2",
        assembly_id: 101
      },
      {
        guid: crypto.randomUUID(),
        size: { X: 22.0, Y: 600.0, Z: 450.0 },
        material: "P2_MFB_9",
        part_type: "MITTELBODEN",
        position_nr: "P3",
        assembly_id: 102
      },
      {
        guid: crypto.randomUUID(),
        size: { X: 15.0, Y: 550.0, Z: 500.0 },
        material: "MPX_ROH_15",
        part_type: "EINLEGEBODEN",
        position_nr: "P4",
        assembly_id: 102
      }
    ];
  };

  const runOptimization = async (settings: OptimizationSettings) => {
    // Check if any container model is available
    if (!binData) {
      toast.error('Please upload a container JSON file first');
      return null;
    }
    
    setIsOptimizing(true);
    
    try {
      // Create the bins from JSON data using our helper function
      const bins: Bin[] = createContainerCopies(binData, containerCount);

      // Use uploaded parts if available, otherwise create sample parts
      const parts = partsData || createSampleParts();
      
      console.log(`Using ${parts.length} parts (${partsData ? 'from uploaded file' : 'sample parts'})`);

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
      
      // Print OptimizationRequest object in terminal
      console.log("Optimization Request:", JSON.stringify(requestBody, null, 2));

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