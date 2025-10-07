
import React, { useState, useEffect, useRef } from 'react';
import { Ship, ShipStatus } from '../types';
import PencilSquareIcon from './icons/PencilSquareIcon';
import XMarkIcon from './icons/XMarkIcon';
import CheckIcon from './icons/CheckIcon';

declare const L: any;

interface OverviewPanelProps {
  ship: Ship;
  onUpdateShip: (shipId: number, updatedData: Partial<Omit<Ship, 'id'>>) => void;
}

const statusStyles: Record<ShipStatus, { text: string; bg: string; dot: string }> = {
  [ShipStatus.OPERATIONAL]: { text: 'text-green-300', bg: 'bg-green-500/10', dot: 'bg-green-400' },
  [ShipStatus.IN_TRANSIT]: { text: 'text-blue-300', bg: 'bg-blue-500/10', dot: 'bg-blue-400' },
  [ShipStatus.AT_PORT]: { text: 'text-yellow-300', bg: 'bg-yellow-500/10', dot: 'bg-yellow-400' },
  [ShipStatus.MAINTENANCE_REQUIRED]: { text: 'text-red-300', bg: 'bg-red-500/10', dot: 'bg-red-400' },
};

const KeyMetric: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="text-center">
        <p className="text-sm text-gray-400">{label}</p>
        <div className="text-lg font-semibold text-white mt-1 truncate">{value}</div>
    </div>
);

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="bg-gray-800/50 p-3 rounded-lg">
        <p className="text-xs text-gray-400">{label}</p>
        <div className="text-md font-medium text-gray-200 mt-1 truncate">{value}</div>
    </div>
);

const EditableField: React.FC<{
  label: string;
  name: keyof Ship;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: 'text' | 'number' | 'select';
  options?: { value: string; label: string }[];
  step?: string;
}> = ({ label, name, value, onChange, type = 'text', options, step }) => (
  <div>
    <label htmlFor={name} className="text-sm text-gray-400">{label}</label>
    {type === 'select' && options ? (
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 w-full bg-gray-900/80 text-white border-gray-600 border rounded-md px-2 py-1.5 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    ) : (
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        step={step}
        className="mt-1 w-full bg-gray-900/80 text-white border-gray-600 border rounded-md px-2 py-1.5 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    )}
  </div>
);


const OverviewPanel: React.FC<OverviewPanelProps> = ({ ship, onUpdateShip }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableShip, setEditableShip] = useState<Ship>(ship);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    setEditableShip(ship);
    setIsEditing(false);
  }, [ship]);

  useEffect(() => {
    if (isEditing) return;

    if (!mapContainerRef.current || typeof L === 'undefined') return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([ship.latitude, ship.longitude], 10);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(mapRef.current);
    } else {
      mapRef.current.setView([ship.latitude, ship.longitude], 10);
    }
    
    mapRef.current.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
            mapRef.current.removeLayer(layer);
        }
    });

    const marker = L.marker([ship.latitude, ship.longitude]).addTo(mapRef.current);
    marker.bindPopup(`<b>${ship.name}</b><br>Tốc độ: ${ship.speed.toFixed(1)} kn`).openPopup();
    
  }, [ship, isEditing]);


  const handleSave = () => {
    onUpdateShip(ship.id, editableShip);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableShip(ship);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      let parsedValue: string | number = value;
      if (e.target.type === 'number') {
        parsedValue = name === 'builtYear' ? parseInt(value) || 0 : parseFloat(value) || 0;
      }
      setEditableShip(prev => ({ ...prev, [name]: parsedValue }));
  };
  
  const statusOptions = Object.values(ShipStatus).map(s => ({value: s, label: s}));
  const { text, bg, dot } = statusStyles[ship.status];

  return (
    <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Tổng quan: {ship.name}</h3>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="flex items-center space-x-2 px-3 py-2 text-sm rounded-md bg-gray-700 hover:bg-gray-600 transition-colors">
                <PencilSquareIcon className="w-5 h-5" />
                <span>Chỉnh sửa</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button onClick={handleCancel} className="flex items-center space-x-2 px-3 py-2 text-sm rounded-md bg-gray-700 hover:bg-gray-600 transition-colors">
                  <XMarkIcon className="w-5 h-5" />
                  <span>Hủy</span>
                </button>
                <button onClick={handleSave} className="flex items-center space-x-2 px-3 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-500 transition-colors font-semibold">
                  <CheckIcon className="w-5 h-5" />
                  <span>Lưu</span>
                </button>
              </div>
            )}
        </div>

        {isEditing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-800/50 p-4 rounded-lg">
                <EditableField label="Tình trạng" name="status" value={editableShip.status} onChange={handleInputChange} type="select" options={statusOptions} />
                <EditableField label="Vĩ độ" name="latitude" value={editableShip.latitude} onChange={handleInputChange} type="number" step="0.0001" />
                <EditableField label="Kinh độ" name="longitude" value={editableShip.longitude} onChange={handleInputChange} type="number" step="0.0001" />
                <EditableField label="Loại tàu" name="type" value={editableShip.type} onChange={handleInputChange} />
                <EditableField label="Thuyền trưởng" name="captain" value={editableShip.captain} onChange={handleInputChange} />
                <EditableField label="Số MMSI" name="imo" value={editableShip.imo} onChange={handleInputChange} />
                <EditableField label="Số IMO" name="trueImo" value={editableShip.trueImo} onChange={handleInputChange} />
                <EditableField label="Cờ" name="flag" value={editableShip.flag} onChange={handleInputChange} />
                <EditableField label="Năm đóng" name="builtYear" value={editableShip.builtYear} onChange={handleInputChange} type="number"/>
            </div>
        ) : (
             <div className="space-y-6">
                <div className="bg-gray-800/50 p-4 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4">
                     <KeyMetric label="Tình trạng" value={
                        <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
                            <span className={`w-2 h-2 mr-1.5 rounded-full ${dot}`}></span>
                            {ship.status}
                        </div>
                    } />
                    <KeyMetric label="Tốc độ" value={`${ship.speed.toFixed(1)} kn`} />
                    <KeyMetric label="Thuyền trưởng" value={ship.captain} />
                    <KeyMetric label="Vị trí" value={`${ship.latitude.toFixed(3)}, ${ship.longitude.toFixed(3)}`} />
                </div>

                <div ref={mapContainerRef} className="h-[250px] md:h-[300px] w-full bg-gray-700 rounded-lg z-0"></div>
                
                <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Thông tin chi tiết</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <DetailItem label="Loại tàu" value={ship.type} />
                        <DetailItem label="Số MMSI" value={ship.imo} />
                        <DetailItem label="Số IMO" value={ship.trueImo} />
                        <DetailItem label="Cờ" value={ship.flag} />
                        <DetailItem label="Năm đóng" value={ship.builtYear} />
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default OverviewPanel;
