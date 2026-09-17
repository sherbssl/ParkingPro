import React, { useState } from 'react';
import { ParkingFacility } from '../types';

interface ProExpenseReportModalProps {
  facilities: ParkingFacility[];
  destination: string;
  onClose: () => void;
}

export const ProExpenseReportModal: React.FC<ProExpenseReportModalProps> = ({
  facilities,
  destination,
  onClose
}) => {
  const [reportType, setReportType] = useState<'current_trip' | 'monthly_fleet'>('current_trip');
  const [downloaded, setDownloaded] = useState(false);

  const mockClaims = [
    { date: '16 Sep 2026', time: '14:20', location: 'Marina Bay Financial Centre', duration: '2.5 hrs', erp: '$2.00', parking: '$12.50', total: '$14.50' },
    { date: '15 Sep 2026', time: '09:15', location: 'Raffles City Shopping Centre', duration: '1.5 hrs', erp: '$2.00', parking: '$6.60', total: '$8.60' },
    { date: '12 Sep 2026', time: '18:30', location: 'The Shoppes at Marina Bay Sands', duration: '3.0 hrs', erp: '$0.00', parking: '$12.00', total: '$12.00' }
  ];

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => {
      setDownloaded(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-[#0f172a] border border-[#38bdf8]/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#1e293b] border-b border-[#334155] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-gradient-to-r from-amber-400 to-amber-600 text-[#0f172a] text-[11px] font-black uppercase tracking-wider">
              PRO ⚡
            </span>
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-[#F8FAFC]">
              Corporate Tax Invoice & Expense Export
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
          {/* Format selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setReportType('current_trip')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                reportType === 'current_trip'
                  ? 'bg-[#38bdf8] text-[#0f172a]'
                  : 'bg-[#1e293b] text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Current Destination Trip
            </button>
            <button
              onClick={() => setReportType('monthly_fleet')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                reportType === 'monthly_fleet'
                  ? 'bg-[#38bdf8] text-[#0f172a]'
                  : 'bg-[#1e293b] text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              September Fleet History (IRAS GST)
            </button>
          </div>

          {/* Statement preview */}
          <div className="p-3.5 rounded-xl bg-[#09101f] border border-[#334155] flex flex-col gap-2.5 font-mono text-[11px]">
            <div className="flex justify-between text-[#94A3B8] border-b border-[#334155] pb-2">
              <span>ParkPulse Pro Tax Invoice</span>
              <span>GST Reg: M90382918X</span>
            </div>
            <div className="flex justify-between text-[#F8FAFC]">
              <span>Keyed Destination:</span>
              <span className="font-bold text-[#38bdf8]">{destination || 'Marina Bay Sands'}</span>
            </div>

            <div className="mt-1 flex flex-col gap-1.5">
              {mockClaims.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-1 border-b border-[#1e293b]">
                  <div>
                    <p className="text-[#F8FAFC] font-sans font-bold">{item.location}</p>
                    <p className="text-[10px] text-[#64748B]">{item.date} • {item.time} ({item.duration})</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#34d399] font-bold">{item.total}</p>
                    <p className="text-[10px] text-[#64748B]">ERP {item.erp} + Park {item.parking}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 font-bold text-[#F8FAFC]">
              <span>Net Tax-Deductible Subtotal (9% GST Included):</span>
              <span className="text-[#38bdf8] text-sm font-sans">$35.10 SGD</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-[#1e293b] hover:bg-[#334155] text-[#94A3B8] font-bold transition-colors"
            >
              Dismiss
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg"
            >
              <span className="material-symbols-outlined text-[16px]">
                {downloaded ? 'check' : 'download'}
              </span>
              <span>{downloaded ? 'Report Generated!' : 'Export PDF & CSV'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
