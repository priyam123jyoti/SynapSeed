// src/components/dashboard/WalletCard.tsx

'use client';

import { Wallet, IndianRupee, Upload } from 'lucide-react';

interface WalletCardProps {
  walletBalance: number;
  lifetimeEarnings: number;
}

export default function WalletCard({
  walletBalance,
  lifetimeEarnings,
}: WalletCardProps) {
  return (
    <div className="relative overflow-hidden rounded-0xl bg-linear-to-br w-fit  from-emerald-600 via-green-600 to-teal-700 p-8 text-white shadow-xl">

      {/* Decorative Background */}
      <div className="absolute -top-20 -right-20 h-56 w-126  rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-black/10 blur-2xl" />

      <div className="relative z-10">

        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-2xl bg-white/20 p-3">
            <Wallet size={26} />
          </div>

          <div>
            <p className="text-sm text-white/80">
              Current Wallet
            </p>

            <h2 className="text-4xl font-bold">
              ₹{walletBalance.toFixed(2)}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">

          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-wider text-white/70">
              Lifetime Earnings
            </p>

            <div className="mt-2 flex items-center gap-2">
              <IndianRupee size={18} />
              <span className="text-2xl font-bold">
                {lifetimeEarnings.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            className="rounded-2xl bg-white text-emerald-700 font-semibold hover:bg-emerald-50 transition flex flex-col justify-center items-center gap-2"
          >
            <Upload size={22} />

            <span>Upload Paper</span>
          </button>

        </div>

      </div>

    </div>
  );
}