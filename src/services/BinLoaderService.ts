import { Bin } from '../types/BinTypes';
import { JsonParserService } from './JsonParserService';

/**
 * Loads and validates a bin JSON file (any format)
 */
export const loadBinFromFile = (file: File): Promise<Bin> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        // Use our custom parser to handle both IMOS and API formats
        const binData = JsonParserService.parseBin(content);
        resolve(binData);
      } catch (error) {
        reject(new Error(`Failed to parse bin file: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read bin file'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Creates multiple container copies from a source container
 */
export const createContainerCopies = (sourceBin: Bin, count: number): Bin[] => {
  return JsonParserService.createBinCopies(sourceBin, count);
};

/**
 * Sends bin data to the backend optimization API
 */
export const sendBinToBackend = async (bin: Bin, containerCount: number, objectives: any[] = []) => {
  try {
    // Create multiple container copies if needed
    const bins = createContainerCopies(bin, containerCount);
    
    const response = await fetch('/api/optimize/proto-bin-packing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bins,
        // Add other required fields from your schema
        parts: [], // This would be filled by the backend sample data or your own data
        objectives: objectives.length > 0 ? objectives : [
          {
            objective_type: "WASTED_SPACE", 
            weight: 1.0,
            is_enabled: true
          }
        ],
        timeout_seconds: 60
      }),
    });
    
    if (!response.ok) {
      throw new Error('Optimization request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error sending bin to backend:', error);
    throw error;
  }
};