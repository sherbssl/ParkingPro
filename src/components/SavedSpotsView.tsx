import React from 'react';
import { ParkingFacility } from '../types';
import { FacilityCard } from './FacilityCard';

interface SavedSpotsViewProps {
  savedFacilities: ParkingFacility[];
  durationHours: number;
  onSelectFacility: (facility: ParkingFacility) => void;
  onToggleSave: (facilityId: string) => void;
  onNavigate: (facility: ParkingFacility) => void;
  onShare: (facility: ParkingFacility) => void;
  onBackToMap: () => void;
}

export const SavedSpotsView: React.FC<SavedSpotsViewProps> = ({
  savedFacilities,
  durationHours,
  onSelectFacility,
  onToggleSave,
  onNavigate,
  onShare,
  onBackToMap
}) => {
  return (
    <div className="w-full h-[calc(100vh-64px)] overflow-y-auto p-4 md:p-8 bg-[#0b1326] flex flex-col items-center">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#3f4850]/40 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToMap}
              className="p-2 rounded-xl bg-[#171f33] hover:bg-[#222a3d] text-[#93ccff] transition-colors border border-[#3f4850]/30"
              title="Return to map"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div>
              <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl md:text-2xl font-bold text-[#F8FAFC]">
                Saved Car Parks & Favorites
              </h1>
              <p className="text-xs text-[#94A3B8]">
                Quick access to your preferred Marina Bay and CBD parking spaces with live bay tracking.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#3198dc]/20 text-[#93ccff] text-xs font-bold border border-[#3198dc]/30">
            {savedFacilities.length} Saved
          </span>
        </div>

        {/* List of Saved Facilities */}
        {savedFacilities.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#171f33]/60 border border-[#3f4850]/30 flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-5xl text-[#3f4850]">
              bookmark_border
            </span>
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-bold text-[#dae2fd]">
              No Saved Car Parks Yet
            </h3>
            <p className="text-xs text-[#94A3B8] max-w-md">
              Tap the bookmark icon on any facility card in the Live Map Explorer to add it to your
              quick-access favorites.
            </p>
            <button
              onClick={onBackToMap}
              className="mt-2 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#3198dc] text-[#F8FAFC] text-xs font-bold transition-colors shadow-lg"
            >
              Explore Live Parking Map
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedFacilities.map((fac) => (
              <FacilityCard
                key={fac.id}
                facility={fac}
                isSelected={false}
                isSaved={true}
                durationHours={durationHours}
                costMode="total"
                onSelect={onSelectFacility}
                onToggleSave={onToggleSave}
                onNavigate={onNavigate}
                onShare={onShare}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
