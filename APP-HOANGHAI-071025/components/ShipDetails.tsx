
import React, { useState } from 'react';
import { Ship, Trip, Voyage, FuelLog, Cost, MaintenanceRecord } from '../types';
import OverviewPanel from './OverviewPanel';
import VoyagePanel from './VoyagePanel';
import FuelPanel from './FuelPanel';
import CostPanel from './CostPanel';
import MaintenancePanel from './MaintenancePanel';
import ClipboardDocumentListIcon from './icons/ClipboardDocumentListIcon';
import MapPinIcon from './icons/MapPinIcon';
import GaugeIcon from './icons/GaugeIcon';
import CurrencyDollarIcon from './icons/CurrencyDollarIcon';
import WrenchScrewdriverIcon from './icons/WrenchScrewdriverIcon';
import BottomNavBar from './BottomNavBar';

interface ShipDetailsProps {
  ship: Ship;
  trips: Trip[];
  voyages: Voyage[];
  fuelLogs: FuelLog[];
  costs: Cost[];
  maintenanceRecords: MaintenanceRecord[];
  onUpdateShip: (shipId: number, updatedData: Partial<Omit<Ship, 'id'>>) => void;
  onAddTrip: (data: Omit<Trip, 'id'>) => void;
  onUpdateTrip: (id: number, data: Partial<Omit<Trip, 'id'>>) => void;
  onDeleteTrip: (id: number) => void;
  onAddVoyage: (data: Omit<Voyage, 'id'>) => void;
  onUpdateVoyage: (id: number, data: Partial<Omit<Voyage, 'id'>>) => void;
  onDeleteVoyage: (id: number) => void;
  onAddFuelLog: (data: Omit<FuelLog, 'id'>) => void;
  onUpdateFuelLog: (id: number, data: Partial<Omit<FuelLog, 'id'>>) => void;
  onDeleteFuelLog: (id: number) => void;
  onAddCost: (data: Omit<Cost, 'id'>) => void;
  onUpdateCost: (id: number, data: Partial<Omit<Cost, 'id'>>) => void;
  onDeleteCost: (id: number) => void;
  costCategories: string[];
  onAddCostCategory: (newCategory: string) => void;
  onUpdateCostCategory: (oldCategory: string, newCategory: string) => void;
  onDeleteCostCategory: (categoryToDelete: string) => void;
  onAddMaintenanceRecord: (data: Omit<MaintenanceRecord, 'id'>) => void;
  onUpdateMaintenanceRecord: (id: number, data: Partial<Omit<MaintenanceRecord, 'id'>>) => void;
  onDeleteMaintenanceRecord: (id: number) => void;
}

export type Tab = 'overview' | 'voyage' | 'fuel' | 'costs' | 'maintenance';

export const TABS_CONFIG = [
  { id: 'overview', label: 'Tổng quan', icon: ClipboardDocumentListIcon },
  { id: 'voyage', label: 'Hành trình', icon: MapPinIcon },
  { id: 'fuel', label: 'Nhiên liệu', icon: GaugeIcon },
  { id: 'costs', label: 'Chi phí', icon: CurrencyDollarIcon },
  { id: 'maintenance', label: 'Bảo trì', icon: WrenchScrewdriverIcon },
];

const ShipDetails: React.FC<ShipDetailsProps> = (props) => {
  const { ship, trips, voyages, fuelLogs, costs, maintenanceRecords, onUpdateShip } = props;
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPanel ship={ship} onUpdateShip={onUpdateShip} />;
      case 'voyage':
        return <VoyagePanel 
                  shipId={ship.id}
                  trips={trips}
                  voyages={voyages} 
                  onAddTrip={props.onAddTrip}
                  onUpdateTrip={props.onUpdateTrip}
                  onDeleteTrip={props.onDeleteTrip}
                  onAddVoyage={props.onAddVoyage}
                  onUpdateVoyage={props.onUpdateVoyage}
                  onDeleteVoyage={props.onDeleteVoyage}
                />;
      case 'fuel':
        return <FuelPanel
                  shipId={ship.id}
                  fuelLogs={fuelLogs}
                  onAdd={props.onAddFuelLog}
                  onUpdate={props.onUpdateFuelLog}
                  onDelete={props.onDeleteFuelLog}
                />;
      case 'costs':
        return <CostPanel 
                  shipId={ship.id}
                  costs={costs} 
                  trips={trips}
                  onAdd={props.onAddCost}
                  onUpdate={props.onUpdateCost}
                  onDelete={props.onDeleteCost}
                  costCategories={props.costCategories}
                  onAddCategory={props.onAddCostCategory}
                  onUpdateCategory={props.onUpdateCostCategory}
                  onDeleteCategory={props.onDeleteCostCategory}
                />;
      case 'maintenance':
        return <MaintenancePanel
                  shipId={ship.id}
                  maintenanceRecords={maintenanceRecords} 
                  onAdd={props.onAddMaintenanceRecord}
                  onUpdate={props.onUpdateMaintenanceRecord}
                  onDelete={props.onDeleteMaintenanceRecord}
                />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 sm:p-6 flex-1 overflow-y-auto pb-24"> {/* Add padding-bottom for nav bar */}
        {renderContent()}
      </div>
      <BottomNavBar activeTab={activeTab} onTabClick={setActiveTab} />
    </div>
  );
};

export default ShipDetails;