import React, { useState } from 'react';
import { ParkingFacility } from '../types';

interface NavigationModalProps {
  facility: ParkingFacility | null;
  onClose: () => void;
}

export const NavigationModal: React.FC<NavigationModalProps> = ({ facility, onClose }) => {
  const [navigating, setNavigating] = useState(false);

  if (!facility) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#1E293B] border border-[#3f4850]/50 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Top Header */}
        <div className="p-4 bg-[#131b2e] border-b border-[#3f4850]/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#93ccff] text-[22px]">
              turn_right
            </span>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-[#F8FAFC]">
                Direct Turn-by-Turn Navigation
              </h3>
              <p className="text-[11px] text-[#94A3B8]">{facility.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#222a3d] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Live Route Guidance Card */}
        <div className="p-5 flex flex-col gap-4">
          <div className="p-3.5 rounded-xl bg-[#060e20] border border-[#3f4850]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-[#F8FAFC] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[24px]">turn_left</span>
              </div>
              <div>
                <p className="text-xs font-bold text-[#F8FAFC]">
                  In 120m, turn left onto Marina Boulevard
                </p>
                <p className="text-[11px] text-[#94A3B8]">
                  Keep to the right 2 lanes for Basement 1 Carpark Entry
                </p>
              </div>
            </div>
            <span className="px-2 py-1 rounded bg-[#4edea3]/20 text-[#4edea3] text-[11px] font-bold">
              3 min walk
            </span>
          </div>

          {/* Gantry Image or Live Bay Snapshot */}
          <div className="h-32 rounded-xl overflow-hidden relative bg-[#060e20] border border-[#3f4850]/30">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyW0gcGrAbeyiIWKXHmPwNRMFQK3gsoKmA-LtV_hqocn13pXxRBb3OXTzTCYQseK2VoJ5tWm4GOi2OFZdi7iPSUBYtNVX6hqHBXj3uxQBHjEr3SUrydJLMs5qGidyaM5lhKTA_q5XKpto0vy2u7mwquvr0U0KkZ9Ced4BvSVq9BoHdtwgj3z4aBAdBhWUmy5QXQiSgY4FHUhfs8z-EESJAx1fdS3RDaM5xSkGNru2E4FBKYSoo-m-K"
              alt="Carpark Entrance"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3">
              <div className="flex items-center justify-between w-full">
                <span className="text-[11px] text-[#F8FAFC] font-semibold">
                  Car Park Gantry • Height {facility.heightLimit || '2.1m'}
                </span>
                <span className="text-[11px] text-[#4edea3] font-bold">
                  {facility.availableLots} Bays Available
                </span>
              </div>
            </div>
          </div>

          {/* Real-time stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-[#131b2e] border border-[#3f4850]/20">
              <span className="text-[10px] text-[#94A3B8]">Drive ETA</span>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-[#F8FAFC]">
                4 mins
              </p>
            </div>
            <div className="p-2 rounded-lg bg-[#131b2e] border border-[#3f4850]/20">
              <span className="text-[10px] text-[#94A3B8]">Walk to Venue</span>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-[#93ccff]">
                {facility.walkMinutes} mins
              </p>
            </div>
            <div className="p-2 rounded-lg bg-[#131b2e] border border-[#3f4850]/20">
              <span className="text-[10px] text-[#94A3B8]">ERP Charge</span>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-[#4edea3]">
                $0.00 (Sync)
              </p>
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={() => {
                setNavigating(true);
                setTimeout(() => {
                  setNavigating(false);
                  onClose();
                }, 1200);
              }}
              className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#3198dc] text-[#F8FAFC] font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <span className="material-symbols-outlined text-[18px]">
                {navigating ? 'navigation' : 'play_arrow'}
              </span>
              <span>{navigating ? 'Starting Voice Guidance...' : 'Start Route Guidance'}</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  facility.name + ' ' + facility.address
                )}`}
                target="_blank"
                rel="noreferrer"
                className="py-2 rounded-xl bg-[#171f33] hover:bg-[#222a3d] text-[#dae2fd] text-center text-xs font-semibold transition-colors border border-[#3f4850]/30 flex items-center justify-center gap-1.5"
              >
                <span>Google Maps</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
              <a
                href={`https://waze.com/ul?q=${encodeURIComponent(
                  facility.name + ' ' + facility.address
                )}`}
                target="_blank"
                rel="noreferrer"
                className="py-2 rounded-xl bg-[#171f33] hover:bg-[#222a3d] text-[#dae2fd] text-center text-xs font-semibold transition-colors border border-[#3f4850]/30 flex items-center justify-center gap-1.5"
              >
                <span>Waze</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
