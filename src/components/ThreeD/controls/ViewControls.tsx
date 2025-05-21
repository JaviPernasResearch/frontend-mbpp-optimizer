import { useCallback } from 'react';

interface ViewControlsProps {
  colorBy: 'material' | 'assembly';
  showSlots: boolean;
  showGrid: boolean;
  showAxes: boolean;
  setColorBy: React.Dispatch<React.SetStateAction<'material' | 'assembly'>>;
  setShowSlots: React.Dispatch<React.SetStateAction<boolean>>;
  setShowGrid: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAxes: React.Dispatch<React.SetStateAction<boolean>>;
}

const ViewControls: React.FC<ViewControlsProps> = ({
  colorBy,
  showSlots,
  showGrid,
  showAxes,
  setColorBy,
  setShowSlots,
  setShowGrid,
  setShowAxes
}) => {
  // Create a memoized callback for toggling color mode
  const toggleColorMode = useCallback(() => {
    setColorBy(prev => prev === 'material' ? 'assembly' : 'material');
  }, [setColorBy]);

  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
      <button 
        onClick={toggleColorMode}
        className="bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 py-1 px-3 rounded shadow-md transition-all"
      >
        Color by: {colorBy === 'material' ? 'Material' : 'Assembly'}
      </button>
      
      <button 
        onClick={() => setShowSlots(!showSlots)}
        className="bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 py-1 px-3 rounded shadow-md transition-all"
      >
        {showSlots ? 'Hide Slots' : 'Show Slots'}
      </button>
      
      <button 
        onClick={() => setShowGrid(!showGrid)}
        className="bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 py-1 px-3 rounded shadow-md transition-all"
      >
        {showGrid ? 'Hide Grid' : 'Show Grid'}
      </button>
      
      <button 
        onClick={() => setShowAxes(!showAxes)}
        className="bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 py-1 px-3 rounded shadow-md transition-all"
      >
        {showAxes ? 'Hide Axes' : 'Show Axes'}
      </button>
    </div>
  );
};

export default ViewControls;