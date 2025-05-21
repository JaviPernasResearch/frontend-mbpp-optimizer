import React from 'react';

interface BinSelectorProps {
  binCount: number;
  activeBinIndex: number;
  setActiveBinIndex: (binIndex: number) => void;
  binsWithParts: number[];
  packedParts: any[];
}

const BinSelector: React.FC<BinSelectorProps> = ({
  binCount,
  activeBinIndex,
  setActiveBinIndex,
  binsWithParts,
  packedParts
}) => {
  // Helper to get the part count for a specific bin
  const getPartCount = (binIndex: number) => {
    return packedParts.filter(p => p.bin_id === binIndex).length;
  };

  // We'll limit the number of visible bin buttons
  const maxVisibleBins = 10;
  const visibleBins = Math.min(binCount, maxVisibleBins);
  
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex items-center gap-1 bg-white bg-opacity-75 px-3 py-2 rounded shadow-lg">
      <span className="text-sm mr-2">Container:</span>
      
      {/* Render buttons for each bin */}
      {Array.from({ length: visibleBins }, (_, i) => {
        const hasPackedParts = binsWithParts.includes(i);
        const partCount = hasPackedParts ? getPartCount(i) : 0;
        
        return (
          <button
            key={i}
            onClick={() => setActiveBinIndex(i)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
              ${activeBinIndex === i 
                ? 'bg-blue-600 text-white' 
                : hasPackedParts
                  ? 'bg-green-100 hover:bg-blue-200'
                  : 'bg-gray-100 hover:bg-gray-200'
              }
              relative
            `}
            title={`Container ${i}${hasPackedParts ? ` (${partCount} parts)` : ' (empty)'}`}
          >
            {i}
            {/* Badge showing part count */}
            {hasPackedParts && partCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {partCount > 9 ? '9+' : partCount}
              </span>
            )}
          </button>
        );
      })}
      
      {/* Show indication if there are more bins than we're displaying */}
      {binCount > maxVisibleBins && (
        <div className="flex flex-col items-center ml-2">
          <span className="text-xs italic">+{binCount - maxVisibleBins} more</span>
          <button 
            onClick={() => {
              // Calculate the next group of bins
              const nextStartBin = Math.floor(activeBinIndex / maxVisibleBins) * maxVisibleBins + maxVisibleBins;
              setActiveBinIndex(nextStartBin < binCount ? nextStartBin : 0);
            }}
            className="text-xs underline text-blue-500 hover:text-blue-700"
          >
            Next group
          </button>
        </div>
      )}
      
      {/* Always show next button for easy navigation */}
      <button 
        onClick={() => setActiveBinIndex((activeBinIndex + 1) % binCount)}
        className="ml-3 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
        title="Next container"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
        </svg>
      </button>
    </div>
  );
};

export default BinSelector;