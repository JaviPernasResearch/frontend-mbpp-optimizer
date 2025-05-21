interface BinSelectorProps {
  binCount: number;
  activeBinIndex: number;
  setActiveBinIndex: React.Dispatch<React.SetStateAction<number>>;
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
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex items-center gap-1 bg-white bg-opacity-75 px-3 py-2 rounded shadow-lg">
      <span className="text-sm mr-2">Container:</span>
      {Array.from({ length: binCount }, (_, i) => (
        <button
          key={i}
          onClick={() => setActiveBinIndex(i)}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
            ${activeBinIndex === i 
              ? 'bg-blue-600 text-white' 
              : binsWithParts.includes(i)
                ? 'bg-green-100 hover:bg-blue-200'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          title={`Container ${i}${binsWithParts.includes(i) ? ` (${packedParts.filter(p => p.bin_id === i).length} parts)` : ''}`}
        >
          {i}
        </button>
      ))}
      
      {binCount > 10 && (
        <span className="text-xs italic ml-2">+{binCount - 10} more</span>
      )}
      
      {binCount > 1 && (
        <button 
          onClick={() => setActiveBinIndex((prev) => (prev + 1) % binCount)}
          className="ml-3 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center"
          title="Next container"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
      )}
    </div>
  );
};

export default BinSelector;