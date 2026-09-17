import React, { useState } from 'react';
import { ParkingFacility } from '../types';
import { calculateTripCost } from '../data/parkingData';

interface RateBreakdownModalProps {
  facility: ParkingFacility | null;
  onClose: () => void;
  onNavigate: (facility: ParkingFacility) => void;
}

export const RateBreakdownModal: React.FC<RateBreakdownModalProps> = ({
  facility,
  onClose,
  onNavigate
}) => {
  const [hours, setHours] = useState<number>(2.5);

  if (!facility) return null;

  const cost = calculateTripCost(facility, hours, 'total');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-[#1E293B] border border-[#3f4850]/50 rounded-2xl p-6 shadow-2xl flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-[#93ccff] uppercase tracking-wider">
                Official Tariff Breakdown
              </span>
              {(facility.category || facility.tariff.category) && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#2563EB]/20 text-[#93ccff] border border-[#2563EB]/40">
                  {facility.category || facility.tariff.category}
                </span>
              )}
            </div>
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-[#F8FAFC]">
              {facility.name}
            </h3>
            <p className="text-xs text-[#94A3B8]">{facility.address}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#222a3d] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Dynamic Duration Simulator Slider */}
        <div className="p-4 rounded-xl bg-[#060e20] border border-[#3f4850]/30 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#dae2fd]">
              Simulate Parking Duration:
            </span>
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-[#93ccff]">
              {hours} Hours
            </span>
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
          <div className="flex items-center justify-between text-[11px] text-[#94A3B8] pt-1">
            <span>Estimated Total:</span>
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-[#4edea3]">
              ${cost.total.toFixed(2)} SGD
            </span>
          </div>
        </div>

        {/* Tariff Rules Table */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
              Schedule of Charges (Updated Rates)
            </span>
            <span className="text-[10px] text-[#4edea3] font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">verified</span>
              Verified Rates
            </span>
          </div>
          <div className="rounded-xl bg-[#131b2e] border border-[#3f4850]/30 divide-y divide-[#3f4850]/30 text-xs">
            <div className="p-3 flex justify-between items-start gap-4">
              <span className="text-[#dae2fd] font-medium min-w-[130px]">Weekdays (Day / 1st Period)</span>
              <span className="text-[#F8FAFC] font-semibold text-right">
                {facility.tariff.weekdaysRate1 || facility.tariff.peakDayRate}
              </span>
            </div>
            <div className="p-3 flex justify-between items-start gap-4">
              <span className="text-[#dae2fd] font-medium min-w-[130px]">Weekdays (Evening / 2nd Period)</span>
              <span className="text-[#F8FAFC] font-semibold text-right">
                {facility.tariff.weekdaysRate2 && facility.tariff.weekdaysRate2 !== '-'
                  ? facility.tariff.weekdaysRate2
                  : facility.tariff.offPeakRate}
              </span>
            </div>
            <div className="p-3 flex justify-between items-start gap-4">
              <span className="text-[#dae2fd] font-medium min-w-[130px]">Saturday Rate</span>
              <span className="text-[#F8FAFC] font-semibold text-right">
                {facility.tariff.saturdayRate && facility.tariff.saturdayRate !== '-'
                  ? facility.tariff.saturdayRate
                  : facility.tariff.weekendRate}
              </span>
            </div>
            <div className="p-3 flex justify-between items-start gap-4">
              <span className="text-[#dae2fd] font-medium min-w-[130px]">Sunday & Public Holidays</span>
              <span className="text-[#F8FAFC] font-semibold text-right">
                {facility.tariff.sundayPublicHolidayRate && facility.tariff.sundayPublicHolidayRate !== '-'
                  ? facility.tariff.sundayPublicHolidayRate
                  : facility.tariff.weekendRate}
              </span>
            </div>
            <div className="p-3 flex justify-between items-center">
              <span className="text-[#dae2fd] font-medium">Grace Period</span>
              <span className="text-[#4edea3] font-semibold">
                {facility.tariff.gracePeriodMins > 0
                  ? `${facility.tariff.gracePeriodMins} minutes complimentary`
                  : 'No grace period (Immediate charging)'}
              </span>
            </div>
            <div className="p-3 flex justify-between items-center">
              <span className="text-[#dae2fd] font-medium">Height Clearance Limit</span>
              <span className="text-[#F8FAFC] font-semibold">
                {facility.heightLimit || 'No restriction (Open air)'}
              </span>
            </div>
          </div>
        </div>

        {/* EV & ERP info */}
        {facility.evChargers && (
          <div className="p-3 rounded-xl bg-[#4edea3]/10 border border-[#4edea3]/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4edea3] text-[18px]">
                electric_bolt
              </span>
              <div>
                <p className="font-bold text-[#F8FAFC]">EV Charging Available</p>
                <p className="text-[11px] text-[#bfc7d2]">
                  {facility.evChargers.count}x {facility.evChargers.powerKw}kW ({facility.evChargers.type})
                </p>
              </div>
            </div>
            <span className="px-2 py-1 rounded bg-[#00a572] text-[#00311f] font-bold text-[11px]">
              {facility.evChargers.available} Available
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-[#171f33] hover:bg-[#222a3d] text-[#dae2fd] text-xs font-semibold transition-colors border border-[#3f4850]/40"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onNavigate(facility);
            }}
            className="flex-1 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#3198dc] text-[#F8FAFC] text-xs font-bold transition-colors shadow-lg flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">turn_right</span>
            <span>Direct Navigation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
