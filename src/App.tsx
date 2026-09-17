/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ParkingFacility, SortCategory, ViewMode, LtaCarParkRecord, LtaFeedStatus } from './types';
import { PARKING_FACILITIES } from './data/parkingData';
import { Header } from './components/Header';
import { DestinationRadiusController } from './components/DestinationRadiusController';
import { MinimalistParkingList } from './components/MinimalistParkingList';
import { InteractiveMap } from './components/InteractiveMap';
import { NavigationModal } from './components/NavigationModal';
import { ProReservationModal } from './components/ProReservationModal';
import { ProExpenseReportModal } from './components/ProExpenseReportModal';
import { LtaConnectionModal } from './components/LtaConnectionModal';

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
  const [showLtaModal, setShowLtaModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // LTA DataMall Serverless Stream State
  const [ltaRecords, setLtaRecords] = useState<LtaCarParkRecord[]>([]);
  const [ltaStatus, setLtaStatus] = useState<LtaFeedStatus>({
    connected: false,
    source: 'cache',
    total: 0,
    lastUpdated: null,
    loading: false,
    error: null
  });

  // Custom coordinate override when user clicks map
  const [customCoord, setCustomCoord] = useState<{ x: number; y: number } | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  }, []);

  // Fetch live lots from serverless LTA DataMall endpoint
  const fetchLtaFeed = useCallback(async (forceRefresh = false) => {
    setLtaStatus((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch(`/api/lta/carparks${forceRefresh ? '?refresh=true' : ''}`);
      const data = await res.json();
      if (data.value && Array.isArray(data.value)) {
        setLtaRecords(data.value);
        setLtaStatus({
          connected: true,
          source: data.source || 'live_lta',
          total: data.total || data.value.length,
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          loading: false,
          error: data.warning || null
        });
        if (forceRefresh) {
          showToast(`Synced ${data.value.length} car parks from LTA DataMall (HDB, LTA & URA)`);
        }
      } else {
        setLtaStatus((prev) => ({ ...prev, loading: false, error: 'Empty response' }));
      }
    } catch (err: any) {
      setLtaStatus((prev) => ({
        ...prev,
        loading: false,
        error: err.message
      }));
    }
  }, [showToast]);

  // Initial load & periodic poll of LTA DataMall feed
  useEffect(() => {
    fetchLtaFeed();
    const timer = setInterval(() => {
      fetchLtaFeed();
    }, 60000);
    return () => clearInterval(timer);
  }, [fetchLtaFeed]);

  // Merge LTA DataMall live lots into base PARKING_FACILITIES
  const mergedFacilities = useMemo(() => {
    if (!ltaRecords || ltaRecords.length === 0) {
      return PARKING_FACILITIES;
    }

    const ltaMap = new Map<string, LtaCarParkRecord>();
    ltaRecords.forEach((rec) => {
      if (rec.Development) {
        ltaMap.set(rec.Development.toLowerCase().trim(), rec);
        const cleanName = rec.Development.toLowerCase().replace(/[^a-z0-9]/g, '');
        ltaMap.set(cleanName, rec);
      }
    });

    const updatedBase = PARKING_FACILITIES.map((fac) => {
      const facNameLower = fac.name.toLowerCase();
      const facClean = facNameLower.replace(/[^a-z0-9]/g, '');

      let matched: LtaCarParkRecord | undefined;
      for (const [key, rec] of ltaMap.entries()) {
        if (
          facNameLower.includes(key) ||
          key.includes(facNameLower) ||
          facClean.includes(key) ||
          key.includes(facClean)
        ) {
          matched = rec;
          break;
        }
      }

      if (matched) {
        const availableLots = matched.AvailableLots;
        const status =
          availableLots < 15 ? 'limited' : availableLots < 40 ? 'filling_fast' : 'available';
        return {
          ...fac,
          availableLots,
          status,
          agency: matched.Agency
        };
      }

      return fac;
    });

    // Also include additional HDB & URA car parks from the LTA feed
    const additionalFacilities: ParkingFacility[] = [];
    const usedIds = new Set(updatedBase.map((f) => f.id));

    ltaRecords.forEach((rec, idx) => {
      const isAlreadyIncluded = updatedBase.some(
        (f) =>
          f.name.toLowerCase().includes(rec.Development.toLowerCase()) ||
          rec.Development.toLowerCase().includes(f.name.toLowerCase())
      );

      if (!isAlreadyIncluded && (rec.Agency === 'HDB' || rec.Agency === 'URA')) {
        let coords = { x: 260 + ((idx * 37) % 350), y: 320 + ((idx * 29) % 240) };
        if (rec.Location) {
          const parts = rec.Location.split(' ');
          if (parts.length === 2) {
            const lat = parseFloat(parts[0]);
            const lng = parseFloat(parts[1]);
            if (!isNaN(lat) && !isNaN(lng)) {
              const normX = Math.min(1, Math.max(0, (lng - 103.84) / (103.87 - 103.84)));
              const normY = Math.min(1, Math.max(0, (1.305 - lat) / (1.305 - 1.27)));
              coords = {
                x: Math.round(180 + normX * 640),
                y: Math.round(100 + normY * 460)
              };
            }
          }
        }

        const id = `lta-${rec.Agency.toLowerCase()}-${rec.CarParkID || idx}`;
        if (!usedIds.has(id)) {
          usedIds.add(id);
          const availableLots = rec.AvailableLots;
          const status =
            availableLots < 15 ? 'limited' : availableLots < 40 ? 'filling_fast' : 'available';
          const isHdb = rec.Agency === 'HDB';

          additionalFacilities.push({
            id,
            name: rec.Development,
            address: `${rec.Area || 'Central'}, Singapore`,
            subTitle: `${rec.Agency} Public Facility • Code: ${rec.CarParkID}`,
            type: isHdb ? 'building' : 'street',
            walkMeters: 480,
            walkMinutes: 6,
            availableLots,
            totalLots: Math.max(availableLots, isHdb ? 180 : 60),
            status,
            imageUrl: isHdb
              ? 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80'
              : 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80',
            isIndoor: isHdb,
            heightLimit: isHdb ? '2.15m' : undefined,
            hasCctv: true,
            hasValet: false,
            tariff: {
              peakDayRate: isHdb ? '$0.60 / 30 mins' : '$1.20 / 30 mins',
              offPeakRate: isHdb ? '$0.60 / 30 mins' : '$1.20 / 30 mins',
              eveningRate: isHdb ? '$5.00 night cap' : '$0.60 / 30 mins',
              weekendRate: isHdb ? 'Free Sun 07:00-22:30' : '$1.20 / 30 mins',
              gracePeriodMins: 10,
              heightLimitM: isHdb ? 2.15 : 4.0,
              ratePerHalfHourDay: isHdb ? 0.60 : 1.20,
              ratePerHalfHourEvening: isHdb ? 0.60 : 0.60
            },
            mapPinId: id,
            coords,
            features: [rec.Agency, 'Electronic Parking System (EPS)', 'Grace Period 10m'],
            agency: rec.Agency,
            forecastProbability: Math.min(95, Math.max(45, Math.round((availableLots / 100) * 80 + 20)))
          });
        }
      }
    });

    return [...updatedBase, ...additionalFacilities];
  }, [ltaRecords]);

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
    return mergedFacilities.map((fac) => {
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
  }, [mergedFacilities, destCoords, etaMinutes]);

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
      {/* 1. Header with Mode Switcher (Standard vs. PRO ⚡) & LTA Connection status */}
      <Header
        isProMode={isProMode}
        onTogglePro={handleTogglePro}
        onReset={handleReset}
        ltaStatus={ltaStatus}
        onOpenLtaModal={() => setShowLtaModal(true)}
        onRefreshLta={() => fetchLtaFeed(true)}
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
            ltaStatus={ltaStatus}
            onOpenLtaModal={() => setShowLtaModal(true)}
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

      {/* LTA DataMall Serverless Connection Diagnostics Modal */}
      {showLtaModal && (
        <LtaConnectionModal
          status={ltaStatus}
          onClose={() => setShowLtaModal(false)}
          onRefresh={() => fetchLtaFeed(true)}
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
