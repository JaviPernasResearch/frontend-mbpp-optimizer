'use client';

import React, { ReactNode, useState } from 'react';
import SettingsMenu from './SettingsMenu';
import LegendPanel from '../UI/LegendPanel';
import ThreeDView from './ThreeDView';

type MainLayoutProps = {
  children?: ReactNode;
};

function MainLayout({ children }: MainLayoutProps) {
  const [isLegendOpen, setIsLegendOpen] = useState(false);

  const toggleLegend = () => {
    setIsLegendOpen(!isLegendOpen);
  };
  
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
        <ThreeDView />
        {children}
        
        {/* Legend Panel - Positioned absolutely over the 3D view */}
        <LegendPanel isOpen={isLegendOpen} onToggle={toggleLegend} />
      </div>
    </div>
  );
}

export default MainLayout;