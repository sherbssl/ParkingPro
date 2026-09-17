import React, { useState } from 'react';
import { ParkingFacility } from '../types';
import { calculateTripCost } from '../data/parkingData';

interface DurationCalculatorViewProps {
  facilities: ParkingFacility[];
  initialHours: number;
  onNavigate: (facility: ParkingFacility) => void;
  onBackToMap: () => void;
}

export const DurationCalculatorView: React.FC<DurationCalculatorViewProps> = ({
  facilities,
  initialHours,
  onNavigate,
  onBackToMap
}) => {
  const [hours, setHours] = useState<number>(initialHours || 2.5);

  const sortedByCost = [...facilities].sort((a, b) => {
    return calculateTripCost(a, hours).total - calculateTripCost(b, hours).total;
  });

  return (
    <div className="w-full h-[calc(100vh-64px)] overflow-y-auto p-4 md:p-8 bg-[#0b1326] flex flex-col items-center">
      <div className="w-full max-w-5xl flex flex-col gap-6">
        {/* Header */}
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
              <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl md:text-2xl font-bold text-[#F8FAFC]">
                Duration & Tariff Comparison Matrix
              </h1>
              <p className="text-xs text-[#94A3B8]">
                Adjust parking duration to compare calculated costs and identify the most cost-efficient car park in Marina Bay.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Duration Controller */}
        <div className="p-5 rounded-2xl bg-[#171f33] border border-[#3f4850]/30 shadow-xl flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
                Select Stay Duration
              </span>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold text-[#93ccff]">
                {hours} Hours ({Math.round(hours * 60)} minutes)
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-[#060e20] p-1.5 rounded-xl border border-[#3f4850]/30">
              {[1, 2, 2.5, 4, 6, 8, 12].map((h) => (
                <button
                  key={h}
                  onClick={() => setHours(h)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    hours === h
                      ? 'bg-[#3198dc] text-[#002c47] shadow-sm'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>
          </div>

          <input
            type="range"
            min="0.5"
            max="12"
            step="0.5"
            value={hours}
            onChange={(e) => setHours(parseFloat(e.target.value))}
            className="w-full accent-[#3198dc] cursor-pointer"
          />
        </div>

        {/* Comparison Table */}
        <div className="rounded-2xl bg-[#171f33] border border-[#3f4850]/30 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#131b2e] border-b border-[#3f4850]/40 text-[#94A3B8] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Facility & Location</th>
                  <th className="py-3.5 px-3 font-bold">Walk Distance</th>
                  <th className="py-3.5 px-3 font-bold">Standard Tariff</th>
                  <th className="py-3.5 px-3 font-bold">Live Bays</th>
                  <th className="py-3.5 px-4 font-bold text-right">Total Cost ({hours}h)</th>
                  <th className="py-3.5 px-4 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3f4850]/20 text-[#dae2fd]">
                {sortedByCost.map((fac, idx) => {
                  const cost = calculateTripCost(fac, hours, 'total');
                  const isBest = idx === 0;

                  return (
                    <tr
                      key={fac.id}
                      className={`hover:bg-[#222a3d]/50 transition-colors ${
                        isBest ? 'bg-[#00a572]/10' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          {isBest && (
                            <span className="px-1.5 py-0.5 rounded bg-[#00a572] text-[#00311f] text-[9px] font-extrabold uppercase">
                              Best Value
                            </span>
                          )}
                          <div>
                            <p className="font-bold text-[#F8FAFC]">{fac.name}</p>
                            <p className="text-[11px] text-[#94A3B8]">{fac.subTitle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="text-[#93ccff] font-semibold">{fac.walkMeters}m</span>
                        <span className="text-[#94A3B8] text-[11px]"> ({fac.walkMinutes} min)</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-medium text-[#F8FAFC]">
                          {fac.tariff.peakDayRate}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span
                          className={`font-bold ${
                            fac.status === 'filling_fast'
                              ? 'text-[#ffb95f]'
                              : fac.status === 'limited'
                              ? 'text-[#ef4444]'
                              : 'text-[#4edea3]'
                          }`}
                        >
                          {fac.availableLots} free
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-bold text-[#4edea3]">
                          ${cost.total.toFixed(2)}
                        </span>
                        <p className="text-[10px] text-[#94A3B8]">
                          (${cost.hourly.toFixed(2)}/hr)
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => onNavigate(fac)}
                          className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#3198dc] text-[#F8FAFC] text-[11px] font-bold transition-colors shadow-sm"
                        >
                          Navigate
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
