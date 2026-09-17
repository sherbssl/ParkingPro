import React from 'react';

interface HeaderProps {
  isProMode: boolean;
  onTogglePro: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isProMode, onTogglePro, onReset }) => {
  return (
    <header className="w-full h-14 bg-[#091122] border-b border-[#25324d] px-4 md:px-8 flex items-center justify-between z-30 select-none">
      {/* Brand */}
      <div className="flex items-center gap-3">
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

        {isProMode ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/30 border border-amber-500/50 text-[11px] text-amber-300 font-extrabold shadow-sm animate-pulse">
            <span className="material-symbols-outlined text-[13px]">bolt</span>
            <span>PRO VERSION ACTIVE</span>
          </span>
        ) : (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#1e293b] border border-[#334155] text-[11px] text-[#94A3B8]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
            Singapore Live Parking
          </span>
        )}
      </div>

      {/* Mode Switcher & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
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
