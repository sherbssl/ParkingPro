import React, { useState } from 'react';
import { ParkingFacility } from '../types';

interface EvChargingViewProps {
  facilities: ParkingFacility[];
  onNavigate: (facility: ParkingFacility) => void;
  onBackToMap: () => void;
}

export const EvChargingView: React.FC<EvChargingViewProps> = ({
  facilities,
  onNavigate,
  onBackToMap
}) => {
  const [speedFilter, setSpeedFilter] = useState<'all' | 'dc' | 'ac'>('all');

  const evFacilities = facilities.filter((f) => f.evChargers);

  const filteredEv = evFacilities.filter((f) => {
    if (speedFilter === 'dc') return (f.evChargers?.powerKw || 0) >= 50;
    if (speedFilter === 'ac') return (f.evChargers?.powerKw || 0) < 50;
    return true;
  });

  return (
    <div className="w-full h-[calc(100vh-64px)] overflow-y-auto p-4 md:p-8 bg-[#0b1326] flex flex-col items-center">
      <div className="w-full max-w-5xl flex flex-col gap-6">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#3f4850]/40 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToMap}
              className="p-2 rounded-xl bg-[#171f33] hover:bg-[#222a3d] text-[#93ccff] transition-colors border border-[#3f4850]/30"
              title="Return to map"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl md:text-2xl font-bold text-[#F8FAFC]">
                  EV Charging Hubs
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-[#4edea3]/20 text-[#4edea3] text-xs font-bold">
                  Live Telemetry
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Real-time plug availability and DC Fast charging stations in Singapore Downtown Core.
              </p>
            </div>
          </div>

          {/* Speed Filter */}
          <div className="flex items-center bg-[#060e20] p-1 rounded-xl border border-[#3f4850]/30">
            <button
              onClick={() => setSpeedFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                speedFilter === 'all'
                  ? 'bg-[#3198dc] text-[#002c47]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              All Speeds
            </button>
            <button
              onClick={() => setSpeedFilter('dc')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                speedFilter === 'dc'
                  ? 'bg-[#3198dc] text-[#002c47]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              DC Fast (50kW+)
            </button>
            <button
              onClick={() => setSpeedFilter('ac')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                speedFilter === 'ac'
                  ? 'bg-[#3198dc] text-[#002c47]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              AC Destination (22kW)
            </button>
          </div>
        </div>

        {/* EV Hub Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEv.map((fac) => {
            const ev = fac.evChargers!;
            return (
              <div
                key={fac.id}
                className="bg-[#171f33] border border-[#3f4850]/30 rounded-2xl p-4 shadow-xl flex flex-col justify-between gap-4 hover:border-[#4edea3]/50 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#4edea3]/15 text-[#4edea3] text-[11px] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">bolt</span>
                      {ev.powerKw}kW Fast Charging
                    </span>
                    <span className="text-xs font-bold text-[#F8FAFC]">
                      {ev.available} / {ev.count} Free
                    </span>
                  </div>

                  <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-bold text-[#F8FAFC] mt-2.5">
                    {fac.name}
                  </h3>
                  <p className="text-xs text-[#94A3B8]">{fac.subTitle}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#060e20] border border-[#3f4850]/20 flex flex-col gap-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Connector Standard:</span>
                    <span className="text-[#dae2fd] font-semibold">{ev.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Estimated Tariffs:</span>
                    <span className="text-[#4edea3] font-bold">~$0.62 / kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Height Limit:</span>
                    <span className="text-[#dae2fd]">{fac.heightLimit || '2.1m'}</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate(fac)}
                  className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#3198dc] text-[#F8FAFC] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md"
                >
                  <span className="material-symbols-outlined text-[16px]">navigation</span>
                  <span>Navigate to EV Bays</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
