import React from 'react';
import { FilterCategory, RadiusOption, CostDisplayMode, SortCategory } from '../types';

interface SearchAndFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  radius: RadiusOption;
  setRadius: (radius: RadiusOption) => void;
  filter: FilterCategory;
  setFilter: (filter: FilterCategory) => void;
  sort: SortCategory;
  setSort: (sort: SortCategory) => void;
  costMode: CostDisplayMode;
  setCostMode: (mode: CostDisplayMode) => void;
  entryTime: string;
  setEntryTime: (time: string) => void;
  exitTime: string;
  setExitTime: (time: string) => void;
  durationHours: number;
  setDurationHours: (hrs: number) => void;
  onLocateMe: () => void;
  carParkCounts: {
    all: number;
    building: number;
    street: number;
    ev: number;
  };
}

export const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  radius,
  setRadius,
  filter,
  setFilter,
  sort,
  setSort,
  costMode,
  setCostMode,
  entryTime,
  setEntryTime,
  exitTime,
  setExitTime,
  durationHours,
  setDurationHours,
  onLocateMe,
  carParkCounts
}) => {
  const handleQuickDuration = (hrs: number) => {
    setDurationHours(hrs);
    // Parse entry time and add hrs
    const [h, m] = entryTime.split(':').map(Number);
    if (!isNaN(h) && !isNaN(m)) {
      const totalMinutes = h * 60 + m + Math.round(hrs * 60);
      const newH = Math.floor((totalMinutes / 60) % 24);
      const newM = totalMinutes % 60;
      setExitTime(`${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`);
    }
  };

  const formatDurationText = (hrs: number) => {
    const wholeHours = Math.floor(hrs);
    const mins = Math.round((hrs - wholeHours) * 60);
    if (mins === 0) {
      return `${wholeHours} hr${wholeHours !== 1 ? 's' : ''} 00 mins`;
    }
    return `${wholeHours} hr${wholeHours !== 1 ? 's' : ''} ${mins} mins`;
  };

  return (
    <section className="w-full bg-[#1E293B]/90 backdrop-blur-md px-4 md:px-6 py-2.5 z-30 shadow-lg flex flex-col gap-2.5 border-b border-[#3f4850]/40">
      {/* Row 1: Search, Radius & Direct Metrics */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search Input Box */}
        <div className="flex-1 min-w-[280px] max-w-2xl relative flex items-center bg-[#060e20] rounded-xl px-3.5 py-1.5 shadow-inner border border-[#3f4850]/30 focus-within:border-[#3198dc]/80">
          <span className="material-symbols-outlined text-[#93ccff] text-[22px] mr-2 shrink-0">
            location_on
          </span>
          <div className="flex-1 flex flex-col justify-center min-w-0">
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
              Destination / Postal Code
            </span>
            <input
              className="bg-transparent text-[#F8FAFC] text-sm font-semibold outline-none placeholder-[#94A3B8] w-full truncate"
              id="destination-input"
              placeholder="Search venue, postal code, or landmark..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1 pl-2">
            {searchQuery && (
              <button
                className="p-1 hover:bg-[#222a3d] rounded-full text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                onClick={() => setSearchQuery('')}
                title="Clear search"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
            <button
              onClick={onLocateMe}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#171f33] hover:bg-[#222a3d] text-[#93ccff] text-xs font-semibold transition-all shadow-sm border border-[#3f4850]/30"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">my_location</span>
              <span className="hidden sm:inline">Locate Me</span>
            </button>
          </div>
        </div>

        {/* Quick Radius Toggle */}
        <div className="flex items-center bg-[#060e20] rounded-xl p-1 shadow-inner border border-[#3f4850]/30 gap-1">
          <span className="text-xs text-[#94A3B8] px-2 font-medium">Radius:</span>
          {(['500m', '1.0 km', '1.5 km', '2.0 km'] as RadiusOption[]).map((r) => (
            <button
              key={r}
              onClick={() => setRadius(r)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                radius === r
                  ? 'bg-[#3198dc] text-[#002c47] shadow-sm'
                  : 'text-[#bfc7d2] hover:text-[#dae2fd]'
              }`}
              type="button"
            >
              {r}
            </button>
          ))}
        </div>

        {/* Live Sync Indicator */}
        <div className="hidden xl:flex items-center gap-2.5 bg-[#060e20]/80 px-3 py-1.5 rounded-xl border border-[#3f4850]/30 shadow-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-[#4edea3] animate-pulse"></div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-[#F8FAFC]">URA & LTA Live API</span>
            <span className="text-[10px] text-[#94A3B8]">ERP 2.0 active sync</span>
          </div>
        </div>
      </div>

      {/* Row 2: Duration / Cost Estimator Tray */}
      <div className="w-full bg-[#131b2e] rounded-xl p-2.5 shadow-md flex flex-wrap items-center justify-between gap-3 border border-[#3f4850]/30">
        <div className="flex flex-wrap items-center gap-2.5 md:gap-3">
          {/* Date Trigger */}
          <div className="flex items-center gap-1.5 bg-[#060e20] px-2.5 py-1.5 rounded-lg shadow-sm border border-[#3f4850]/30 text-xs text-[#F8FAFC] font-semibold">
            <span className="material-symbols-outlined text-[#93ccff] text-[18px]">
              calendar_today
            </span>
            <span>Today, 24 Oct</span>
          </div>

          {/* Entry / Exit Pickers */}
          <div className="flex items-center gap-1.5 bg-[#060e20] px-2.5 py-1 rounded-lg shadow-sm border border-[#3f4850]/30">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-[#94A3B8] leading-none uppercase">Entry</span>
              <input
                className="bg-transparent font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#F8FAFC] w-12 outline-none font-bold"
                type="text"
                value={entryTime}
                onChange={(e) => setEntryTime(e.target.value)}
              />
            </div>
            <span className="text-[#94A3B8] font-bold px-1">→</span>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-[#94A3B8] leading-none uppercase">Exit</span>
              <input
                className="bg-transparent font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#F8FAFC] w-12 outline-none font-bold"
                type="text"
                value={exitTime}
                onChange={(e) => setExitTime(e.target.value)}
              />
            </div>
          </div>

          {/* Calculated Duration Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#222a3d] text-[#93ccff] shadow-sm border border-[#3198dc]/30">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            <span className="text-xs font-bold font-['Plus_Jakarta_Sans',sans-serif]">
              {formatDurationText(durationHours)}
            </span>
          </div>

          {/* Quick Duration Adders */}
          <div className="hidden sm:flex items-center gap-1 bg-[#060e20]/60 p-1 rounded-lg border border-[#3f4850]/20">
            {[
              { label: '+1 hr', hrs: 1 },
              { label: '+2.5 hrs', hrs: 2.5 },
              { label: '+4 hrs', hrs: 4 },
              { label: 'Half Day (6h)', hrs: 6 }
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={() => handleQuickDuration(btn.hrs)}
                className={`px-2 py-0.5 rounded text-xs font-semibold transition-all ${
                  durationHours === btn.hrs
                    ? 'bg-[#222a3d] text-[#93ccff] shadow-sm'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#222a3d]/50'
                }`}
                type="button"
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price Mode Toggle: Total Trip vs Base Hourly */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#94A3B8]">Display Cost:</span>
          <div className="flex items-center bg-[#060e20] p-1 rounded-lg shadow-inner border border-[#3f4850]/30">
            <button
              onClick={() => setCostMode('total')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                costMode === 'total'
                  ? 'bg-[#00a572] text-[#00311f] shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
              type="button"
            >
              Calculated Total
            </button>
            <button
              onClick={() => setCostMode('hourly')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                costMode === 'hourly'
                  ? 'bg-[#00a572] text-[#00311f] shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
              type="button"
            >
              Hourly Base
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: Quick Filter Tabs & Sorting Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 max-w-full">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm whitespace-nowrap transition-all ${
              filter === 'all'
                ? 'bg-[#3198dc] text-[#002c47]'
                : 'bg-[#171f33] hover:bg-[#222a3d] text-[#dae2fd] border border-[#3f4850]/40'
            }`}
            type="button"
          >
            <span>All Car Parks</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                filter === 'all'
                  ? 'bg-[#002c47]/20 text-[#002c47]'
                  : 'bg-[#2d3449] text-[#94A3B8]'
              }`}
            >
              {carParkCounts.all}
            </span>
          </button>

          <button
            onClick={() => setFilter('building')}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm whitespace-nowrap transition-all ${
              filter === 'building'
                ? 'bg-[#3198dc] text-[#002c47]'
                : 'bg-[#171f33] hover:bg-[#222a3d] text-[#dae2fd] border border-[#3f4850]/40'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[15px]">apartment</span>
            <span>Multi-Storey / Building</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                filter === 'building'
                  ? 'bg-[#002c47]/20 text-[#002c47]'
                  : 'bg-[#2d3449] text-[#94A3B8]'
              }`}
            >
              {carParkCounts.building}
            </span>
          </button>

          <button
            onClick={() => setFilter('street')}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm whitespace-nowrap transition-all ${
              filter === 'street'
                ? 'bg-[#3198dc] text-[#002c47]'
                : 'bg-[#171f33] hover:bg-[#222a3d] text-[#dae2fd] border border-[#3f4850]/40'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[15px]">edit_road</span>
            <span>Street / Kerbside</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                filter === 'street'
                  ? 'bg-[#002c47]/20 text-[#002c47]'
                  : 'bg-[#2d3449] text-[#94A3B8]'
              }`}
            >
              {carParkCounts.street}
            </span>
          </button>

          <button
            onClick={() => setFilter('ev')}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm whitespace-nowrap transition-all ${
              filter === 'ev'
                ? 'bg-[#3198dc] text-[#002c47]'
                : 'bg-[#171f33] hover:bg-[#222a3d] text-[#dae2fd] border border-[#3f4850]/40'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[15px] text-[#4edea3]">electric_bolt</span>
            <span>EV Charging</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                filter === 'ev'
                  ? 'bg-[#002c47]/20 text-[#002c47]'
                  : 'bg-[#4edea3]/20 text-[#4edea3]'
              }`}
            >
              {carParkCounts.ev}
            </span>
          </button>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-[#94A3B8]">Sort:</span>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortCategory)}
              aria-label="Sort car parks"
              className="bg-[#060e20] text-[#F8FAFC] text-xs font-semibold px-3 py-1.5 rounded-lg outline-none cursor-pointer shadow-sm pr-8 border border-[#3f4850]/30 appearance-none hover:border-[#3198dc]"
            >
              <option value="distance">Shortest Walk (Distance)</option>
              <option value="price">Cheapest Rate (Total Cost)</option>
              <option value="lots">Most Available Lots</option>
              <option value="ev">EV Ready First</option>
            </select>
            <span className="material-symbols-outlined text-[#94A3B8] text-[16px] absolute right-2 top-2 pointer-events-none">
              expand_more
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
