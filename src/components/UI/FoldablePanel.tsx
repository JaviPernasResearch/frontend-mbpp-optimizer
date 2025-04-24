import React from 'react';

export interface FoldablePanelProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const FoldablePanel: React.FC<FoldablePanelProps> = ({ 
  title, 
  isOpen, 
  onToggle, 
  children 
}) => {
  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
      <div 
        className="flex justify-between items-center p-4 cursor-pointer bg-gradient-to-r from-gray-50 to-white hover:bg-gray-100 transition-colors"
        onClick={onToggle}
      >
        <h3 className="font-medium text-gray-800 flex items-center">
          <span className={`mr-2 text-blue-500 ${isOpen ? 'rotate-90' : ''} transition-transform`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="m6 12 4-4-4-4" />
            </svg>
          </span>
          {title}
        </h3>
      </div>
      
      {isOpen && (
        <div className="p-4 border-t border-gray-100 bg-white">
          {children}
        </div>
      )}
    </div>
  );
};

export default FoldablePanel;