import React from 'react';
import { ViewMode } from '../types';

interface DestinationRadiusControllerProps {
  destination: string;
  setDestination: (dest: string) => void;
  radiusMeters: number;
  setRadiusMeters: (radius: number) => void;
  matchCount: number;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isProMode: boolean;
  etaMinutes: number;
  setEtaMinutes: (mins: number) => void;
  vehicleHeightLimit: number | null;
  setVehicleHeightLimit: (h: number | null) => void;
  evFastOnly: boolean;
  setEvFastOnly: (ev: boolean) => void;
  onOpenExpenseExport: () => void;
  onLocateMe: () => void;
}

const PRESET_DESTINATIONS = [
  'Marina Bay Sands',
  'Raffles Place',
  'Suntec City',
  'Gardens by the Bay',
  'City Hall',
  'Tanjong Pagar'
];

const RADIUS_PRESETS = [250, 500, 1000, 1500, 2000];
const ETA_PRESETS = [0, 15, 30, 45, 60];

export const DestinationRadiusController: React.FC<DestinationRadiusControllerProps> = ({
  destination,
  setDestination,
  radiusMeters,
  setRadiusMeters,
  matchCount,
  viewMode,
  setViewMode,
  isProMode,
  etaMinutes,
  setEtaMinutes,
  vehicleHeightLimit,
  setVehicleHeightLimit,
  evFastOnly,
  setEvFastOnly,
  onOpenExpenseExport,
  onLocateMe
}) => {
  return (
    <div className="w-full bg-[#11192e] border-b border-[#25324d] px-4 py-3.5 md:px-6 shadow-xl transition-all">
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        {/* Main Bar: Destination Input & View Mode Toggles */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 justify-between">
          {/* Destination Input Box */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#f43f5e] text-[22px] pointer-events-none">
              location_on
            </span>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Key in destination (e.g. Marina Bay Sands, Raffles Place, Suntec City...)"
              className="w-full bg-[#09101f] border border-[#2d3a56] focus:border-[#38bdf8] rounded-xl pl-11 pr-24 py-2.5 text-sm text-[#F8FAFC] placeholder-[#64748B] outline-none transition-all shadow-inner font-medium"
            />
            {destination && (
              <button
                onClick={() => setDestination('')}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC] p-1 rounded-md transition-colors"
                title="Clear destination"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
            <button
              onClick={onLocateMe}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-[#38bdf8] transition-colors"
              title="Use my current GPS location"
            >
              <span className="material-symbols-outlined text-[18px]">my_location</span>
            </button>
          </div>

          {/* Quick Landmark Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[11px] text-[#94A3B8] font-medium hidden xl:inline mr-1">
              Suggestions:
            </span>
            {PRESET_DESTINATIONS.map((preset) => (
              <button
                key={preset}
                onClick={() => setDestination(preset)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  destination.toLowerCase().includes(preset.toLowerCase())
                    ? 'bg-[#f43f5e] text-[#ffffff] shadow-sm'
                    : 'bg-[#1e293b] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#283548] border border-[#334155]/60'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* View Mode Segmented Controls (Ensure user can view Map full screen or split!) */}
          <div className="flex items-center self-end lg:self-auto gap-1 bg-[#09101f] p-1 rounded-xl border border-[#2d3a56]">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'split'
                  ? 'bg-[#38bdf8] text-[#0f172a] shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
              title="Split View (List + Map side by side)"
            >
              <span className="material-symbols-outlined text-[16px]">vertical_split</span>
              <span className="hidden sm:inline">Split</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'map'
                  ? 'bg-[#38bdf8] text-[#0f172a] shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
              title="Full Map View (See destination on map)"
            >
              <span className="material-symbols-outlined text-[16px]">map</span>
              <span>Map View</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'list'
                  ? 'bg-[#38bdf8] text-[#0f172a] shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
              title="List Only View"
            >
              <span className="material-symbols-outlined text-[16px]">format_list_bulleted</span>
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>

        {/* Radius Range Row (0 - 2000m) */}
        <div className="bg-[#09101f] border border-[#2d3a56] rounded-xl px-4 py-3 flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#38bdf8] text-[20px]">
                radar
              </span>
              <span className="text-xs font-semibold text-[#94A3B8]">
                Search Radius:
              </span>
              <span className="text-sm md:text-base font-extrabold text-[#38bdf8] font-['Plus_Jakarta_Sans',sans-serif]">
                {radiusMeters.toLocaleString()} m
              </span>
              <span className="text-xs text-[#64748B]">
                ({(radiusMeters / 1000).toFixed(2)} km from keyed destination)
              </span>
            </div>

            {/* Quick Radius Jump Buttons */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/30 text-xs font-semibold">
                {matchCount} {matchCount === 1 ? 'location' : 'locations'} available
              </span>
              <div className="hidden sm:flex items-center gap-1">
                {RADIUS_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setRadiusMeters(preset)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      radiusMeters === preset
                        ? 'bg-[#38bdf8] text-[#0f172a]'
                        : 'bg-[#1e293b] text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                  >
                    {preset >= 1000 ? `${preset / 1000}km` : `${preset}m`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Slider (0 to 2000m) */}
          <div className="flex flex-col gap-1">
            <input
              type="range"
              min={0}
              max={2000}
              step={25}
              value={radiusMeters}
              onChange={(e) => setRadiusMeters(Number(e.target.value))}
              className="w-full h-2 bg-[#1e293b] rounded-lg appearance-none cursor-pointer accent-[#38bdf8]"
            />
            <div className="flex justify-between text-[10px] text-[#64748B] px-0.5 font-bold">
              <span>0m</span>
              <span>500m</span>
              <span>1,000m</span>
              <span>1,500m</span>
              <span>2,000m</span>
            </div>
          </div>
        </div>

        {/* Pro Telemetry Controls (Rendered when PRO Mode is toggled) */}
        {isProMode && (
          <div className="bg-gradient-to-r from-[#1c1917] via-[#1a1c2e] to-[#0f172a] border border-amber-500/40 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
            {/* Arrival Time ETA Forecasting */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-black text-[11px] border border-amber-500/30 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">psychology</span>
                <span>AI Bay Forecast:</span>
              </span>
              <span className="text-xs text-[#94A3B8]">Arriving in:</span>
              <div className="flex items-center gap-1">
                {ETA_PRESETS.map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setEtaMinutes(mins)}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                      etaMinutes === mins
                        ? 'bg-amber-400 text-[#0f172a]'
                        : 'bg-[#1e293b] text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                  >
                    {mins === 0 ? 'Now' : `+${mins}m`}
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Height & Fast EV Charging */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 text-xs">
                <span className="text-[#94A3B8]">Clearance:</span>
                <select
                  value={vehicleHeightLimit ?? ''}
                  onChange={(e) =>
                    setVehicleHeightLimit(e.target.value ? Number(e.target.value) : null)
                  }
                  className="bg-[#09101f] border border-amber-500/40 text-amber-300 rounded-lg px-2 py-1 text-xs font-semibold outline-none"
                >
                  <option value="">Any Height</option>
                  <option value="1.9">SUV ≤ 1.9m</option>
                  <option value="2.0">MPV ≤ 2.0m</option>
                  <option value="2.1">Van ≤ 2.1m</option>
                </select>
              </div>

              <button
                onClick={() => setEvFastOnly(!evFastOnly)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border ${
                  evFastOnly
                    ? 'bg-[#10b981] text-[#0f172a] border-[#10b981]'
                    : 'bg-[#1e293b] text-[#94A3B8] border-[#334155]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">electric_bolt</span>
                <span>DC Fast EV</span>
              </button>

              <button
                onClick={onOpenExpenseExport}
                className="px-3 py-1 rounded-lg bg-[#2563eb] hover:bg-[#38bdf8] hover:text-[#0f172a] text-white text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
              >
                <span className="material-symbols-outlined text-[14px]">receipt_long</span>
                <span>Tax Invoice Export</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
