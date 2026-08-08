"use client";

import { memo } from 'react';
import { Loader2 } from 'lucide-react';

interface StoreHeadingProps {
  activeSub: string;
  activeCategory: string;
  isPending: boolean;
  visibleCount: number;
  totalCount: number;
}

const StoreHeading = memo(({ activeSub, activeCategory, isPending, visibleCount, totalCount }: StoreHeadingProps) => (
  <div className="mb-8 px-2 flex items-end justify-between">
    <div className="flex flex-col">
      <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-[0.25em] mb-1">
        Store Library
      </span>
      <h2 className="text-2xl font-black text-emerald-950 tracking-tight flex items-center gap-2">
        {activeSub === 'All' ? `Premium ${activeCategory}` : activeSub}
        {isPending && <Loader2 size={16} className="animate-spin text-emerald-400" />}
      </h2>
    </div>
    <div className="text-right">
      <p className="text-[10px] font-bold text-emerald-900/40 uppercase tabular-nums">
        {visibleCount} / {totalCount} Items
      </p>
    </div>
  </div>
));

StoreHeading.displayName = 'StoreHeading';
export default StoreHeading;