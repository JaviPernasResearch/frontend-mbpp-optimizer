import React, { useState } from 'react';

interface FoldablePanelProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const FoldablePanel: React.FC<FoldablePanelProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border border-gray-300 rounded-md mb-4">
      <button
        onClick={togglePanel}
        className="w-full text-left p-2 bg-gray-200 hover:bg-gray-300 rounded-t-md"
      >
        {title}
      </button>
      {isOpen && (
        <div className="p-2 bg-gray-100 rounded-b-md">
          {children}
        </div>
      )}
    </div>
  );
};

export default FoldablePanel;