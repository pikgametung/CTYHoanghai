import React, { useState, useMemo, useRef, useEffect } from 'react';
import ShipIcon from './icons/ShipIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import ShipSelectorDropdown from './ShipSelectorDropdown';
import { Ship } from '../types';

interface HeaderProps {
  ships: Ship[];
  selectedShipId: number | null;
  onSelectShip: (id: number) => void;
  onAddShipClick: () => void;
  onDeleteShip: (shipId: number) => void;
  onUpdateShip: (shipId: number, updatedData: Partial<Omit<Ship, 'id'>>) => void;
}

const Header: React.FC<HeaderProps> = ({ ships, selectedShipId, onSelectShip, onAddShipClick, onDeleteShip, onUpdateShip }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedShip = useMemo(() => {
    return ships.find(ship => ship.id === selectedShipId);
  }, [ships, selectedShipId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-gray-800/80 backdrop-blur-sm shadow-md p-3 border-b border-gray-700 z-20 sticky top-0">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
            <ShipIcon className="w-7 h-7 text-blue-400 mr-3" />
            <h1 className="text-lg font-bold text-white tracking-wider hidden sm:block">
              Quản Lý Đội Tàu
            </h1>
        </div>
        
        {selectedShip ? (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 bg-gray-700/50 hover:bg-gray-700 p-2 rounded-md transition-colors"
            >
              <span className="font-semibold text-white">{selectedShip.name}</span>
              <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
              <ShipSelectorDropdown
                ships={ships}
                selectedShipId={selectedShipId}
                onSelectShip={(id) => {
                  onSelectShip(id);
                  setIsDropdownOpen(false);
                }}
                onAddShipClick={() => {
                  onAddShipClick();
                  setIsDropdownOpen(false);
                }}
                onClose={() => setIsDropdownOpen(false)}
                onDeleteShip={onDeleteShip}
                onUpdateShip={onUpdateShip}
              />
            )}
          </div>
        ) : (
           <div className="text-gray-400 font-semibold">Chưa chọn tàu</div>
        )}
      </div>
    </header>
  );
};

const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);


export default Header;