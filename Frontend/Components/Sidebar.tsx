import React, { useState, ReactNode } from 'react';

interface SidebarProps {
  children: ReactNode;
  width?: number;
  tabPosition?: 'top' | 'middle' | 'bottom';
  tabColor?: string;
  sidebarColor?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  children,
  width = 320,
  tabPosition = 'middle',
  tabColor = 'bg-primary',
  sidebarColor = 'bg-base-200',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate tab position
  const getTabPositionClass = () => {
    switch (tabPosition) {
      case 'top': return 'top-24';
      case 'bottom': return 'bottom-24';
      case 'middle':
      default: return 'top-1/2 -translate-y-1/2';
    }
  };

  // Toggle sidebar open/closed
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Sidebar tab */}
      <div
        className={`fixed left-0 ${getTabPositionClass()} w-8 h-32 ${tabColor} rounded-r-lg shadow-lg flex items-center justify-center cursor-pointer z-40`}
        onClick={toggleSidebar}
      >
        <div className="text-white font-bold text-lg">
          {isOpen ? '<' : '>'}
        </div>
      </div>

      {/* Sidebar drawer */}
      <div
        className={`fixed top-0 left-0 h-screen ${sidebarColor} shadow-lg z-30 transition-transform duration-300 ease-in-out`}
        style={{
          width: `${width}px`,
          transform: isOpen ? 'translateX(0)' : `translateX(-${width}px)`,
        }}
      >
        <div className="overflow-y-auto h-full p-4">
          {children}
        </div>
      </div>
    </>
  );
};

export default Sidebar