import { IMOSBin } from '../types/BinTypes';

export const loadBinFromFile = (file: File): Promise<IMOSBin> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const binData = JSON.parse(content) as IMOSBin;
        resolve(binData);
      } catch (error) {
        reject(new Error('Failed to parse bin JSON file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read bin file'));
    };
    
    reader.readAsText(file);
  });
};

export const sendBinToBackend = async (bin: IMOSBin, containerCount: number) => {
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
        objectives: [
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