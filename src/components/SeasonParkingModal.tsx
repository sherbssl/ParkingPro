import React, { useState } from 'react';

interface SeasonParkingModalProps {
  onClose: () => void;
}

export const SeasonParkingModal: React.FC<SeasonParkingModalProps> = ({ onClose }) => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-[#1E293B] border border-[#3f4850]/50 rounded-2xl p-6 shadow-2xl flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#93ccff] text-[22px]">
                event_repeat
              </span>
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-[#F8FAFC]">
                Season Parking Applications (CBD & Marina Bay)
              </h3>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Monthly pass quotas, URA & commercial building season rates for 2026.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#222a3d] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {submitted ? (
          <div className="p-6 rounded-xl bg-[#00a572]/15 border border-[#00a572]/30 text-center flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-4xl text-[#4edea3]">
              check_circle
            </span>
            <h4 className="font-bold text-[#F8FAFC]">Application Received</h4>
            <p className="text-xs text-[#dae2fd]">
              Your season parking request for Marina Bay Central has been queued with building management. A confirmation SMS will be dispatched.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-4 py-2 rounded-xl bg-[#2563EB] text-xs font-bold text-[#F8FAFC]"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="p-3.5 rounded-xl bg-[#131b2e] border border-[#3f4850]/30 flex flex-col gap-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#94A3B8]">MBFC Monthly Pass Rate:</span>
                <span className="font-bold text-[#F8FAFC]">$450.00 / month</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#94A3B8]">The Shoppes at MBS Season Pass:</span>
                <span className="font-bold text-[#F8FAFC]">$520.00 / month</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#94A3B8]">One Raffles Quay (ORQ) Season Pass:</span>
                <span className="font-bold text-[#F8FAFC]">$480.00 / month</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#94A3B8]">Next Ballot Release:</span>
                <span className="font-bold text-[#4edea3]">25th of every month</span>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="flex flex-col gap-3 text-xs"
            >
              <div>
                <label className="text-[#94A3B8] font-semibold mb-1 block">Vehicle Number (IU Plate)</label>
                <input
                  type="text"
                  placeholder="e.g. SBA 1234 A"
                  required
                  className="w-full bg-[#060e20] border border-[#3f4850]/40 rounded-xl px-3 py-2 text-[#F8FAFC] outline-none focus:border-[#3198dc]"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] font-semibold mb-1 block">Preferred Facility</label>
                <select className="w-full bg-[#060e20] border border-[#3f4850]/40 rounded-xl px-3 py-2 text-[#F8FAFC] outline-none focus:border-[#3198dc]">
                  <option>Marina Bay Financial Centre (MBFC)</option>
                  <option>The Shoppes at Marina Bay Sands</option>
                  <option>One Raffles Quay (ORQ)</option>
                  <option>Asia Square Tower 1 & 2</option>
                  <option>Suntec City Mall Car Park</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-[#171f33] hover:bg-[#222a3d] text-[#dae2fd] font-semibold transition-colors border border-[#3f4850]/30"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#3198dc] text-[#F8FAFC] font-bold transition-colors shadow-lg"
                >
                  Submit Inquiry
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
