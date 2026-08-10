'use client';

import { Wallet, Phone, Edit3, ShieldCheck } from 'lucide-react';

export interface PayoutProfile {
  upi_id: string;
  phone_number: string;
}

interface PayoutDetailsCardProps {
  payoutProfile: PayoutProfile | null;
  isEditingPayout: boolean;
  setIsEditingPayout: (editing: boolean) => void;
  upiId: string;
  setUpiId: (val: string) => void;
  phoneNo: string;
  setPhoneNo: (val: string) => void;
}

export function PayoutDetailsCard({
  payoutProfile,
  isEditingPayout,
  setIsEditingPayout,
  upiId,
  setUpiId,
  phoneNo,
  setPhoneNo,
}: PayoutDetailsCardProps) {
  return (
    <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-900">
          <Wallet size={18} className="text-emerald-600" />
          <h3 className="text-xs font-black uppercase tracking-wider">
            Uploader Payout Account
          </h3>
        </div>
        {payoutProfile && !isEditingPayout && (
          <button
            type="button"
            onClick={() => setIsEditingPayout(true)}
            className="flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-bold transition-colors"
          >
            <Edit3 size={12} /> Edit Payment Info
          </button>
        )}
      </div>

      {payoutProfile && !isEditingPayout ? (
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[10px] uppercase text-slate-400 font-bold">Saved UPI ID</p>
            <p className="text-xs font-black text-slate-900">{payoutProfile.upi_id}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase text-slate-400 font-bold">Saved Phone No.</p>
            <p className="text-xs font-black text-slate-900">{payoutProfile.phone_number}</p>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 text-[11px] font-bold">
            <ShieldCheck size={14} /> Payout Details Linked
          </div>
        </div>
      ) : (
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* UPI ID */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700">
                <Wallet size={12} /> UPI ID (For ₹3 Payout)
              </label>
              <input
                type="text"
                name="payout_upi_id"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                required
                placeholder="e.g., username@okaxis / upi@ybl"
                className="p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-xs font-medium text-slate-900"
              />
            </div>

            {/* Mobile / WhatsApp */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700">
                <Phone size={12} /> WhatsApp / Phone Number
              </label>
              <input
                type="tel"
                name="payout_phone"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                required
                placeholder="e.g., 9876543210"
                className="p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-xs font-medium text-slate-900"
              />
            </div>
          </div>

          <p className="text-[10px] text-slate-400 font-semibold">
            This info will be permanently saved to your account so you do not need to re-enter it for future uploads.
          </p>
        </div>
      )}
    </div>
  );
}