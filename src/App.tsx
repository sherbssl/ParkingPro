/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ParkingFacility, SortCategory, ViewMode } from './types';
import { PARKING_FACILITIES } from './data/parkingData';
import { Header } from './components/Header';
import { DestinationRadiusController } from './components/DestinationRadiusController';
import { MinimalistParkingList } from './components/MinimalistParkingList';
import { InteractiveMap } from './components/InteractiveMap';
import { NavigationModal } from './components/NavigationModal';
import { ProReservationModal } from './components/ProReservationModal';
import { ProExpenseReportModal } from './components/ProExpenseReportModal';

// Landmark coordinate lookup on SVG canvas (1000x700)
const LANDMARK_COORDS: Record<string, { x: number; y: number; label: string }> = {
  'marina bay sands': { x: 670, y: 260, label: 'Marina Bay Sands' },
  'mbs': { x: 670, y: 260, label: 'Marina Bay Sands' },
  'raffles place': { x: 290, y: 320, label: 'Raffles Place' },
  'suntec': { x: 610, y: 110, label: 'Suntec City' },
  'gardens by the bay': { x: 840, y: 440, label: 'Gardens by the Bay' },
  'city hall': { x: 420, y: 120, label: 'City Hall' },
  'tanjong pagar': { x: 180, y: 540, label: 'Tanjong Pagar' },
  'orchard': { x: 220, y: 140, label: 'Orchard Road' },
  'bugis': { x: 500, y: 90, label: 'Bugis Junction' },
  'chinatown': { x: 220, y: 420, label: 'Chinatown' },
  'clarke quay': { x: 320, y: 240, label: 'Clarke Quay' },
  'mbfc': { x: 360, y: 410, label: 'Marina Bay Financial Centre' },
  'national gallery': { x: 380, y: 210, label: 'National Gallery Singapore' }
};

export default function App() {
  // Destination & Radius State (0 - 2000m)
  const [destination, setDestination] = useState<string>('Marina Bay Sands');
  const [radiusMeters, setRadiusMeters] = useState<number>(1000);
  const [sort, setSort] = useState<SortCategory>('distance');
  const [viewMode, setViewMode] = useState<ViewMode>('split');

  // Pro Version Features State
  const [isProMode, setIsProMode] = useState<boolean>(false);
  const [etaMinutes, setEtaMinutes] = useState<number>(15);
  const [vehicleHeightLimit, setVehicleHeightLimit] = useState<number | null>(null);
  const [evFastOnly, setEvFastOnly] = useState<boolean>(false);

  // Modals & Selected Facility
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('pin-mbfc');
  const [navigationFacility, setNavigationFacility] = useState<ParkingFacility | null>(null);
  const [reservationFacility, setReservationFacility] = useState<ParkingFacility | null>(null);
  const [showExpenseModal, setShowExpenseModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Custom coordinate override when user clicks map
  const [customCoord, setCustomCoord] = useState<{ x: number; y: number } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Determine destination coordinates on canvas
  const destCoords = useMemo(() => {
    if (customCoord) return customCoord;

    const query = destination.toLowerCase().trim();
    for (const key of Object.keys(LANDMARK_COORDS)) {
      if (query.includes(key)) {
        return { x: LANDMARK_COORDS[key].x, y: LANDMARK_COORDS[key].y };
      }
    }

    // Pseudo-hash coordinate for custom user-keyed address
    if (query.length > 0) {
      let hash = 0;
      for (let i = 0; i < query.length; i++) {
        hash = (hash << 5) - hash + query.charCodeAt(i);
      }
      const pseudoX = 300 + Math.abs(hash % 380);
      const pseudoY = 200 + Math.abs((hash >> 3) % 300);
      return { x: pseudoX, y: pseudoY };
    }

    return { x: 500, y: 320 }; // default central bay point
  }, [destination, customCoord]);

  // Recalculate relative distances based on destination coordinates
  const facilitiesWithDistances = useMemo(() => {
    return PARKING_FACILITIES.map((fac) => {
      // Euclidean distance in SVG coordinates converted to real meters
      const dx = fac.coords.x - destCoords.x;
      const dy = fac.coords.y - destCoords.y;
      const pixelDist = Math.sqrt(dx * dx + dy * dy);
      // Map ~420px to 2000m (ratio: ~4.76m per px)
      const calculatedMeters = Math.round(pixelDist * 4.76);
      const walkMeters = Math.max(120, calculatedMeters);
      const walkMinutes = Math.max(2, Math.round(walkMeters / 75)); // average 75m/min walking pace

      // Dynamic AI Arrival Probability based on ETA minutes
      const baseProb = fac.forecastProbability || 80;
      // Slight decay with farther ETA
      const adjustedProb = Math.min(99, Math.max(35, Math.round(baseProb - (etaMinutes * 0.2))));

      return {
        ...fac,
        walkMeters,
        walkMinutes,
        forecastProbability: adjustedProb
      };
    });
  }, [destCoords, etaMinutes]);

  // Filter facilities by radius & Pro filters (vehicle height & EV)
  const availableFacilities = useMemo(() => {
    return facilitiesWithDistances
      .filter((fac) => {
        // Distance within selected radius (0 - 2000m)
        if (fac.walkMeters > radiusMeters) return false;

        // Pro Filter: Vehicle Height Limit
        if (isProMode && vehicleHeightLimit !== null) {
          if (fac.tariff.heightLimitM && fac.tariff.heightLimitM < vehicleHeightLimit) {
            return false;
          }
        }

        // Pro Filter: DC Fast EV Charging
        if (isProMode && evFastOnly) {
          if (!fac.evChargers || fac.evChargers.powerKw < 50 || fac.evChargers.available === 0) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sort === 'distance') return a.walkMeters - b.walkMeters;
        if (sort === 'lots') return b.availableLots - a.availableLots;
        if (sort === 'price') {
          return a.tariff.ratePerHalfHourDay - b.tariff.ratePerHalfHourDay;
        }
        if (sort === 'forecast') {
          return (b.forecastProbability || 0) - (a.forecastProbability || 0);
        }
        return 0;
      });
  }, [facilitiesWithDistances, radiusMeters, sort, isProMode, vehicleHeightLimit, evFastOnly]);

  // Active selected facility
  const selectedFacility = useMemo(() => {
    return (
      availableFacilities.find((f) => f.id === selectedFacilityId) ||
      availableFacilities[0] ||
      null
    );
  }, [availableFacilities, selectedFacilityId]);

  // Handle click on map to reposition destination pin
  const handleMapClickSetDestination = (coords: { x: number; y: number }) => {
    setCustomCoord(coords);
    const newDest = `Pinned Location (${coords.x}, ${coords.y})`;
    setDestination(newDest);
    showToast(`Keyed destination relocated to pin (${coords.x}, ${coords.y})`);
  };

  const handleDestinationChange = (newDest: string) => {
    setCustomCoord(null);
    setDestination(newDest);
  };

  const handleReset = () => {
    setCustomCoord(null);
    setDestination('Marina Bay Sands');
    setRadiusMeters(1000);
    setSort('distance');
    setSelectedFacilityId('pin-mbfc');
    setVehicleHeightLimit(null);
    setEvFastOnly(false);
    showToast('Reset to default destination (Marina Bay Sands) & 1,000m radius');
  };

  const handleLocateMe = () => {
    setCustomCoord(null);
    setDestination('Marina Bay Sands (GPS Located)');
    showToast('GPS: Pinned to Marina Bay Sands, Singapore');
  };

  const handleTogglePro = () => {
    const next = !isProMode;
    setIsProMode(next);
    if (next) {
      showToast('⚡ ParkPulse PRO activated: AI Forecasting & ERP 2.0 enabled');
    } else {
      showToast('Switched to Standard Minimalist mode');
    }
  };

  return (
    <div className="bg-[#0b1326] min-h-screen flex flex-col text-[#dae2fd] font-['Inter',sans-serif] selection:bg-[#38bdf8] selection:text-[#0f172a] overflow-hidden">
      {/* 1. Header with Mode Switcher (Standard vs. PRO ⚡) */}
      <Header
        isProMode={isProMode}
        onTogglePro={handleTogglePro}
        onReset={handleReset}
      />

      {/* 2. Destination Input, View Switcher & 0-2000m Radius Controller */}
      <DestinationRadiusController
        destination={destination}
        setDestination={handleDestinationChange}
        radiusMeters={radiusMeters}
        setRadiusMeters={setRadiusMeters}
        matchCount={availableFacilities.length}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isProMode={isProMode}
        etaMinutes={etaMinutes}
        setEtaMinutes={setEtaMinutes}
        vehicleHeightLimit={vehicleHeightLimit}
        setVehicleHeightLimit={setVehicleHeightLimit}
        evFastOnly={evFastOnly}
        setEvFastOnly={setEvFastOnly}
        onOpenExpenseExport={() => setShowExpenseModal(true)}
        onLocateMe={handleLocateMe}
      />

      {/* 3. Main Body: Split View / Map View / List View */}
      <main className="flex-1 w-full flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Column: Available Parking Locations within Radius (Hidden if Map View is selected) */}
        {viewMode !== 'map' && (
          <MinimalistParkingList
            facilities={availableFacilities}
            radiusMeters={radiusMeters}
            destination={destination}
            selectedFacilityId={selectedFacility?.id || ''}
            sort={sort}
            setSort={setSort}
            isProMode={isProMode}
            etaMinutes={etaMinutes}
            onSelectFacility={(fac) => setSelectedFacilityId(fac.id)}
            onNavigate={(fac) => setNavigationFacility(fac)}
            onExpandRadius={(meters) => setRadiusMeters(meters)}
            onOpenReservation={(fac) => setReservationFacility(fac)}
          />
        )}

        {/* Right Column: Interactive Vector Map clearly showing the Keyed-In Destination and Radius */}
        {viewMode !== 'list' && (
          <InteractiveMap
            facilities={availableFacilities}
            selectedFacility={selectedFacility}
            destination={destination}
            radiusMeters={radiusMeters}
            destCoords={destCoords}
            isProMode={isProMode}
            etaMinutes={etaMinutes}
            onSelectFacility={(fac) => setSelectedFacilityId(fac.id)}
            onNavigate={(fac) => setNavigationFacility(fac)}
            onMapClickSetDestination={handleMapClickSetDestination}
            onOpenReservation={(fac) => setReservationFacility(fac)}
          />
        )}
      </main>

      {/* Navigation Modal */}
      {navigationFacility && (
        <NavigationModal
          facility={navigationFacility}
          onClose={() => setNavigationFacility(null)}
        />
      )}

      {/* Pro Guaranteed Bay Reservation Pass Modal */}
      {reservationFacility && (
        <ProReservationModal
          facility={reservationFacility}
          onClose={() => setReservationFacility(null)}
          onConfirm={(bay, plate) => {
            showToast(`Bay ${bay} locked for vehicle ${plate}!`);
          }}
        />
      )}

      {/* Pro Corporate Tax Invoice & Expense Export Modal */}
      {showExpenseModal && (
        <ProExpenseReportModal
          facilities={availableFacilities}
          destination={destination}
          onClose={() => setShowExpenseModal(false)}
        />
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f172a]/95 text-[#F8FAFC] border border-[#38bdf8]/50 px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs font-semibold animate-slideUp">
          <span className="material-symbols-outlined text-[#38bdf8] text-[18px]">
            info
          </span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
