import React from 'react';
import { LtaFeedStatus } from '../types';

interface HeaderProps {
  isProMode: boolean;
  onTogglePro: () => void;
  onReset: () => void;
  ltaStatus: LtaFeedStatus;
  onOpenLtaModal: () => void;
  onRefreshLta: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isProMode,
  onTogglePro,
  onReset,
  ltaStatus,
  onOpenLtaModal,
  onRefreshLta
}) => {
  return (
    <header className="w-full h-14 bg-[#091122] border-b border-[#25324d] px-3 md:px-6 flex items-center justify-between z-30 select-none">
      {/* Brand */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onReset}
          className="flex items-center gap-2 group text-left"
          title="Reset destination & radius"
        >
          <img
            alt="ParkPulse Logo"
            className="h-7 w-auto object-contain transition-transform group-hover:scale-105"
            src="https://lh3.googleusercontent.com/aida/AEtjO1U5IY66yV-nHEZObGLNRw4Nq5yMExOOixF-qCLM2ci6VaEX_7NXZm_tGuXOeV7PvgfInZW_HCDGpbVbsJV_REMSfhBesrTslLvN9NBM7rVrxJcW-0GdKWTi02EU8eQXjx5tZzoYgl20Klt8tRlRfmPx7NoAOv37SOHHgRwuoeSNfLB3L8wWkAyIZofWkeyqxAoHY_zgz1YH5L6nhbo2HY9NFfsPDjk0IkqKYiu-Qu-XpHdC6d6XnYTUEGs"
          />
          <span className="font-['Plus_Jakarta_Sans',sans-serif] text-base md:text-lg text-[#F8FAFC] tracking-tight font-bold">
            Park<span className="text-[#38bdf8]">Pulse</span>
          </span>
        </button>

        {/* LTA DataMall Connection Status Pill */}
        <button
          onClick={onOpenLtaModal}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0b162b] border border-[#23385d] hover:border-[#38bdf8] text-[11px] text-[#94A3B8] hover:text-[#F8FAFC] transition-all group shadow-sm"
          title="Inspect LTA, HDB & URA DataMall CarParkAvailabilityv2 feed"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              ltaStatus.connected ? 'bg-[#10b981] animate-pulse' : 'bg-[#f59e0b]'
            }`}
          />
          <span className="font-semibold text-[#38bdf8] hidden sm:inline">LTA DataMall</span>
          <span className="text-[#64748B] hidden md:inline">• HDB, LTA & URA</span>
          <span className="material-symbols-outlined text-[14px] text-[#64748B] group-hover:text-[#38bdf8] transition-colors">
            info
          </span>
        </button>

        {isProMode && (
          <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/30 border border-amber-500/50 text-[11px] text-amber-300 font-extrabold shadow-sm animate-pulse">
            <span className="material-symbols-outlined text-[13px]">bolt</span>
            <span>PRO ACTIVE</span>
          </span>
        )}
      </div>

      {/* Mode Switcher & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Sync LTA Button */}
        <button
          onClick={onRefreshLta}
          disabled={ltaStatus.loading}
          className="p-1.5 rounded-lg bg-[#1e293b] hover:bg-[#283548] text-[#38bdf8] border border-[#334155]/60 transition-all flex items-center justify-center disabled:opacity-50"
          title="Refresh live car park lots from LTA DataMall"
        >
          <span
            className={`material-symbols-outlined text-[16px] ${
              ltaStatus.loading ? 'animate-spin' : ''
            }`}
          >
            refresh
          </span>
        </button>

        {/* Pro Mode Switcher Toggle */}
        <div className="flex items-center p-0.5 bg-[#09101f] rounded-xl border border-[#2d3a56]">
          <button
            onClick={() => isProMode && onTogglePro()}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              !isProMode
                ? 'bg-[#1e293b] text-[#F8FAFC] shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Standard
          </button>
          <button
            onClick={() => !isProMode && onTogglePro()}
            className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1 ${
              isProMode
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-[#0f172a] shadow-md shadow-amber-500/20'
                : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">bolt</span>
            <span>PRO</span>
          </button>
        </div>

        {/* Reset View Button */}
        <button
          onClick={onReset}
          className="px-2.5 py-1 rounded-lg bg-[#1e293b] hover:bg-[#283548] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#334155]/60 text-xs font-semibold transition-all flex items-center gap-1"
          title="Reset destination"
        >
          <span className="material-symbols-outlined text-[15px]">restart_alt</span>
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </header>
  );
};
