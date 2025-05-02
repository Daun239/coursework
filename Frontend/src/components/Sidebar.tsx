import React, { ReactNode } from 'react';

interface SidebarProps {
  children: ReactNode;
  width?: number;
  tabPosition?: 'top' | 'middle' | 'bottom';
  tabColor?: string;
  sidebarColor?: string;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  children,
  width = 500,
  tabPosition = 'middle',
  tabColor = 'bg-gray-200 dark:bg-gray-500',
  sidebarColor = 'bg-base-200',
  isOpen,
  toggleSidebar,
}) => {

  const getTabPositionClass = () => {
    switch (tabPosition) {
      case 'top': return 'top-24';
      case 'bottom': return 'bottom-24';
      case 'middle':
      default: return 'top-1/2 -translate-y-1/2';
    }
  };

  return (
    <>
      {/* Sidebar tab */}
      <div
        className={`fixed ${getTabPositionClass()} w-8 h-32 bg-gray-400 dark:bg-gray-900 rounded-r-lg shadow-xl flex items-center justify-center cursor-pointer z-40 transition-transform duration-300 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]`}
        onClick={toggleSidebar}
        style={{
          transform: isOpen ? `translateX(${width}px)` : 'translateX(0)',
          left: 0,
        }}
      >
        <div className="text-white font-bold text-lg">
          {isOpen ? '<' : '>'}
        </div>
      </div>

      {/* Sidebar drawer */}
      <div
        className={`fixed top-0 left-0 h-screen bg-gray-100 dark:bg-gray-900 shadow-2xl z-30 transition-transform duration-300 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]`}
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

export default Sidebar;
