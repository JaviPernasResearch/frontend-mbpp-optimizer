interface DebugPanelProps {
  solution: any;
  packedParts: any[];
  activeBinIndex: number;
}

const DebugPanel: React.FC<DebugPanelProps> = ({
  solution,
  packedParts,
  activeBinIndex
}) => {
  return (
    <div className="absolute top-52 right-4 z-10 bg-white bg-opacity-80 p-2 rounded text-xs shadow-md">
      <p><strong>Solution:</strong> {solution ? 'Yes' : 'No'}</p>
      <p><strong>Total Parts:</strong> {packedParts.length}</p>
      <p><strong>Active Container:</strong> {activeBinIndex}</p>
      <p><strong>Container Parts:</strong> {packedParts.filter(p => p.bin_id === activeBinIndex).length}</p>
    </div>
  );
};

export default DebugPanel;