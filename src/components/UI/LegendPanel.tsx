import React from 'react';

interface LegendPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

const LegendPanel: React.FC<LegendPanelProps> = ({ isOpen, onToggle }) => {
  return (
    <div className={`absolute right-0 top-1/4 transition-all duration-300 z-10 flex ${isOpen ? 'transform-none' : 'translate-x-[calc(100%-32px)]'}`}>      {/* Toggle button */}
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
      <div className="bg-white p-4 shadow-md w-64 h-auto max-h-[70vh] overflow-y-auto border-l border-t border-b border-gray-200 rounded-l-md">
        <h3 className="font-medium text-lg mb-3 border-b pb-2">Color Legend</h3>
        
        {/* Legend content will go here */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Container Type A</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Container Type B</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Container Type C</span>
          </div>
          
          {/* You can add more legend items as needed */}
        </div>
      </div>
    </div>
  );
};

export default LegendPanel;