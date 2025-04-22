import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import BoardsContainer from '../ThreeD/BoardsContainer';

type MainLayoutProps = {
  children?: ReactNode; // Make children optional with the ? symbol
};

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4">
        <BoardsContainer />
        {children}
      </main>
    </div>
  );
};

export default MainLayout;