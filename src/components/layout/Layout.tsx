import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="flex w-full min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={onTabChange} />
      <main className="flex-1 ml-64 p-10 min-h-screen relative">
        {children}
      </main>
    </div>
  );
};

export default Layout;
