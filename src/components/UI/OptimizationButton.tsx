import React from 'react';

interface OptimizationButtonProps {
  onOptimize: () => void;
  isEnabled: boolean;
  isOptimizing: boolean;
}

const OptimizationButton: React.FC<OptimizationButtonProps> = ({ 
  onOptimize, 
  isEnabled,
  isOptimizing 
}) => {
  return (
    <div className="flex justify-center w-full">
      <button
        onClick={onOptimize}
        disabled={!isEnabled || isOptimizing}
        className={`rounded-full border border-solid border-transparent transition-colors flex items-center justify-center gap-2 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5
          ${isOptimizing 
            ? 'bg-blue-300 text-white cursor-wait' 
            : isEnabled 
              ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
      >
        {isOptimizing ? (
          <>
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Optimizing...
          </>
        ) : isEnabled ? 'Run Optimization' : 'Configure Settings First'}
      </button>
    </div>
  );
};

export default OptimizationButton;