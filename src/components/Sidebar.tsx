import React from 'react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  savedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  savedCount
}) => {
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 md:w-72 bg-[#1E293B]/95 backdrop-blur-xl border-r border-[#3f4850]/40 z-40 flex flex-col justify-between shadow-[4px_0_24px_rgba(0,0,0,0.3)] select-none">
      <div className="flex flex-col h-full overflow-y-auto p-4 gap-4">
        {/* Navigation Console Header & Current District */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
            Navigation Console
          </span>
          <div className="p-2.5 rounded-xl bg-[#060e20] border border-[#3f4850]/40 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#3198dc]/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#93ccff] text-[20px]">
                near_me
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#dae2fd] truncate">
                Singapore Central
              </p>
              <p className="text-[11px] text-[#94A3B8] truncate">
                1,420 Live Bays Indexed
              </p>
            </div>
          </div>
        </div>

        {/* Navigation items list */}
        <nav className="flex flex-col gap-1">
          <button
            onClick={() => onSelectTab('live-map')}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'live-map'
                ? 'bg-[#3198dc] text-[#002c47] shadow-[0_2px_8px_rgba(49,152,220,0.3)]'
                : 'text-[#bfc7d2] hover:bg-[#222a3d] hover:text-[#dae2fd]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px]">explore</span>
              <span>Live Map Explorer</span>
            </div>
            {activeTab === 'live-map' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#002c47]"></span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('calculator')}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'calculator'
                ? 'bg-[#3198dc] text-[#002c47] shadow-[0_2px_8px_rgba(49,152,220,0.3)]'
                : 'text-[#bfc7d2] hover:bg-[#222a3d] hover:text-[#dae2fd]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px]">calculate</span>
              <span>Duration Calculator</span>
            </div>
          </button>

          <button
            onClick={() => onSelectTab('saved')}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'saved'
                ? 'bg-[#3198dc] text-[#002c47] shadow-[0_2px_8px_rgba(49,152,220,0.3)]'
                : 'text-[#bfc7d2] hover:bg-[#222a3d] hover:text-[#dae2fd]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px]">bookmark</span>
              <span>Saved Car Parks</span>
            </div>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#222a3d] text-[10px] text-[#93ccff] font-bold">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('ev')}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'ev'
                ? 'bg-[#3198dc] text-[#002c47] shadow-[0_2px_8px_rgba(49,152,220,0.3)]'
                : 'text-[#bfc7d2] hover:bg-[#222a3d] hover:text-[#dae2fd]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-[#4edea3]">
                ev_station
              </span>
              <span>EV Charging Hubs</span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-[#4edea3]/20 text-[#4edea3] text-[10px] font-bold">
              6
            </span>
          </button>

          <button
            onClick={() => onSelectTab('season')}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'season'
                ? 'bg-[#3198dc] text-[#002c47] shadow-[0_2px_8px_rgba(49,152,220,0.3)]'
                : 'text-[#bfc7d2] hover:bg-[#222a3d] hover:text-[#dae2fd]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px]">event_repeat</span>
              <span>Season Parking</span>
            </div>
          </button>
        </nav>

        {/* Live ERP 2.0 Telemetry Status footer */}
        <div className="mt-auto p-3 rounded-xl bg-[#131b2e] border border-[#3f4850]/30 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#94A3B8]">ERP 2.0 Telemetry</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4edea3] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4edea3]"></span>
            </span>
          </div>
          <p className="text-[12px] text-[#bfc7d2] leading-relaxed">
            Real-time LTA feeds connected. Peak surcharges sync active.
          </p>
        </div>
      </div>
    </aside>
  );
};
