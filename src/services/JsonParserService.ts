import { Bin, Part, Slot, Module } from '../types/types';

/**
 * A specialized JSON parser that can handle both IMOS format and API format
 * and convert them to our standardized Bin type.
 * Temporary until JSON format is revised/standarized. Now, C# is kept as reference.
 */
export class JsonParserService {
  
  /**
   * Parse a JSON string and attempt to convert it to our Bin type
   */
  static parseBin(jsonString: string): Bin {
    // First, parse the JSON string normally
    const data = JSON.parse(jsonString);
    
    // Check if this is Json format
    if (this.isBinFormat(data)) {
      return this.convertJsosnToBin(data.bins[0]);
    } else {
      throw new Error('Unrecognized JSON format');
    }
  }
  
  /**
   * Check if the parsed object is in IMOS format
   */
  private static isBinFormat(data: any): boolean {
    // Check if data is a bins container object
    if (data && typeof data === 'object' && 'bins' in data && Array.isArray(data.bins)) {
      // Look at the first bin to determine format
      const firstBin = data.bins[0];
      return (
        firstBin &&
        typeof firstBin === 'object' &&
        'modules' in firstBin &&
        'guid' in firstBin
      );
    }

    // Check for legacy format where data is directly the bin object
    return (
      data &&
      typeof data === 'object' &&
      'modules' in data &&
      'guid' in data &&
      data.Modules &&
      data.Modules.length > 0
    );
  }
  
  
  /**
   * Convert Json format to Bin format
   */
  private static convertJsosnToBin(jsonBin: any): Bin {
    // Handle the conversion from IMOS format to our API format
    return {
      guid: jsonBin.guid,
      id: jsonBin.id,
      modules: jsonBin.modules.map((m: any) => this.convertJsonToModule(m)),
      size: jsonBin.size,
      area: jsonBin.area
    };
  }
  
  /**
   * Convert Json Module format to Module format
   */
  private static convertJsonToModule(jsonModule: any): Module {
    // Handle module_type that could be either a number or a string enum
    let moduleType: 'LARGE_SLOTS' | 'UNDEFINED' = 'UNDEFINED';

    if (jsonModule.module_type !== undefined) {
      // If it's a number, check if it's 1
      if (typeof jsonModule.module_type === 'number') {
        moduleType = jsonModule.module_type === 1 ? 'LARGE_SLOTS' : 'UNDEFINED';
      }
      // If it's a string, use it directly if it matches our enum
      else if (typeof jsonModule.module_type === 'string') {
        moduleType = jsonModule.module_type === 'LARGE_SLOTS' ? 'LARGE_SLOTS' : 'UNDEFINED';
      }
    }
    return {
      guid: jsonModule.guid,
      index: jsonModule.index,
      module_type: moduleType,     
      slots: jsonModule.slots.map((s: any) => this.convertJsonToSlot(s)),
      origin: jsonModule.origin,
      size: jsonModule.size,
      area: jsonModule.area
    };
  }
  
  /**
   * Convert Json Slot format to Slot format
   */
  private static convertJsonToSlot(jsonSlot: any): Slot {
    return {
      guid: jsonSlot.guid,
      index: jsonSlot.index,
      global_index: jsonSlot.global_index,
      origin: jsonSlot.origin,
      size: jsonSlot.size
    };
  }
  
  /**
   * Create a duplicate bin with a new ID
   */
  static duplicateBin(bin: Bin, newId: number): Bin {
    return {
      ...bin,
      guid: crypto.randomUUID(),
      id: newId,
    };
  }
  
  /**
   * Create multiple copies of a bin with sequential IDs
   */
  static createBinCopies(sourceBin: Bin, count: number): Bin[] {
    const bins: Bin[] = [sourceBin]; // Keep the original as bin 0
    
    for (let i = 1; i < count; i++) {
      bins.push(this.duplicateBin(sourceBin, i));
    }
    
    return bins;
  }

  /**
   * Parse a JSON string and attempt to convert it to our Parts array
   */
  static parseParts(jsonString: string): Part[] {
    // First, parse the JSON string normally
    const data = JSON.parse(jsonString);
    
    // Check if this is an array of parts
    if (Array.isArray(data)) {
      return data.map(item => this.validateAndNormalizePart(item));
    } 
    // Check if this is a wrapper object with parts array inside
    else if (data && typeof data === 'object' && 'parts' in data && Array.isArray(data.parts)) {
      return data.parts.map((item: any) => this.validateAndNormalizePart(item));
    }
    // Handle case where it's a single part object
    else if (data && typeof data === 'object' && 'guid' in data) {
      return [this.validateAndNormalizePart(data)];
    }
    else {
      throw new Error('Invalid parts format - expected array of parts or object with parts array');
    }
  }
  
  /**
   * Validate and normalize part data to ensure it matches our Part type
   */
  private static validateAndNormalizePart(part: any): Part {
    // Validate mandatory fields
    if (!part.guid || !part.size) {
      throw new Error('Invalid part format - missing required fields (guid, size)');
    }
    
    // Normalize the part object to match our schema
    return {
      guid: part.guid,
      size: {
        X: Number(part.size.X || part.size.x || 0),
        Y: Number(part.size.Y || part.size.y || 0),
        Z: Number(part.size.Z || part.size.z || 0)
      },
      material: part.material || part.material_type || 'UNDEFINED',
      part_type: part.part_type || 'UNDEFINED',
      position_nr: part.position_nr || part.position || '',
      assembly_id: Number(part.assembly_id || part.assemblyId || 0)
    };
  }
}