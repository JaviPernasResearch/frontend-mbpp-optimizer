import React from 'react';

interface OptimizationButtonProps {
  onOptimize: () => void;
}

const OptimizationButton: React.FC<OptimizationButtonProps> = ({ onOptimize }) => {
  return (
    <div className="flex justify-center w-full">
      <button
        onClick={onOptimize}
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-500 text-white gap-2 hover:bg-blue-600 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
      >
        Run Optimization
      </button>
    </div>
  );
};

export default OptimizationButton;