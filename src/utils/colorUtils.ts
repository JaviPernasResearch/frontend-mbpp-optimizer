import * as THREE from 'three';
import { MaterialType } from '@/types/types';

// Mapping from material types to human-readable names
export const materialDisplayNames: Record<MaterialType, string> = {
  'UNDEFINED': 'Unknown',
  'P2_MFB_19': 'MFB 19mm',
  'P2_MFB_9': 'MFB 9mm',
  'P2_MFB__8': 'MFB 8mm',
  'MPX_ROH_15': 'Multiplex 15mm',
  'MDF': 'MDF'
};

// Material colors - Each material type has its own color
export const materialColors: Record<MaterialType, string> = {
  'UNDEFINED': '#888888',  // Gray for undefined
  'P2_MFB_19': '#8B4513',  // Brown for MFB 19mm
  'P2_MFB_9': '#A0522D',   // Sienna for MFB 9mm
  'P2_MFB__8': '#CD853F',  // Peru color for MFB 8mm
  'MPX_ROH_15': '#D2B48C', // Tan for Multiplex 15mm
  'MDF': '#DEB887'         // Burlywood for MDF
};

// Get the display name for a material type
export const getMaterialDisplayName = (material: MaterialType): string => {
  return materialDisplayNames[material] || material;
};

// Get the color for a material type
export const getMaterialColor = (material: MaterialType): string => {
  return materialColors[material] || '#888888'; // Default to gray for unknown materials
};

// Get material color as Three.js Color for 3D rendering
export const getMaterialThreeColor = (material: MaterialType): THREE.Color => {
  return new THREE.Color(getMaterialColor(material));
};

// Extract unique materials from a solution
export const extractMaterialsFromSolution = (solution: any): MaterialType[] => {
  if (!solution || !solution.packed_parts) {
    return [];
  }
  
  // Get unique materials from packed parts
  const materials = new Set<MaterialType>();
  
  solution.packed_parts.forEach((part: any) => {
    if (part.material_type) {
      materials.add(part.material_type as MaterialType);
    }
  });
  
  return Array.from(materials);
};

// Get a color for an assembly group
export const getAssemblyColor = (assemblyId: number): string => {
  // Use a different color scheme for assemblies
  const hue = (assemblyId * 137.5 + 60) % 360; // Golden ratio to create distinct colors
  return `hsl(${hue}, 85%, 55%)`;
};

// Count parts by material
export const countPartsByMaterial = (solution: any): Record<MaterialType, number> => {
  if (!solution || !solution.packed_parts) {
    return {} as Record<MaterialType, number>;
  }
  
  const counts: Record<string, number> = {};
  
  solution.packed_parts.forEach((part: any) => {
    if (part.material_type) {
      counts[part.material_type] = (counts[part.material_type] || 0) + 1;
    }
  });
  
  return counts as Record<MaterialType, number>;
};

// Count parts by assembly
export const countPartsByAssembly = (solution: any): Record<number, number> => {
  if (!solution || !solution.packed_parts) {
    return {};
  }
  
  const counts: Record<number, number> = {};
  
  solution.packed_parts.forEach((part: any) => {
    if (part.assembly_id !== undefined) {
      counts[part.assembly_id] = (counts[part.assembly_id] || 0) + 1;
    }
  });
  
  return counts;
};

// Extract unique assembly IDs from a solution
export const extractAssembliesFromSolution = (solution: any): number[] => {
  if (!solution || !solution.packed_parts) {
    return [];
  }
  
  // Get unique assembly IDs
  const assemblies = new Set<number>();
  
  solution.packed_parts.forEach((part: any) => {
    if (part.assembly_id !== undefined) {
      assemblies.add(part.assembly_id);
    }
  });
  
  return Array.from(assemblies).sort((a, b) => a - b);
};