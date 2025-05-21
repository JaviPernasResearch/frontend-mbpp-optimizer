import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAtom } from 'jotai';
import { binDataState } from '@/states/binDataState';
import { Bin, Part } from '@/types/types';
import { createContainerCopies } from '@/services/BinLoaderService';
import { OptimizationObjective, OptimizationRequest, OptimizationSettings, OptimizationSolution } from '@/types/optimization';
import { binCountState } from '@/states/binCountState';
import { partsDataState } from '@/states/partsDataState';
import { solutionDataState } from '@/states/solutionDataState';

export function useOptimizationApi() {
  const [binData] = useAtom(binDataState);
  const [partsData] = useAtom(partsDataState);
  const [containerCount] = useAtom(binCountState);
  const [solution, setSolution] = useAtom(solutionDataState);
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  // Refs to track previous state for comparison
  const prevBinDataRef = useRef<Bin | null>(null);
  const prevPartsDataRef = useRef<Part[] | null>(null);
  const prevContainerCountRef = useRef<number>(1);
  const prevSettingsRef = useRef<OptimizationSettings | null>(null);
  
  // Solution persistence ref
  const persistentSolutionRef = useRef<OptimizationSolution | null>(null);

  // Effect to maintain persistent solution reference
  useEffect(() => {
    if (solution) {
      persistentSolutionRef.current = solution;
      console.log("Saved solution to persistent reference");
    }
  }, [solution]);
  
  // Effect to restore solution if it gets lost (like during panel toggle)
  useEffect(() => {
    if (!solution && persistentSolutionRef.current) {
      console.log("Restoring solution from persistent reference");
      setSolution(persistentSolutionRef.current);
    }
  }, [solution, setSolution]);
  
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

  // Helper to check if data has changed
  const hasDataChanged = (settings: OptimizationSettings): boolean => {
    // Check if bin data has changed
    const binChanged = prevBinDataRef.current !== binData;
    
    // Check if parts data has changed
    const partsChanged = prevPartsDataRef.current !== partsData;
    
    // Check if container count has changed
    const countChanged = prevContainerCountRef.current !== containerCount;
    
    // Check if optimization settings have changed
    const settingsChanged = 
      !prevSettingsRef.current ||
      prevSettingsRef.current.minimizeSpaceWaste !== settings.minimizeSpaceWaste ||
      prevSettingsRef.current.groupSameMaterialComponents !== settings.groupSameMaterialComponents ||
      prevSettingsRef.current.groupSameOrderComponents !== settings.groupSameOrderComponents;
    
    // Log changes for debugging
    if (binChanged) console.log("Bin data has changed");
    if (partsChanged) console.log("Parts data has changed");
    if (countChanged) console.log("Container count has changed");
    if (settingsChanged) console.log("Optimization settings have changed");
    
    return binChanged || partsChanged || countChanged || settingsChanged;
  };

  const runOptimization = async (settings: OptimizationSettings) => {
    // Check if any container model is available
    if (!binData) {
      toast.error('Please upload a container JSON file first');
      return null;
    }
    
    // Check if anything has changed since the last optimization
    if (!hasDataChanged(settings) && solution) {
      toast.info('Using existing solution (no changes detected)');
      console.log("No changes detected, using existing solution");
      return solution;
    }
    
    // Update refs with current state for future comparisons
    prevBinDataRef.current = binData;
    prevPartsDataRef.current = partsData;
    prevContainerCountRef.current = containerCount;
    prevSettingsRef.current = { ...settings };
    
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
      
      // Parse JSON response even if it's an error
      const data = await response.json();
      console.log("Optimization result:", data);

      // Check if the response has an error field
      if (data.error) {
        toast.error(`Optimization failed: ${data.status}`);
        return null;
      }
      
      // If response wasn't ok but didn't have an error field
      if (!response.ok) {
        const errorMessage = `API call failed with status: ${response.status}`;
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
            
      // Check for solution status that indicates issues
      toast.success(`Optimization completed. Status: ${data.status}`);
      
      // Set solution and update our persistent reference
      setSolution(data);
      persistentSolutionRef.current = data;
      
      return data;
    } catch (err: any) {
      // If the server is not running, return a mock solution
      console.error('Error calling optimization API:', err);
      toast.warning('Using fallback solution (server not available)');
      
      return null;
    } finally {
      setIsOptimizing(false);
    }
  };

  // Always return the persistent solution if current solution is null
  const effectiveSolution = solution || persistentSolutionRef.current;

  return {
    solution: effectiveSolution,
    isOptimizing,
    runOptimization
  };
}