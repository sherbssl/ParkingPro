import React, { useState } from 'react';

interface BusinessModalProps {
  onClose: () => void;
}

export const BusinessModal: React.FC<BusinessModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'corporate'>('signin');
  const [email, setEmail] = useState('sherblinks@gmail.com');
  const [signedIn, setSignedIn] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#1E293B] border border-[#3f4850]/50 rounded-2xl p-6 shadow-2xl flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#93ccff] uppercase tracking-wider">
              ParkPulse Business Portal
            </span>
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-[#F8FAFC]">
              Enterprise & Fleet Parking
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Consolidated invoicing, ERP 2.0 automatic settlement, and corporate bay reservations.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#222a3d] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-[#060e20] p-1 rounded-xl border border-[#3f4850]/30 text-xs">
          <button
            onClick={() => setActiveTab('signin')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'signin'
                ? 'bg-[#3198dc] text-[#002c47]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Driver Account
          </button>
          <button
            onClick={() => setActiveTab('corporate')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'corporate'
                ? 'bg-[#3198dc] text-[#002c47]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Corporate Fleet
          </button>
        </div>

        {signedIn ? (
          <div className="p-5 rounded-xl bg-[#00a572]/15 border border-[#00a572]/30 text-center flex flex-col items-center gap-2 text-xs">
            <span className="material-symbols-outlined text-4xl text-[#4edea3]">
              verified_user
            </span>
            <p className="font-bold text-[#F8FAFC]">Connected as {email}</p>
            <p className="text-[#bfc7d2]">
              ERP 2.0 OBU Linked: <span className="font-semibold text-[#4edea3]">Active (IU #94821034)</span>
            </p>
            <button
              onClick={() => {
                setSignedIn(false);
                onClose();
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-[#2563EB] font-bold text-[#F8FAFC]"
            >
              Continue to Dashboard
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSignedIn(true);
            }}
            className="flex flex-col gap-3.5 text-xs"
          >
            <div>
              <label className="text-[#94A3B8] font-semibold mb-1 block">Work Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#060e20] border border-[#3f4850]/40 rounded-xl px-3 py-2 text-[#F8FAFC] outline-none focus:border-[#3198dc]"
              />
            </div>

            <div>
              <label className="text-[#94A3B8] font-semibold mb-1 block">Password / Passkey</label>
              <input
                type="password"
                defaultValue="••••••••••••"
                required
                className="w-full bg-[#060e20] border border-[#3f4850]/40 rounded-xl px-3 py-2 text-[#F8FAFC] outline-none focus:border-[#3198dc]"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#131b2e] border border-[#3f4850]/20 flex items-center justify-between">
              <span className="text-[#94A3B8]">Auto-sync Parking.sg / LTA ERP:</span>
              <span className="text-[#4edea3] font-bold">Enabled</span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#3198dc] text-[#F8FAFC] font-bold transition-colors shadow-lg"
            >
              Sign In to ParkPulse
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
