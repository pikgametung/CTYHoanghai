import React, { useState, useMemo } from 'react';
import { Ship, ShipStatus } from '../types';
import PlusIcon from './icons/PlusIcon';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';

interface ShipSelectorDropdownProps {
  ships: Ship[];
  selectedShipId: number | null;
  onSelectShip: (id: number) => void;
  onAddShipClick: () => void;
  onClose: () => void;
  onDeleteShip: (shipId: number) => void;
  onUpdateShip: (shipId: number, updatedData: Partial<Omit<Ship, 'id'>>) => void;
}

const statusColors: Record<ShipStatus, string> = {
  [ShipStatus.OPERATIONAL]: 'bg-green-500',
  [ShipStatus.IN_TRANSIT]: 'bg-blue-500',
  [ShipStatus.AT_PORT]: 'bg-yellow-500',
  [ShipStatus.MAINTENANCE_REQUIRED]: 'bg-red-500',
};


const ShipSelectorDropdown: React.FC<ShipSelectorDropdownProps> = ({ ships, selectedShipId, onSelectShip, onAddShipClick, onClose, onDeleteShip, onUpdateShip }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  const filteredShips = useMemo(() => {
    return ships.filter(ship => 
      ship.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [ships, searchTerm]);
  
  const handleStartEdit = (ship: Ship) => {
    setEditingId(ship.id);
    setEditingName(ship.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleSaveEdit = () => {
    if (editingId && editingName.trim()) {
      onUpdateShip(editingId, { name: editingName.trim() });
    }
    handleCancelEdit();
  };

  const handleDelete = (shipId: number, shipName: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tàu "${shipName}" không? Hành động này không thể hoàn tác.`)) {
      onDeleteShip(shipId);
    }
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-72 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 animate-fade-in-down">
      <div className="p-2">
        <input
          type="text"
          placeholder="Tìm kiếm tàu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-900/80 text-white border-gray-600 border rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <ul className="max-h-64 overflow-y-auto p-1">
        {filteredShips.map(ship => (
          <li key={ship.id}>
            <div
              className={`group flex items-center justify-between w-full text-left p-2 rounded-md space-x-2 transition-colors ${selectedShipId === ship.id ? 'bg-blue-600/30' : 'hover:bg-gray-700'}`}
              
            >
             <div className="flex-1 min-w-0" onClick={() => editingId !== ship.id && onSelectShip(ship.id)} style={{ cursor: editingId !== ship.id ? 'pointer' : 'default' }}>
                {editingId === ship.id ? (
                   <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={handleSaveEdit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full bg-gray-900/80 text-white border-blue-500 border rounded-md px-1 py-0 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    autoFocus
                  />
                ) : (
                  <span className="font-medium text-gray-200 truncate block">{ship.name}</span>
                )}
              </div>
              
              <div className="flex items-center flex-shrink-0 space-x-1">
                 <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {editingId === ship.id ? null : (
                    <button onClick={(e) => { e.stopPropagation(); handleStartEdit(ship); }} className="p-1 rounded hover:bg-gray-600" title="Sửa tên tàu">
                      <PencilIcon className="w-4 h-4 text-gray-300" />
                    </button>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(ship.id, ship.name); }} className="p-1 rounded hover:bg-gray-600 text-red-400 hover:text-red-300" title="Xóa tàu">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                 <span 
                  className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusColors[ship.status]}`}
                  title={ship.status}
                ></span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="p-2 border-t border-gray-700">
        <button 
            onClick={onAddShipClick}
            className="w-full flex items-center justify-center space-x-2 text-sm text-blue-400 hover:bg-blue-500/10 p-2 rounded-md transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Thêm tàu mới</span>
        </button>
      </div>
      <style>{`.animate-fade-in-down { animation: fadeInDown 0.2s ease-out forwards; } @keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

export default ShipSelectorDropdown;