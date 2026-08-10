'use client';

import { Wallet, Phone, QrCode, Edit3, ShieldCheck } from 'lucide-react';

export interface PayoutProfile {
  upi_id: string;
  phone_number: string;
  qr_code_url: string | null;
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {/* UPI ID */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1">
              <Wallet size={12} /> UPI ID (For ₹3 Payout)
            </label>
            <input
              type="text"
              name="payout_upi_id"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              required
              placeholder="e.g., username@okaxis / upi@ybl"
              className="p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          {/* Mobile / WhatsApp */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1">
              <Phone size={12} /> WhatsApp / Phone Number
            </label>
            <input
              type="tel"
              name="payout_phone"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              required
              placeholder="e.g., 9876543210"
              className="p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          {/* Payment QR Code Image */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="flex items-center gap-1">
              <QrCode size={12} /> Payment QR Code Image {payoutProfile?.qr_code_url && '(Optional if already uploaded)'}
            </label>
            <input
              type="file"
              name="payout_qr_file"
              accept="image/*"
              required={!payoutProfile?.qr_code_url}
              className="p-2.5 border border-dashed border-slate-300 rounded-xl bg-white file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 font-semibold">
              This info will be permanently saved to your account so you don not need to re-enter it for future uploads.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}