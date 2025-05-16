import { Bin, Part, Slot, Module } from '../types/BinTypes';

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
    
    // Check if this is IMOS format or already in API format
    if (this.isImosFormat(data)) {
      return this.convertImosToBin(data);
    } else if (this.isApiFormat(data)) {
      return data as Bin;
    } else {
      throw new Error('Unrecognized JSON format - neither IMOS nor API format');
    }
  }
  
  /**
   * Check if the parsed object is in IMOS format
   */
  private static isImosFormat(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      'Modules' in data &&
      'Guid' in data &&
      data.Modules &&
      '$values' in data.Modules
    );
  }
  
  /**
   * Check if the parsed object is already in API format
   */
  private static isApiFormat(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      'modules' in data &&
      'guid' in data &&
      Array.isArray(data.modules)
    );
  }
  
  /**
   * Convert IMOS format to Bin format
   */
  private static convertImosToBin(imosData: any): Bin {
    // Handle the conversion from IMOS format to our API format
    return {
      guid: imosData.Guid,
      id: imosData.Id,
      modules: imosData.Modules.$values.map((m: any) => this.convertImosModule(m)),
      size: imosData.Size,
      area: imosData.Area
    };
  }
  
  /**
   * Convert IMOS Module format to Module format
   */
  private static convertImosModule(imosModule: any): Module {
    return {
      guid: imosModule.Guid,
      index: imosModule.Index,
      module_type: imosModule.ModuleType === 1 ? 'LARGE_SLOTS' : 'UNDEFINED',
      slots: imosModule.Slots.$values.map((s: any) => this.convertImosSlot(s)),
      origin: imosModule.Origin,
      size: imosModule.Size,
      area: imosModule.Area
    };
  }
  
  /**
   * Convert IMOS Slot format to Slot format
   */
  private static convertImosSlot(imosSlot: any): Slot {
    return {
      guid: imosSlot.Guid,
      index: imosSlot.Index,
      global_index: imosSlot.GlobalIndex,
      origin: imosSlot.Origin,
      size: imosSlot.Size
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