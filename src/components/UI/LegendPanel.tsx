import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { solutionDataState } from '@/states/solutionDataState';
import { 
  extractMaterialsFromSolution, 
  getMaterialColor, 
  getMaterialDisplayName,
  extractAssembliesFromSolution,
  getAssemblyColor,
  countPartsByMaterial,
  countPartsByAssembly
} from '@/utils/colorUtils';
import { MaterialType } from '@/types/types';

interface LegendPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

const LegendPanel: React.FC<LegendPanelProps> = ({ isOpen, onToggle }) => {
  const [solution] = useAtom(solutionDataState);
  const [activeTab, setActiveTab] = useState<'material' | 'assembly'>('material');
  const [materials, setMaterials] = useState<MaterialType[]>([]);
  const [assemblies, setAssemblies] = useState<number[]>([]);
  const [materialPartCounts, setMaterialPartCounts] = useState<Record<MaterialType, number>>({} as Record<MaterialType, number>);
  const [assemblyPartCounts, setAssemblyPartCounts] = useState<Record<number, number>>({});
  
  // Extract data when solution changes
  useEffect(() => {
    if (solution && solution.packed_parts) {
      // Get unique materials
      const uniqueMaterials = extractMaterialsFromSolution(solution);
      setMaterials(uniqueMaterials);
      
      // Get unique assemblies
      const uniqueAssemblies = extractAssembliesFromSolution(solution);
      setAssemblies(uniqueAssemblies);
      
      // Count parts by material
      setMaterialPartCounts(countPartsByMaterial(solution));
      
      // Count parts by assembly
      setAssemblyPartCounts(countPartsByAssembly(solution));
      
    } else {
      setMaterials([]);
      setAssemblies([]);
      setMaterialPartCounts({} as Record<MaterialType, number>);
      setAssemblyPartCounts({});
    }
  }, [solution]);
  
  // Get total parts count
  const totalParts = solution?.packed_parts?.length || 0;
  
  return (
    <div className={`absolute right-0 top-1/4 transition-all duration-300 z-10 flex ${isOpen ? 'transform-none' : 'translate-x-[calc(100%-32px)]'}`}>
      {/* Toggle button */}
      <button 
        onClick={onToggle}
        className="bg-gray-200 hover:bg-gray-300 w-8 h-12 flex items-center justify-center rounded-l-md shadow-md"
        aria-label={isOpen ? "Close legend" : "Open legend"}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      
      {/* Panel content */}
      <div className="bg-white p-4 shadow-md w-72 h-auto max-h-[70vh] overflow-y-auto border-l border-t border-b border-gray-200 rounded-l-md">
        <h3 className="font-medium text-lg mb-2">Legend</h3>
        
        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button 
            onClick={() => setActiveTab('material')}
            className={`py-2 px-3 ${activeTab === 'material' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-600'}`}
          >
            Materials
          </button>
          <button 
            onClick={() => setActiveTab('assembly')}
            className={`py-2 px-3 ${activeTab === 'assembly' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-600'}`}
          >
            Assembly Groups
          </button>
        </div>
        
        {/* Material Legend */}
        {activeTab === 'material' && (
          <div className="space-y-2">
            {materials.length > 0 ? (
              materials.map((material) => (
                <div key={material} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-5 h-5 rounded-sm border border-gray-300" 
                      style={{ backgroundColor: getMaterialColor(material) }}
                    ></div>
                    <span>{getMaterialDisplayName(material)}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-gray-600 text-sm">
                      {materialPartCounts[material] || 0} parts
                    </span>
                    <span className="text-gray-500 text-xs">
                      {totalParts > 0 ? Math.round((materialPartCounts[material] || 0) / totalParts * 100) : 0}%
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-6">
                {solution ? "No materials found" : "Run optimization to see materials"}
              </div>
            )}
          </div>
        )}
        
        {/* Assembly Legend */}
        {activeTab === 'assembly' && (
          <div className="space-y-2">
            {assemblies.length > 0 ? (
              assemblies.map((assembly) => (
                <div key={assembly} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-5 h-5 rounded-sm border border-gray-300" 
                      style={{ backgroundColor: getAssemblyColor(assembly) }}
                    ></div>
                    <span>Assembly {assembly}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-gray-600 text-sm">
                      {assemblyPartCounts[assembly] || 0} parts
                    </span>
                    <span className="text-gray-500 text-xs">
                      {totalParts > 0 ? Math.round((assemblyPartCounts[assembly] || 0) / totalParts * 100) : 0}%
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-6">
                {solution ? "No assembly groups found" : "Run optimization to see assemblies"}
              </div>
            )}
          </div>
        )}
        
        {/* Summary */}
        {solution && solution.packed_parts && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Total Parts:</span>
              <span>{totalParts}</span>
            </div>
            
            {activeTab === 'material' && (
              <div className="flex justify-between text-sm">
                <span className="font-medium">Material Types:</span>
                <span>{materials.length}</span>
              </div>
            )}
            
            {activeTab === 'assembly' && (
              <div className="flex justify-between text-sm">
                <span className="font-medium">Assembly Groups:</span>
                <span>{assemblies.length}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(LegendPanel);