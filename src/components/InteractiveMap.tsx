import React, { useState } from 'react';
import { ParkingFacility, MapLayerMode } from '../types';

interface InteractiveMapProps {
  facilities: ParkingFacility[];
  selectedFacility: ParkingFacility | null;
  destination: string;
  radiusMeters: number;
  destCoords: { x: number; y: number };
  isProMode: boolean;
  etaMinutes: number;
  onSelectFacility: (facility: ParkingFacility) => void;
  onNavigate: (facility: ParkingFacility) => void;
  onMapClickSetDestination?: (coords: { x: number; y: number }) => void;
  onOpenReservation?: (facility: ParkingFacility) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  facilities,
  selectedFacility,
  destination,
  radiusMeters,
  destCoords,
  isProMode,
  etaMinutes,
  onSelectFacility,
  onNavigate,
  onMapClickSetDestination,
  onOpenReservation
}) => {
  const [mapMode, setMapMode] = useState<MapLayerMode>('vector');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Scaled pixel radius: 2000m maps to ~420px on the 1000x700 canvas
  const radiusRadiusPx = Math.max(12, (radiusMeters / 2000) * 420);

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onMapClickSetDestination) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    // Normalized SVG coordinate (1000 x 700)
    const clickX = ((e.clientX - rect.left) / rect.width) * 1000;
    const clickY = ((e.clientY - rect.top) / rect.height) * 700;
    onMapClickSetDestination({ x: Math.round(clickX), y: Math.round(clickY) });
  };

  return (
    <section className="flex-1 h-full min-h-[420px] relative bg-[#060e20] overflow-hidden select-none flex flex-col">
      {/* Top Map HUD: Prominently displays Keyed-In Destination & Status */}
      <div className="absolute top-4 left-4 z-20 max-w-[calc(100%-80px)] sm:max-w-md bg-[#091122]/90 backdrop-blur-md border border-[#38bdf8]/40 rounded-2xl p-3 shadow-2xl flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e] animate-ping"></span>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#f43f5e]">
            Keyed Destination On Map
          </span>
          {isProMode && (
            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[9px] font-black">
              PRO HUD
            </span>
          )}
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-sm sm:text-base font-extrabold text-[#F8FAFC] font-['Plus_Jakarta_Sans',sans-serif] truncate">
            📍 {destination || 'Marina Bay Sands'}
          </h3>
          <span className="text-[11px] font-bold text-[#38bdf8] whitespace-nowrap">
            {radiusMeters}m radius
          </span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-[#94A3B8] border-t border-[#334155]/60 pt-1 mt-0.5">
          <span>{facilities.length} available car parks</span>
          <span className="text-[#38bdf8] italic hidden sm:inline">
            Click anywhere on map to reposition pin
          </span>
        </div>
      </div>

      {/* Precision Vector SVG Map Canvas */}
      <div
        className="absolute inset-0 w-full h-full transition-transform duration-300"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
      >
        <svg
          className="w-full h-full object-cover cursor-crosshair"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1000 700"
          xmlns="http://www.w3.org/2000/svg"
          onClick={handleSvgClick}
        >
          <defs>
            {/* Water Body Gradient */}
            <linearGradient id="bayWaterGrad" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor={mapMode === 'satellite' ? '#04101e' : '#061226'} />
              <stop offset="100%" stopColor={mapMode === 'satellite' ? '#07162b' : '#0a1936'} />
            </linearGradient>

            {/* Radius Overlay Radial Fill */}
            <radialGradient id="radiusGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
              <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.32" />
            </radialGradient>

            {/* Glow Filter for Selected Pin & Destination */}
            <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#38bdf8" floodOpacity="0.85" />
            </filter>
            <filter id="destGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#f43f5e" floodOpacity="0.9" />
            </filter>

            {/* Subtle Map Grid Pattern */}
            <pattern id="mapGrid" width="50" height="50" patternUnits="userSpaceOnUse">
              <rect width="50" height="50" fill="#081020" />
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#121e36" strokeWidth="0.5" />
            </pattern>
          </defs>

          {/* Landmass Base */}
          <rect
            width="1000"
            height="700"
            fill={mapMode === 'satellite' ? 'url(#mapGrid)' : '#091224'}
          />

          {/* Marina Bay Waterfront Geometry */}
          <path
            d="M 120,0 
               L 420,0 
               Q 480,180 580,240 
               Q 720,290 840,240 
               L 1000,210 
               L 1000,700 
               L 680,700 
               Q 540,580 430,460 
               Q 320,380 220,390 
               Q 140,400 120,700 
               L 0,700 
               L 0,0 Z"
            fill="url(#bayWaterGrad)"
            stroke="#1d2e4d"
            strokeWidth="1.5"
          />

          {/* Major Singapore CBD Road Arteries */}
          <g stroke="#1b2844" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Bayfront Avenue */}
            <path d="M 520,60 Q 640,240 760,420 Q 820,530 890,680" />
            {/* Marina Boulevard */}
            <path d="M 100,520 Q 340,460 520,440 Q 700,430 820,440" />
            {/* Central Boulevard */}
            <path d="M 110,400 Q 320,370 460,370" />
            {/* Raffles Avenue / Sheares Ave */}
            <path d="M 380,40 Q 560,90 740,110 Q 880,140 1000,200" />
            {/* Collyer Quay */}
            <path d="M 280,200 L 390,380" />
          </g>

          {/* Road Centerlines */}
          <g stroke="#2c3e66" strokeWidth="1.5" fill="none" strokeDasharray="6 4">
            <path d="M 520,60 Q 640,240 760,420 Q 820,530 890,680" />
            <path d="M 100,520 Q 340,460 520,440 Q 700,430 820,440" />
            <path d="M 380,40 Q 560,90 740,110 Q 880,140 1000,200" />
          </g>

          {/* Architectural Landmark Silhouettes */}
          {/* Marina Bay Sands 3 Towers & SkyPark */}
          <g fill="#16223b" opacity="0.75">
            <path d="M 680,220 L 740,210 L 755,270 L 695,280 Z" />
            <path d="M 705,295 L 765,285 L 780,345 L 720,355 Z" />
            <path d="M 730,370 L 790,360 L 805,420 L 745,430 Z" />
            <path d="M 660,215 Q 750,290 820,440" fill="none" stroke="#253555" strokeWidth="16" strokeLinecap="round" opacity="0.4" />
          </g>

          {/* MBFC Cluster */}
          <g fill="#16223b" opacity="0.75">
            <rect x="290" y="380" width="70" height="60" rx="6" />
            <rect x="280" y="460" width="80" height="75" rx="6" />
            <rect x="380" y="470" width="60" height="65" rx="6" />
          </g>

          {/* Pro Trajectory Route (When Pro mode is active and facility is selected) */}
          {isProMode && selectedFacility && (
            <g>
              {/* Driving Route from Entry Gantry to Car Park */}
              <path
                d={`M 180,600 Q 280,500 ${selectedFacility.coords.x},${selectedFacility.coords.y}`}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="4"
                strokeDasharray="8 4"
                className="animate-pulse"
              />
              {/* Walking Trail from Car Park to Keyed Destination */}
              <line
                x1={selectedFacility.coords.x}
                y1={selectedFacility.coords.y}
                x2={destCoords.x}
                y2={destCoords.y}
                stroke="#f43f5e"
                strokeWidth="2.5"
                strokeDasharray="4 3"
              />
              {/* ERP Gantry Marker on Route */}
              <g transform="translate(260, 530)">
                <rect x="-24" y="-12" width="48" height="20" rx="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="0" y="2" fill="#f59e0b" fontSize="8" fontWeight="bold" textAnchor="middle">
                  ERP $2.00
                </text>
              </g>
            </g>
          )}

          {/* Dynamic Search Radius Circle (0 - 2000m) Centered Exactly on Keyed Destination */}
          <g>
            <circle
              cx={destCoords.x}
              cy={destCoords.y}
              r={radiusRadiusPx}
              fill="url(#radiusGradient)"
            />
            <circle
              cx={destCoords.x}
              cy={destCoords.y}
              r={radiusRadiusPx}
              stroke="#38bdf8"
              strokeWidth="2.2"
              strokeDasharray="7 5"
              opacity="0.9"
            />
            {/* Radius Edge Tag */}
            <g transform={`translate(${destCoords.x + radiusRadiusPx - 40}, ${destCoords.y - 12})`}>
              <rect width="80" height="24" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" />
              <text x="40" y="16" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                {radiusMeters}m radius
              </text>
            </g>
          </g>

          {/* PROMINENT KEYED-IN DESTINATION BEACON ON MAP */}
          <g transform={`translate(${destCoords.x}, ${destCoords.y})`} style={{ filter: 'url(#destGlow)' }}>
            {/* Animated Concentric Radar Pulse Rings */}
            <circle r="36" fill="#f43f5e" opacity="0.15">
              <animate attributeName="r" values="24;52;24" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.35;0.02;0.35" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle r="22" fill="#f43f5e" opacity="0.25">
              <animate attributeName="r" values="16;34;16" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.45;0.1;0.45" dur="2s" repeatCount="indefinite" />
            </circle>

            {/* Glowing Center Pin Anchor */}
            <circle r="14" fill="#e11d48" stroke="#ffffff" strokeWidth="3" />
            <circle r="5" fill="#ffffff" />

            {/* Prominent Floating Billboard for Keyed Destination */}
            <g transform="translate(0, -32)">
              {/* Banner Shadow/Background */}
              <rect
                x="-95"
                y="-28"
                width="190"
                height="32"
                rx="8"
                fill="#0f172a"
                stroke="#f43f5e"
                strokeWidth="2"
              />
              {/* Pointer Triangle */}
              <polygon points="0,4 -7,-4 7,-4" fill="#0f172a" />
              <polygon points="0,6 -8,-4 8,-4" fill="none" stroke="#f43f5e" strokeWidth="2" />

              {/* Header text */}
              <text x="0" y="-14" fill="#f43f5e" fontSize="9" fontWeight="900" textAnchor="middle" letterSpacing="0.8">
                ★ KEYED DESTINATION
              </text>
              {/* Destination Title */}
              <text x="0" y="-2" fill="#ffffff" fontSize="12" fontWeight="800" textAnchor="middle">
                {destination ? (destination.length > 20 ? destination.slice(0, 18) + '...' : destination) : 'Marina Bay Sands'}
              </text>
            </g>
          </g>

          {/* Available Parking Facility Pins (Only within Radius) */}
          {facilities.map((fac) => {
            const isSelected = selectedFacility?.id === fac.id;
            const x = fac.coords.x;
            const y = fac.coords.y;

            return (
              <g
                key={fac.id}
                transform={`translate(${x}, ${y})`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectFacility(fac);
                }}
                className="cursor-pointer transition-transform duration-200"
                style={{ filter: isSelected ? 'url(#cyanGlow)' : undefined }}
              >
                {/* Marker Body */}
                <rect
                  x="-34"
                  y="-18"
                  width="68"
                  height="28"
                  rx="7"
                  fill={isSelected ? '#38bdf8' : '#1e293b'}
                  stroke={isSelected ? '#ffffff' : '#475569'}
                  strokeWidth={isSelected ? '2' : '1'}
                />

                {/* Marker Pin Point */}
                <polygon
                  points="0,15 -6,10 6,10"
                  fill={isSelected ? '#38bdf8' : '#1e293b'}
                />

                {/* Text: Lots Free & Distance */}
                <text
                  x="0"
                  y="-2"
                  fill={isSelected ? '#0f172a' : '#34d399'}
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {fac.availableLots} free
                </text>
                <text
                  x="0"
                  y="7"
                  fill={isSelected ? '#0f172a' : '#94a3b8'}
                  fontSize="8"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {fac.walkMeters}m
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Selected Facility Detail Card (Bottom of Map) */}
      {selectedFacility && (
        <div className="absolute bottom-5 left-5 right-5 sm:left-auto sm:right-5 sm:w-[420px] bg-[#0f172a]/95 border border-[#38bdf8]/40 backdrop-blur-md rounded-2xl p-4 shadow-2xl z-20 flex flex-col gap-3 animate-slideUp">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-[#38bdf8]/20 text-[#38bdf8] text-[10px] font-bold border border-[#38bdf8]/30">
                  {selectedFacility.walkMeters}m to {destination || 'Destination'}
                </span>
                <span className="px-2 py-0.5 rounded bg-[#10b981]/20 text-[#34d399] text-[10px] font-bold border border-[#10b981]/30">
                  {selectedFacility.availableLots} lots free
                </span>
                {isProMode && selectedFacility.forecastProbability && (
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/30">
                    ⚡ {selectedFacility.forecastProbability}% ETA Probability (+{etaMinutes}m)
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-[#F8FAFC] font-['Plus_Jakarta_Sans',sans-serif] mt-1.5">
                {selectedFacility.name}
              </h4>
              <p className="text-xs text-[#94A3B8]">{selectedFacility.address}</p>
            </div>
          </div>

          {/* Pricing & Pro ERP breakdown */}
          <div className="flex items-center justify-between pt-2 border-t border-[#334155]/60 text-xs">
            <div>
              <span className="text-[10px] text-[#64748B] block">Standard Rate</span>
              <span className="font-bold text-[#38bdf8]">
                {selectedFacility.tariff.peakDayRate}
              </span>
            </div>

            {isProMode && selectedFacility.erpGantryToll !== undefined && (
              <div>
                <span className="text-[10px] text-[#64748B] block">CBD ERP Toll</span>
                <span className="font-bold text-[#f59e0b]">
                  +${selectedFacility.erpGantryToll.toFixed(2)} SGD
                </span>
              </div>
            )}

            <div className="flex items-center gap-1.5">
              {isProMode && onOpenReservation && (
                <button
                  onClick={() => onOpenReservation(selectedFacility)}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#0f172a] font-extrabold text-xs transition-all shadow-md flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">bolt</span>
                  <span>Hold Bay</span>
                </button>
              )}
              <button
                onClick={() => onNavigate(selectedFacility)}
                className="px-3.5 py-2 rounded-xl bg-[#2563eb] hover:bg-[#38bdf8] hover:text-[#0f172a] text-[#F8FAFC] font-bold text-xs transition-colors flex items-center gap-1 shadow-lg"
              >
                <span className="material-symbols-outlined text-[15px]">navigation</span>
                <span>Navigate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Control Floating Toolbar (Top Right) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        {/* Layer Mode Switch */}
        <button
          onClick={() => setMapMode(mapMode === 'vector' ? 'satellite' : 'vector')}
          className="p-2.5 rounded-xl bg-[#0f172a]/90 hover:bg-[#1e293b] border border-[#334155] text-[#38bdf8] shadow-lg transition-colors flex items-center justify-center"
          title={`Switch to ${mapMode === 'vector' ? 'Satellite Grid' : 'Vector'}`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {mapMode === 'vector' ? 'satellite_alt' : 'map'}
          </span>
        </button>

        {/* Zoom In */}
        <button
          onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.15))}
          className="p-2.5 rounded-xl bg-[#0f172a]/90 hover:bg-[#1e293b] border border-[#334155] text-[#F8FAFC] shadow-lg transition-colors flex items-center justify-center"
          title="Zoom in"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
        </button>

        {/* Zoom Out */}
        <button
          onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.15))}
          className="p-2.5 rounded-xl bg-[#0f172a]/90 hover:bg-[#1e293b] border border-[#334155] text-[#F8FAFC] shadow-lg transition-colors flex items-center justify-center"
          title="Zoom out"
        >
          <span className="material-symbols-outlined text-[18px]">remove</span>
        </button>
      </div>
    </section>
  );
};
