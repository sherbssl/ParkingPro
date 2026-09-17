import React, { useState } from 'react';
import { LtaFeedStatus } from '../types';

interface LtaConnectionModalProps {
  status: LtaFeedStatus;
  onClose: () => void;
  onRefresh: () => void;
}

export const LtaConnectionModal: React.FC<LtaConnectionModalProps> = ({
  status,
  onClose,
  onRefresh
}) => {
  const [testingPing, setTestingPing] = useState(false);
  const [diagResult, setDiagResult] = useState<any>(null);

  const handleTestPing = async () => {
    setTestingPing(true);
    try {
      const res = await fetch('/api/lta/diagnostics');
      const data = await res.json();
      setDiagResult(data);
    } catch (err: any) {
      setDiagResult({ error: err.message });
    } finally {
      setTestingPing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0f192e] border border-[#2d3a56] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col text-[#F8FAFC]">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-[#25324d] flex items-center justify-between bg-[#111c34]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0284c7]/20 border border-[#0284c7]/40 flex items-center justify-center text-[#38bdf8]">
              <span className="material-symbols-outlined text-[22px]">cloud_sync</span>
            </div>
            <div>
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-base md:text-lg flex items-center gap-2">
                LTA DataMall Serverless Feed
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Real-time CarParkAvailabilityv2 Endpoint Connection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-5 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Status Banner */}
          <div className="p-3.5 rounded-xl bg-[#09101f] border border-[#25324d] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className={`w-3 h-3 rounded-full ${
                  status.connected ? 'bg-[#10b981] animate-pulse' : 'bg-[#f59e0b]'
                }`}
              />
              <div>
                <span className="text-xs font-bold block">
                  {status.connected ? 'Stream Active & Synced' : 'Syncing Feed...'}
                </span>
                <span className="text-[11px] text-[#94A3B8]">
                  Source: <span className="text-[#38bdf8] font-mono">{status.source}</span> • {status.total} car parks
                </span>
              </div>
            </div>
            <button
              onClick={onRefresh}
              disabled={status.loading}
              className="px-3 py-1.5 rounded-lg bg-[#1e293b] hover:bg-[#2e3e56] text-xs font-bold text-[#38bdf8] border border-[#38bdf8]/30 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <span
                className={`material-symbols-outlined text-[16px] ${
                  status.loading ? 'animate-spin' : ''
                }`}
              >
                refresh
              </span>
              <span>{status.loading ? 'Updating...' : 'Refresh Now'}</span>
            </button>
          </div>

          {/* Endpoint Specification Box */}
          <div className="bg-[#09101f] border border-[#25324d] rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
                Upstream Target Endpoint
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/30">
                GET HTTP/2
              </span>
            </div>
            <div className="bg-[#0b1326] p-2.5 rounded-lg border border-[#1e293b] font-mono text-xs text-[#38bdf8] break-all select-all">
              https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2
            </div>

            <div className="pt-2 border-t border-[#1e293b] space-y-1.5">
              <span className="text-xs font-bold text-[#94A3B8] block">
                Required Request Header:
              </span>
              <div className="bg-[#0b1326] p-2 rounded-lg border border-[#1e293b] font-mono text-xs text-[#f59e0b] flex items-center justify-between">
                <span>AccountKey: edAse5e0TTGCVrHqroYzmg</span>
                <span className="text-[10px] text-[#64748B] font-sans">
                  (or &lt;LTA_ACCOUNT_KEY&gt;)
                </span>
              </div>
            </div>
          </div>

          {/* Agencies Scope Breakdown */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-[#09101f] border border-[#25324d] p-3 rounded-xl text-center">
              <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider block">
                Agency 1
              </span>
              <span className="text-sm font-black text-[#F8FAFC] block mt-0.5">
                HDB
              </span>
              <span className="text-[10px] text-[#64748B]">
                Housing Boards
              </span>
            </div>
            <div className="bg-[#09101f] border border-[#25324d] p-3 rounded-xl text-center">
              <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider block">
                Agency 2
              </span>
              <span className="text-sm font-black text-[#38bdf8] block mt-0.5">
                LTA
              </span>
              <span className="text-[10px] text-[#64748B]">
                Commercial / Malls
              </span>
            </div>
            <div className="bg-[#09101f] border border-[#25324d] p-3 rounded-xl text-center">
              <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider block">
                Agency 3
              </span>
              <span className="text-sm font-black text-[#f59e0b] block mt-0.5">
                URA
              </span>
              <span className="text-[10px] text-[#64748B]">
                Urban Redevelopment
              </span>
            </div>
          </div>

          {/* Diagnostic Ping Test */}
          <div className="bg-[#09101f] border border-[#25324d] rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#F8FAFC]">
                  Live Diagnostics & Latency
                </h4>
                <p className="text-[11px] text-[#64748B]">
                  Test the serverless proxy connection to Singapore DataMall
                </p>
              </div>
              <button
                onClick={handleTestPing}
                disabled={testingPing}
                className="px-3 py-1.5 rounded-lg bg-[#2563eb] hover:bg-[#38bdf8] hover:text-[#0f172a] text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">network_ping</span>
                <span>{testingPing ? 'Pinging...' : 'Test Connection'}</span>
              </button>
            </div>

            {diagResult && (
              <div className="mt-2 bg-[#060b17] p-2.5 rounded-lg border border-[#1e293b] font-mono text-[11px] text-[#94A3B8] space-y-1">
                <div className="flex justify-between">
                  <span>Ping Status:</span>
                  <span
                    className={
                      diagResult.pingStatus === 'connected'
                        ? 'text-[#34d399] font-bold'
                        : 'text-[#f59e0b] font-bold'
                    }
                  >
                    {diagResult.pingStatus} (HTTP {diagResult.httpCode})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Latency:</span>
                  <span className="text-[#38bdf8] font-bold">{diagResult.pingLatencyMs} ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Key:</span>
                  <span className="text-[#e2e8f0]">{diagResult.maskedKey}</span>
                </div>
                <div className="flex justify-between">
                  <span>Scope:</span>
                  <span className="text-[#e2e8f0] text-right truncate max-w-[260px]">{diagResult.agencyScope}</span>
                </div>
              </div>
            )}
          </div>

          <p className="text-[11px] text-[#64748B] leading-relaxed">
            Note: This feed updates live parking lot availability across Singapore HDB, LTA, and URA facilities. Total bay capacities are computed via our baseline registry.
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#25324d] bg-[#111c34] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1e293b] hover:bg-[#334155] text-xs font-bold text-[#F8FAFC] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
