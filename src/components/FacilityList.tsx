import React from 'react';
import { ParkingFacility, CostDisplayMode } from '../types';
import { FacilityCard } from './FacilityCard';

interface FacilityListProps {
  facilities: ParkingFacility[];
  totalAvailableInPrecinct: number;
  radius: string;
  selectedFacilityId: string;
  savedFacilityIds: string[];
  durationHours: number;
  costMode: CostDisplayMode;
  onSelectFacility: (facility: ParkingFacility) => void;
  onToggleSave: (facilityId: string) => void;
  onNavigate: (facility: ParkingFacility) => void;
  onShare: (facility: ParkingFacility) => void;
  onHoverPin?: (pinId: string | null) => void;
}

export const FacilityList: React.FC<FacilityListProps> = ({
  facilities,
  totalAvailableInPrecinct,
  radius,
  selectedFacilityId,
  savedFacilityIds,
  durationHours,
  costMode,
  onSelectFacility,
  onToggleSave,
  onNavigate,
  onShare,
  onHoverPin
}) => {
  const formatDurationText = (hrs: number) => {
    const wholeHours = Math.floor(hrs);
    const mins = Math.round((hrs - wholeHours) * 60);
    if (mins === 0) return `${wholeHours}h`;
    return `${wholeHours}h ${mins}m`;
  };

  return (
    <section className="w-full lg:w-[460px] xl:w-[490px] h-full overflow-y-auto bg-[#0b1326] flex flex-col p-4 gap-3.5 shrink-0 shadow-2xl z-20 border-r border-[#3f4850]/40">
      {/* List Meta Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <span className="font-['Plus_Jakarta_Sans',sans-serif] text-sm md:text-base text-[#F8FAFC] font-bold">
            Parking Results
          </span>
          <span className="px-2 py-0.5 rounded-md bg-[#222a3d] text-[#93ccff] text-[11px] font-bold border border-[#3198dc]/30">
            {facilities.length} displayed
          </span>
        </div>
        <span className="text-xs text-[#94A3B8]">
          Estimated for {formatDurationText(durationHours)}
        </span>
      </div>

      {/* Facility Cards List */}
      {facilities.length === 0 ? (
        <div className="p-8 text-center flex flex-col items-center justify-center text-[#94A3B8] gap-2">
          <span className="material-symbols-outlined text-4xl text-[#3f4850]">
            local_parking
          </span>
          <p className="text-sm font-semibold text-[#dae2fd]">No car parks found</p>
          <p className="text-xs text-[#94A3B8]">
            Try expanding your search radius or changing the active filter.
          </p>
        </div>
      ) : (
        facilities.map((fac) => (
          <FacilityCard
            key={fac.id}
            facility={fac}
            isSelected={selectedFacilityId === fac.id}
            isSaved={savedFacilityIds.includes(fac.id)}
            durationHours={durationHours}
            costMode={costMode}
            onSelect={onSelectFacility}
            onToggleSave={onToggleSave}
            onNavigate={onNavigate}
            onShare={onShare}
            onHoverPin={onHoverPin}
          />
        ))
      )}

      {/* Footer Info */}
      <div className="py-3 text-center text-[#94A3B8] text-xs">
        Showing {facilities.length} of {totalAvailableInPrecinct} parking facilities within {radius} radius.
      </div>
    </section>
  );
};
