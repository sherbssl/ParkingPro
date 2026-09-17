import React from 'react';
import { ParkingFacility, CostDisplayMode } from '../types';
import { calculateTripCost } from '../data/parkingData';

interface FacilityCardProps {
  facility: ParkingFacility;
  isSelected: boolean;
  isSaved: boolean;
  durationHours: number;
  costMode: CostDisplayMode;
  onSelect: (facility: ParkingFacility) => void;
  onToggleSave: (facilityId: string) => void;
  onNavigate: (facility: ParkingFacility) => void;
  onShare: (facility: ParkingFacility) => void;
  onHoverPin?: (pinId: string | null) => void;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({
  facility,
  isSelected,
  isSaved,
  durationHours,
  costMode,
  onSelect,
  onToggleSave,
  onNavigate,
  onShare,
  onHoverPin
}) => {
  const costData = calculateTripCost(facility, durationHours, costMode);
  const displayCost = costMode === 'total' ? costData.total : costData.hourly;
  const occupancyPercentage = Math.min(
    100,
    Math.round(((facility.totalLots - facility.availableLots) / facility.totalLots) * 100)
  );

  return (
    <article
      onClick={() => onSelect(facility)}
      onMouseEnter={() => onHoverPin?.(facility.mapPinId)}
      onMouseLeave={() => onHoverPin?.(null)}
      className={`facility-card relative bg-[#171f33] rounded-xl p-4 flex flex-col gap-2.5 cursor-pointer transition-all duration-200 border ${
        isSelected
          ? 'ring-2 ring-[#2563EB] border-[#3198dc] bg-[#171f33] shadow-2xl scale-[1.01]'
          : 'border-[#3f4850]/30 hover:border-[#3198dc]/50 hover:bg-[#222a3d] shadow-lg'
      }`}
    >
      {/* Top row: Walking tag & Availability Badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#3198dc]/15 text-[#93ccff] text-[11px] font-bold">
          <span className="material-symbols-outlined text-[15px]">directions_walk</span>
          <span>{facility.walkMeters}m • {facility.walkMinutes} min walk</span>
        </div>

        {facility.isCheapest ? (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00a572] text-[#00311f] text-[11px] font-extrabold">
            <span className="material-symbols-outlined text-[13px]">savings</span>
            <span>Cheapest Choice</span>
          </div>
        ) : facility.status === 'available' ? (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#4edea3]/15 text-[#4edea3] text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-ping"></span>
            <span>{facility.availableLots} Lots Available</span>
          </div>
        ) : facility.status === 'filling_fast' ? (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ffb95f]/15 text-[#ffb95f] text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#ffb95f]"></span>
            <span>{facility.availableLots} Lots Remaining (Filling Fast)</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ef4444]/15 text-[#ef4444] text-[11px] font-bold">
            <span>{facility.availableLots} Lots Free</span>
          </div>
        )}
      </div>

      {/* Venue Title & Subtitle */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm md:text-base text-[#F8FAFC] font-bold leading-snug">
            {facility.name}
          </h3>
          <p className="text-xs text-[#94A3B8] mt-0.5">{facility.subTitle}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(facility.id);
          }}
          className="p-1 rounded-md text-[#94A3B8] hover:text-[#93ccff] transition-colors"
          title={isSaved ? 'Remove from saved' : 'Save this car park'}
        >
          <span
            className={`material-symbols-outlined text-[22px] ${
              isSaved ? 'text-[#2563EB]' : 'text-[#94A3B8]'
            }`}
          >
            {isSaved ? 'bookmark' : 'bookmark_border'}
          </span>
        </button>
      </div>

      {/* Optional Photo & Features strip (e.g. for MBFC and highlighted buildings) */}
      {facility.imageUrl ? (
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-1 h-20 rounded-lg overflow-hidden bg-[#060e20] shadow-sm relative">
            <img
              className="w-full h-full object-cover"
              alt={facility.name}
              src={facility.imageUrl}
            />
            {facility.isIndoor && (
              <span className="absolute bottom-1 right-1 px-1 bg-[#1E293B]/90 text-[#93ccff] rounded text-[9px] font-bold">
                Indoor
              </span>
            )}
          </div>
          <div className="col-span-2 flex flex-col justify-between py-0.5">
            <div className="flex flex-wrap gap-1">
              {facility.features.map((feat, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 ${
                    feat.includes('EV')
                      ? 'bg-[#4edea3]/15 text-[#4edea3]'
                      : feat.includes('Free')
                      ? 'bg-[#4edea3]/15 text-[#4edea3]'
                      : 'bg-[#222a3d] text-[#bfc7d2]'
                  }`}
                >
                  {feat.includes('EV') && (
                    <span className="material-symbols-outlined text-[12px]">ev_station</span>
                  )}
                  {feat.includes('Limit') && (
                    <span className="material-symbols-outlined text-[12px]">height</span>
                  )}
                  {feat}
                </span>
              ))}
            </div>

            {/* Occupancy bar */}
            <div className="w-full bg-[#060e20] h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full rounded-full ${
                  facility.status === 'filling_fast'
                    ? 'bg-[#ffb95f]'
                    : facility.status === 'limited'
                    ? 'bg-[#ef4444]'
                    : 'bg-[#4edea3]'
                }`}
                style={{ width: `${occupancyPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-1">
          {facility.features.map((feat, idx) => (
            <span
              key={idx}
              className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                feat.includes('Free')
                  ? 'bg-[#4edea3]/15 text-[#4edea3]'
                  : 'bg-[#131b2e] text-[#bfc7d2] border border-[#3f4850]/20'
              }`}
            >
              {feat}
            </span>
          ))}
        </div>
      )}

      {/* Rate Description & Calculated Cost Highlight */}
      <div className="flex items-end justify-between pt-1 bg-[#131b2e] p-2.5 rounded-lg border border-[#3f4850]/20">
        <div className="flex flex-col max-w-[65%]">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] text-[#94A3B8] font-medium">Updated Tariff</span>
            {(facility.category || facility.tariff.category) && (
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#2563EB]/20 text-[#93ccff]">
                {facility.category || facility.tariff.category}
              </span>
            )}
          </div>
          <span className="text-xs text-[#F8FAFC] font-semibold truncate" title={facility.tariff.weekdaysRate1 || facility.tariff.peakDayRate}>
            {facility.tariff.weekdaysRate1 || facility.tariff.peakDayRate}
          </span>
          <span className="text-[10px] text-[#94A3B8] truncate" title={facility.tariff.saturdayRate || facility.tariff.offPeakRate}>
            {facility.tariff.saturdayRate ? `Sat: ${facility.tariff.saturdayRate}` : facility.tariff.offPeakRate}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-semibold text-[#93ccff]">
            {costMode === 'total' ? `Total Trip Cost (${durationHours}h)` : 'Hourly Average'}
          </span>
          <span
            className={`font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold ${
              facility.isCheapest ? 'text-[#4edea3]' : 'text-[#F8FAFC]'
            }`}
          >
            ${displayCost.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Quick Action Triggers when active or selected */}
      {isSelected && (
        <div className="flex items-center gap-2 pt-1 animate-fadeIn">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(facility);
            }}
            className="flex-1 py-2 px-3 bg-[#2563EB] hover:bg-[#3198dc] text-[#F8FAFC] rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">turn_right</span>
            <span>Direct Navigation</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare(facility);
            }}
            className="p-2 bg-[#222a3d] hover:bg-[#2d3449] text-[#dae2fd] rounded-lg transition-colors border border-[#3f4850]/40"
            title="Share car park link"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">share</span>
          </button>
        </div>
      )}
    </article>
  );
};
