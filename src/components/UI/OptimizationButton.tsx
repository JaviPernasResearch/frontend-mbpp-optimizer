import React from 'react';

interface OptimizationButtonProps {
  onOptimize: () => void;
  isEnabled: boolean;
}

const OptimizationButton: React.FC<OptimizationButtonProps> = ({ onOptimize, isEnabled }) => {
  return (
    <div className="flex justify-center w-full">
      <button
        onClick={onOptimize}
        disabled={!isEnabled}
        className={`rounded-full border border-solid border-transparent transition-colors flex items-center justify-center gap-2 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5
          ${isEnabled 
            ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
      >
        {isEnabled ? 'Run Optimization' : 'Configure Settings First'}
      </button>
    </div>
  );
};

export default OptimizationButton;