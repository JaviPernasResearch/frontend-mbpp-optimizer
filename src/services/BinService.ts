import { IMOSBin, Bin } from '../types/BinTypes';

/**
 * Loads and validates an IMOS bin JSON file
 */
export const loadIMOSBinFromFile = (file: File): Promise<IMOSBin> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const binData = JSON.parse(content) as IMOSBin;
        
        // Validate IMOS bin structure
        if (!binData.Modules || !binData.Guid) {
          reject(new Error('Invalid IMOS container format'));
          return;
        }
        
        resolve(binData);
      } catch (error) {
        reject(new Error('Failed to parse IMOS bin JSON file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read bin file'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Loads and validates an API format bin JSON file
 */
export const loadApiBinFromFile = (file: File): Promise<Bin> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const binData = JSON.parse(content) as Bin;
        
        // Validate API bin structure
        if (!binData.modules || !binData.guid) {
          reject(new Error('Invalid API container format'));
          return;
        }
        
        resolve(binData);
      } catch (error) {
        reject(new Error('Failed to parse API bin JSON file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read bin file'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Validates JSON file format and loads the appropriate bin format
 */
export const loadBinFromFile = async (file: File): Promise<{ imosBin?: IMOSBin, apiBin?: Bin }> => {
  try {
    // First try to load as IMOS format
    const imosBin = await loadIMOSBinFromFile(file);
    return { imosBin };
  } catch (imosError) {
    // If that fails, try API format
    try {
      const apiBin = await loadApiBinFromFile(file);
      return { apiBin };
    } catch (apiError) {
      throw new Error('File is neither a valid IMOS nor API container format');
    }
  }
};

/**
 * Sends bin data to the backend optimization API
 */
export const sendBinToBackend = async (bin: Bin, containerCount: number, objectives: any[] = []) => {
  try {
    const response = await fetch('/api/optimize/proto-bin-packing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bins: [bin],
        containerCount,
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