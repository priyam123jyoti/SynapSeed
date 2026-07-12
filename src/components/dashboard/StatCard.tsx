'use client';

import { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  color?: 'green' | 'blue' | 'orange' | 'purple' | 'red';
}

const colors = {
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-700',
    border: 'border-green-100',
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-700',
    border: 'border-blue-100',
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'text-orange-700',
    border: 'border-orange-100',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-700',
    border: 'border-purple-100',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-700',
    border: 'border-red-100',
  },
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  color = 'green',
}: StatCardProps) {
  const theme = colors[color];

  return (
    <div
      className={`group rounded-3xl border ${theme.border} bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
    >
      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
            {title}
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-900">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-2 text-sm text-slate-500">
              {subtitle}
            </p>
          )}

        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${theme.bg} ${theme.icon}`}
        >
          {icon}
        </div>

      </div>

      <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-slate-500">

        <ArrowUpRight
          size={16}
          className="text-green-600 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
        />

        <span>View Details</span>

      </div>
    </div>
  );
}