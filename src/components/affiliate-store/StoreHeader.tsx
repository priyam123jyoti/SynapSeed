"use client";

import { memo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowLeft, Loader2 } from 'lucide-react';

interface StoreHeaderProps {
  searchInput: string;
  setSearchInput: (val: string) => void;
  searchQuery: string;
  activeCategory: string;
}

const StoreHeader = memo(({ searchInput, setSearchInput, searchQuery, activeCategory }: StoreHeaderProps) => {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-emerald-50 px-4 py-2 will-change-transform">
      <div className="max-w-5xl mx-auto flex items-center gap-3">
        <button 
          onClick={() => router.push('/')}
          className="p-2 hover:bg-emerald-50 rounded-xl text-emerald-950 transition-colors flex-shrink-0 active:scale-95"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600/40 group-focus-within:text-emerald-600 transition-colors" size={18} />
          <input 
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={`Search ${activeCategory}...`}
            className="w-full pl-11 pr-4 py-3 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all text-sm text-emerald-900 font-medium placeholder:text-emerald-900/30"
          />
          {searchInput !== searchQuery && (
             <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 size={14} className="animate-spin text-emerald-500" />
             </div>
          )}
        </div>
      </div>
    </div>
  );
});

StoreHeader.displayName = 'StoreHeader';
export default StoreHeader;