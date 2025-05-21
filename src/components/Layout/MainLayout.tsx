'use client';

import React, { ReactNode, useState, useMemo } from 'react';
import SettingsMenu from './SettingsMenu';
import LegendPanel from '../UI/LegendPanel';
import ThreeDView from './ThreeDView';

type MainLayoutProps = {
  children?: ReactNode;
};

// Create a memorized version of ThreeDView that won't re-render when parent changes
const MemoizedThreeDView = React.memo(() => {
  console.log("ThreeDView render");
  return <ThreeDView />;
});

function MainLayout({ children }: MainLayoutProps) {
  const [isLegendOpen, setIsLegendOpen] = useState(false);

  const toggleLegend = () => {
    setIsLegendOpen(!isLegendOpen);
  };
  
  // Create the ThreeDView instance only once
  const stableThreeView = useMemo(() => <MemoizedThreeDView />, []);
  
  
  // Log when MainLayout re-renders
  console.log("MainLayout render");
  
  return (
    <div className="flex flex-row h-screen w-full">
      {/* Left side - Sidebar */}
      <div className="w-100 h-full bg-white shadow-lg flex-shrink-0">
        <SettingsMenu />
      </div>
      
      {/* Vertical separator */}
      <div className="w-1 h-full bg-blue-500"></div>
      
      {/* Right side - 3D View with overlay Legend */}
      <div className="flex-1 h-full bg-gray-100 relative">
        {/* Use the stable ThreeDView instance */}
        {stableThreeView}
        {children}
        
        {/* Legend Panel - Positioned absolutely over the 3D view */}
        <LegendPanel isOpen={isLegendOpen} onToggle={toggleLegend} />
      </div>
    </div>
  );
}

export default MainLayout;