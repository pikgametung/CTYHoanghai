import React, { useState, useMemo, useEffect } from 'react';
import { useFleetData } from './hooks/useFleetData';
import Header from './components/Header';
import ShipDetails from './components/ShipDetails';
import AddShipModal from './components/AddShipModal';
import { Ship } from './types';
import ShipIcon from './components/icons/ShipIcon';

const App: React.FC = () => {
  const { 
    ships, trips, voyages, fuelLogs, costs, maintenance, costCategories, loading, 
    addShip, updateShip, deleteShip,
    addTrip, updateTrip, deleteTrip,
    addVoyage, updateVoyage, deleteVoyage,
    addFuelLog, updateFuelLog, deleteFuelLog,
    addCost, updateCost, deleteCost,
    addMaintenanceRecord, updateMaintenanceRecord, deleteMaintenanceRecord,
    addCostCategory, updateCostCategory, deleteCostCategory
  } = useFleetData();
  const [selectedShipId, setSelectedShipId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (!selectedShipId && ships.length > 0) {
      setSelectedShipId(ships[0].id);
    }
    if (selectedShipId && !ships.find(s => s.id === selectedShipId)) {
      setSelectedShipId(ships.length > 0 ? ships[0].id : null);
    }
    if (ships.length === 0) {
      setSelectedShipId(null);
    }
  }, [ships, selectedShipId]);

  const selectedShip = useMemo(() => {
    return ships.find(ship => ship.id === selectedShipId) || null;
  }, [ships, selectedShipId]);
  
  const handleAddShip = (newShipData: Omit<Ship, 'id' | 'status' | 'latitude' | 'longitude' | 'captain' | 'builtYear' | 'flag' | 'speed'>) => {
    addShip(newShipData);
    setIsAddModalOpen(false);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <svg className="animate-spin h-8 w-8 mr-3 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Đang tải dữ liệu đội tàu...
      </div>
    );
  }

  return (
    <>
      <div className="h-screen flex flex-col bg-gray-900 text-gray-200 font-sans">
        <Header 
          ships={ships}
          selectedShipId={selectedShipId}
          onSelectShip={setSelectedShipId}
          onAddShipClick={() => setIsAddModalOpen(true)}
          onDeleteShip={deleteShip}
          onUpdateShip={updateShip}
        />
        <main className="flex-1 overflow-y-auto">
          {selectedShip ? (
            <ShipDetails 
              ship={selectedShip}
              trips={trips.filter(t => t.shipId === selectedShip.id)}
              voyages={voyages.filter(v => v.shipId === selectedShip.id)}
              fuelLogs={fuelLogs.filter(f => f.shipId === selectedShip.id)}
              costs={costs.filter(c => c.shipId === selectedShip.id)}
              maintenanceRecords={maintenance.filter(m => m.shipId === selectedShip.id)}
              onUpdateShip={updateShip}
              onAddTrip={addTrip}
              onUpdateTrip={updateTrip}
              onDeleteTrip={deleteTrip}
              onAddVoyage={addVoyage}
              onUpdateVoyage={updateVoyage}
              onDeleteVoyage={deleteVoyage}
              onAddFuelLog={addFuelLog}
              onUpdateFuelLog={updateFuelLog}
              onDeleteFuelLog={deleteFuelLog}
              onAddCost={addCost}
              onUpdateCost={updateCost}
              onDeleteCost={deleteCost}
              costCategories={costCategories}
              onAddCostCategory={addCostCategory}
              onUpdateCostCategory={updateCostCategory}
              onDeleteCostCategory={deleteCostCategory}
              onAddMaintenanceRecord={addMaintenanceRecord}
              onUpdateMaintenanceRecord={updateMaintenanceRecord}
              onDeleteMaintenanceRecord={deleteMaintenanceRecord}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4 text-center">
              <ShipIcon className="w-24 h-24 mb-4" />
              <h2 className="text-2xl font-semibold">Không có tàu nào trong đội</h2>
              <p className="mt-2">Bắt đầu bằng cách thêm tàu đầu tiên của bạn vào hệ thống.</p>
               <button onClick={() => setIsAddModalOpen(true)} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors">
                Thêm tàu mới
              </button>
            </div>
          )}
        </main>
      </div>
      {isAddModalOpen && (
        <AddShipModal 
          onAddShip={handleAddShip} 
          onClose={() => setIsAddModalOpen(false)} 
        />
      )}
    </>
  );
};

export default App;