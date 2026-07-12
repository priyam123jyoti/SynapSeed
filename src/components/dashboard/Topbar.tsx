'use client';

import { Search, Bell, Wallet } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="sticky top-0 z-30 bg-slate-100/90 backdrop-blur-xl">
      <div className="flex items-center justify-between px-8 py-6">

        {/* Left */}
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Welcome back! Here is your marketplace overview.
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">

          {/* Search */}

          <div className="relative hidden lg:block">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search..."
              className="w-72 rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
            />
          </div>

          {/* Wallet */}

          <button className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 shadow-sm transition hover:shadow-md">

            <Wallet
              size={18}
              className="text-green-600"
            />

            <span className="font-bold text-slate-800">
              Wallet
            </span>

          </button>

          {/* Notification */}

          <button className="relative rounded-2xl bg-white p-3 shadow-sm transition hover:shadow-md">

            <Bell
              size={20}
              className="text-slate-600"
            />

            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-red-500"></span>

          </button>

          {/* User */}

          <div className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2 shadow-sm">

            <img
              src="https://ui-avatars.com/api/?name=User&background=16a34a&color=fff"
              alt="Profile"
              className="h-11 w-11 rounded-full"
            />

            <div className="hidden md:block">

              <p className="text-sm font-bold text-slate-900">
                Creator
              </p>

              <p className="text-xs text-slate-500">
                Paper Uploader
              </p>

            </div>

          </div>

        </div>

      </div>
    </header>
  );
}