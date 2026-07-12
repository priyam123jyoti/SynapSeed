'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Upload,
  FileText,
  Wallet,
  BarChart3,
  Settings,
  LogOut,
  Leaf,
} from 'lucide-react';

const menuItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Upload Paper',
    href: '/papers/upload',
    icon: Upload,
  },
  {
    name: 'My Papers',
    href: '/dashboard/papers',
    icon: FileText,
  },
  {
    name: 'Wallet',
    href: '/dashboard/wallet',
    icon: Wallet,
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-slate-200 bg-white lg:flex lg:flex-col">

      {/* Logo */}
      <div className="border-b border-slate-100 p-8">
        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100">
            <Leaf className="text-green-700" size={24} />
          </div>

          <div>
            <h1 className="text-xl font-black text-slate-900">
              SynapSeed
            </h1>

            <p className="text-xs text-slate-500">
              Creator Dashboard
            </p>
          </div>

        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-5 py-8">

        <p className="mb-5 px-3 text-xs font-bold uppercase tracking-widest text-slate-400">
          Main Menu
        </p>

        <nav className="space-y-2">

          {menuItems.map((item) => {
            const Icon = item.icon;

            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-4 rounded-2xl px-4 py-4 transition-all duration-200 ${
                  active
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon
                  size={20}
                  className={
                    active
                      ? 'text-white'
                      : 'text-slate-500 group-hover:text-green-600'
                  }
                />

                <span className="font-semibold">
                  {item.name}
                </span>
              </Link>
            );
          })}

        </nav>

      </div>

    </aside>
  );
}