import React from 'react';
import { Tab, TABS_CONFIG } from './ShipDetails';

interface BottomNavBarProps {
  activeTab: Tab;
  onTabClick: (tab: Tab) => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabClick }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800/80 backdrop-blur-sm border-t border-gray-700 z-10 md:hidden">
      <div className="flex justify-around">
        {TABS_CONFIG.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabClick(tab.id as Tab)}
              className={`flex flex-col items-center justify-center space-y-1 w-full py-2 px-1 text-center transition-colors duration-200 ${
                isActive ? 'text-blue-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;