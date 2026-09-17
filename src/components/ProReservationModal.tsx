import React, { useState, useEffect } from 'react';
import { ParkingFacility } from '../types';

interface ProReservationModalProps {
  facility: ParkingFacility;
  onClose: () => void;
  onConfirm: (bayNumber: string, vehiclePlate: string) => void;
}

export const ProReservationModal: React.FC<ProReservationModalProps> = ({
  facility,
  onClose,
  onConfirm
}) => {
  const [vehiclePlate, setVehiclePlate] = useState('SLA 8821 X');
  const [selectedBay, setSelectedBay] = useState('B2 - 48 (Near Lift Lobby B)');
  const [reserved, setReserved] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

  useEffect(() => {
    let timer: any;
    if (reserved && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [reserved, timeLeft]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleConfirmReservation = () => {
    setReserved(true);
    onConfirm(selectedBay, vehiclePlate);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#0f172a] border border-[#38bdf8]/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Pro Header */}
        <div className="p-4 bg-[#1e293b] border-b border-[#334155] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-gradient-to-r from-amber-400 to-amber-600 text-[#0f172a] text-[11px] font-black uppercase tracking-wider">
              PRO ⚡
            </span>
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-[#F8FAFC]">
              {reserved ? 'Active Bay Reservation Pass' : 'Guaranteed Bay Hold (15-min)'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#334155] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4 text-xs">
          {!reserved ? (
            <>
              <div className="p-3.5 rounded-xl bg-[#1e293b]/70 border border-[#334155] flex flex-col gap-1.5">
                <span className="text-[10px] text-[#94A3B8] uppercase font-semibold">
                  Designated Facility
                </span>
                <p className="text-sm font-bold text-[#F8FAFC]">{facility.name}</p>
                <p className="text-[#94A3B8]">{facility.address}</p>
              </div>

              {/* Vehicle IU / Plate Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-[#94A3B8]">
                  Vehicle Plate & IU Synchronization:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                    className="w-full bg-[#09101f] border border-[#334155] rounded-xl px-3.5 py-2.5 text-sm text-[#F8FAFC] uppercase font-bold tracking-wider outline-none focus:border-[#38bdf8]"
                    placeholder="SLA 1234 A"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#34d399] font-bold">
                    ✓ IU LINKED
                  </span>
                </div>
              </div>

              {/* Bay Allocation Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-[#94A3B8]">
                  Select Guaranteed Bay:
                </label>
                <select
                  value={selectedBay}
                  onChange={(e) => setSelectedBay(e.target.value)}
                  className="w-full bg-[#09101f] border border-[#334155] rounded-xl px-3.5 py-2.5 text-xs text-[#F8FAFC] outline-none focus:border-[#38bdf8]"
                >
                  <option value="B2 - 48 (Near Lift Lobby B)">B2 - 48 (Closest to Lift Lobby B)</option>
                  <option value="B2 - 12 (Wide Bay / EV Adjacent)">B2 - 12 (Wide Bay / 2.2m Width)</option>
                  <option value="B1 - 04 (Express Exit Lane)">B1 - 04 (Direct Express Exit Lane)</option>
                </select>
              </div>

              {/* Perks list */}
              <div className="p-3 rounded-xl bg-[#09101f] border border-[#334155] flex flex-col gap-1 text-[11px] text-[#94A3B8]">
                <div className="flex items-center gap-1.5 text-[#34d399]">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Automatic boom gantry camera recognition</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#34d399]">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>15-minute grace period held exclusively for your IU</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#38bdf8]">
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  <span>Included with ParkPulse PRO subscription</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-[#1e293b] hover:bg-[#334155] text-[#94A3B8] font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReservation}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#0f172a] font-extrabold shadow-lg transition-all"
                >
                  Lock Bay for 15 Mins
                </button>
              </div>
            </>
          ) : (
            /* Active QR Digital Pass */
            <div className="flex flex-col items-center gap-4 text-center py-2">
              <div className="px-3 py-1 rounded-full bg-[#10b981]/20 border border-[#10b981]/40 text-[#34d399] font-bold text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping"></span>
                <span>BAY HELD: {formatTime(timeLeft)} REMAINING</span>
              </div>

              {/* Simulated QR Code */}
              <div className="p-4 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center">
                <div className="w-40 h-40 bg-[#0f172a] p-2 rounded-xl flex flex-col justify-between items-center relative">
                  {/* QR Pattern visual */}
                  <div className="w-full h-full border-4 border-dashed border-[#38bdf8] flex items-center justify-center flex-col">
                    <span className="material-symbols-outlined text-4xl text-[#38bdf8]">qr_code_2</span>
                    <span className="text-[9px] text-white tracking-widest font-mono mt-1">
                      IU-{vehiclePlate.replace(/\s+/g, '')}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-700 font-bold mt-2">
                  Scan at Entrance Gantry or Drive in
                </span>
              </div>

              <div className="w-full p-3 rounded-xl bg-[#1e293b] border border-[#334155] text-left">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-[#94A3B8]">Reserved Bay:</span>
                  <span className="font-bold text-[#38bdf8] text-xs">{selectedBay}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-[#94A3B8]">Vehicle Plate:</span>
                  <span className="font-bold text-[#F8FAFC] text-xs">{vehiclePlate}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-[#38bdf8] hover:bg-[#7dd3fc] text-[#0f172a] font-bold transition-all shadow-md"
              >
                Done / Back to Map
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
