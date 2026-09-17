import React from 'react';
import { ParkingFacility, SortCategory, LtaFeedStatus } from '../types';

interface MinimalistParkingListProps {
  facilities: ParkingFacility[];
  radiusMeters: number;
  destination: string;
  selectedFacilityId: string;
  sort: SortCategory;
  setSort: (sort: SortCategory) => void;
  isProMode: boolean;
  etaMinutes: number;
  ltaStatus?: LtaFeedStatus;
  onOpenLtaModal?: () => void;
  onSelectFacility: (facility: ParkingFacility) => void;
  onNavigate: (facility: ParkingFacility) => void;
  onExpandRadius: (meters: number) => void;
  onOpenReservation?: (facility: ParkingFacility) => void;
}

export const MinimalistParkingList: React.FC<MinimalistParkingListProps> = ({
  facilities,
  radiusMeters,
  destination,
  selectedFacilityId,
  sort,
  setSort,
  isProMode,
  etaMinutes,
  ltaStatus,
  onOpenLtaModal,
  onSelectFacility,
  onNavigate,
  onExpandRadius,
  onOpenReservation
}) => {
  return (
    <div className="w-full lg:w-[420px] xl:w-[460px] h-full flex flex-col bg-[#0b1326] border-r border-[#25324d] overflow-hidden">
      {/* Header Bar */}
      <div className="p-3.5 border-b border-[#25324d] bg-[#0f192e] flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#F8FAFC] font-['Plus_Jakarta_Sans',sans-serif]">
            Available Locations ({facilities.length})
          </h2>
          <p className="text-[11px] text-[#94A3B8] truncate max-w-[200px]">
            Within {radiusMeters.toLocaleString()}m of {destination || 'Destination'}
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-1 bg-[#09101f] p-1 rounded-lg border border-[#25324d]">
          <button
            onClick={() => setSort('distance')}
            className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
              sort === 'distance'
                ? 'bg-[#38bdf8] text-[#0f172a]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
            title="Sort by nearest distance"
          >
            Nearest
          </button>
          <button
            onClick={() => setSort('price')}
            className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
              sort === 'price'
                ? 'bg-[#38bdf8] text-[#0f172a]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
            title="Sort by lowest rate"
          >
            Price
          </button>
          <button
            onClick={() => setSort('lots')}
            className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
              sort === 'lots'
                ? 'bg-[#38bdf8] text-[#0f172a]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
            title="Sort by most available lots"
          >
            Lots
          </button>
          {isProMode && (
            <button
              onClick={() => setSort('forecast')}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                sort === 'forecast'
                  ? 'bg-amber-400 text-[#0f172a]'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
              title="Sort by highest AI forecast probability"
            >
              Forecast
            </button>
          )}
        </div>
      </div>

      {/* LTA DataMall Live Feed Banner */}
      {ltaStatus && (
        <div
          onClick={onOpenLtaModal}
          className="px-3.5 py-1.5 bg-[#0d162b] border-b border-[#202e48] flex items-center justify-between text-[11px] text-[#94A3B8] cursor-pointer hover:bg-[#121f3a] transition-colors"
        >
          <div className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                ltaStatus.connected ? 'bg-[#10b981]' : 'bg-[#f59e0b]'
              }`}
            />
            <span className="font-semibold text-[#cbd5e1]">LTA CarParkAvailabilityv2:</span>
            <span className="text-[#38bdf8] font-mono">{ltaStatus.total} lots streamed</span>
          </div>
          <span className="text-[10px] text-[#64748B] flex items-center gap-0.5 hover:text-[#38bdf8]">
            <span>Feed Info</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
          </span>
        </div>
      )}

      {/* Facilities List Container */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
        {facilities.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#1e293b] flex items-center justify-center text-[#38bdf8] mb-3">
              <span className="material-symbols-outlined text-[28px]">search_off</span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-bold text-[#F8FAFC]">
              No Parking Within {radiusMeters}m
            </h3>
            <p className="text-xs text-[#94A3B8] mt-1.5 max-w-xs leading-relaxed">
              No car parks found within this radius of {destination || 'keyed destination'}. Expand the radius slider up to 2,000m to discover nearby locations.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => onExpandRadius(500)}
                className="px-3.5 py-2 rounded-xl bg-[#1e293b] hover:bg-[#334155] text-xs font-semibold text-[#38bdf8] border border-[#38bdf8]/30 transition-all"
              >
                Try 500m
              </button>
              <button
                onClick={() => onExpandRadius(1000)}
                className="px-3.5 py-2 rounded-xl bg-[#38bdf8] hover:bg-[#7dd3fc] text-xs font-bold text-[#0f172a] transition-all shadow-md"
              >
                Expand to 1,000m
              </button>
            </div>
          </div>
        ) : (
          facilities.map((fac) => {
            const isSelected = fac.id === selectedFacilityId;

            // Status color configuration
            let lotBadgeColor = 'bg-[#10b981]/15 text-[#34d399] border-[#10b981]/30';
            if (fac.availableLots < 15) {
              lotBadgeColor = 'bg-[#ef4444]/15 text-[#f87171] border-[#ef4444]/30';
            } else if (fac.availableLots < 40) {
              lotBadgeColor = 'bg-[#f59e0b]/15 text-[#fbbf24] border-[#f59e0b]/30';
            }

            return (
              <div
                key={fac.id}
                onClick={() => onSelectFacility(fac)}
                className={`p-3.5 rounded-xl transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#1a2744] border-[#38bdf8] shadow-md shadow-[#38bdf8]/10'
                    : 'bg-[#10192d] hover:bg-[#15223c] border-[#25324d]/80'
                }`}
              >
                {/* Top: Distance + Agency Badge + Available Lots + Pro Probability */}
                <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-[#38bdf8]/15 text-[#38bdf8] font-bold text-[11px] border border-[#38bdf8]/30">
                      {fac.walkMeters}m
                    </span>
                    <span className="text-[11px] text-[#94A3B8]">
                      • {fac.walkMinutes} min walk
                    </span>
                    {fac.agency && (
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-extrabold border ${
                        fac.agency === 'HDB'
                          ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                          : fac.agency === 'URA'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                      }`}>
                        {fac.agency}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isProMode && fac.forecastProbability && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-extrabold text-[10px] border border-amber-500/30">
                        {fac.forecastProbability}% prob (+{etaMinutes}m)
                      </span>
                    )}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1 ${lotBadgeColor}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {fac.availableLots} free
                    </span>
                  </div>
                </div>

                {/* Facility Name & Address */}
                <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-[#F8FAFC] line-clamp-1">
                  {fac.name}
                </h3>
                <p className="text-xs text-[#94A3B8] line-clamp-1 mt-0.5">
                  {fac.address}
                </p>

                {/* Pricing, ERP Toll, and Actions */}
                <div className="mt-3 pt-2.5 border-t border-[#25324d]/60 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-[#64748B] block uppercase font-semibold">
                      Tariff Rate
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs font-bold text-[#38bdf8]">
                        {fac.tariff.peakDayRate}
                      </span>
                      {isProMode && fac.erpGantryToll !== undefined && (
                        <span className="text-[10px] font-bold text-[#f59e0b]">
                          + ${fac.erpGantryToll.toFixed(2)} ERP
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isProMode && onOpenReservation && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenReservation(fac);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#0f172a] text-xs font-extrabold transition-all shadow-sm flex items-center gap-1"
                        title="Reserve a guaranteed bay for 15 minutes"
                      >
                        <span className="material-symbols-outlined text-[14px]">bolt</span>
                        <span>Hold</span>
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(fac);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#2563eb] hover:bg-[#38bdf8] hover:text-[#0f172a] text-[#F8FAFC] text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[14px]">navigation</span>
                      <span>Navigate</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
