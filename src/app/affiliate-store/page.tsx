"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft, PackageSearch, Loader2 } from 'lucide-react';

// Data Imports
import { ALL_PRODUCTS, SUB_CATEGORIES } from '@/data/products/index';

// Component Imports
import StoreNav from '@/components/affiliate-store/StoreNav';
import WideProductCard from '@/components/affiliate-store/WideProductCard';
import SubFilterNav from '@/components/affiliate-store/SubFilterNav';
import BackToTop from '@/components/affiliate-store/BackToTop';

export default function AffiliateStore() {
  const [activeCategory, setActiveCategory] = useState('Books');
  const [activeSub, setActiveSub] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // --- LAZY LOADING STATE ---
  const [displayLimit, setDisplayLimit] = useState(10);
  const [isBotLoading, setIsBotLoading] = useState(false);
  
  const router = useRouter(); 
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. Reset filters and scroll when Main Category changes
  useEffect(() => {
    setActiveSub('All');
    setDisplayLimit(10); 
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeCategory]);

  // 2. Reset limit when searching or changing sub-category
  useEffect(() => {
    setDisplayLimit(10);
  }, [searchQuery, activeSub]);

  // 3. Advanced Filtering Engine
  const allFilteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((product) => {
      const matchesMain = product.category === activeCategory;
      
      const matchesSub = activeSub === 'All' || 
                         product.examTag === activeSub || 
                         (product.subjects && product.subjects.includes(activeSub));

      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        product.name.toLowerCase().includes(query) ||
        product.examTag?.toLowerCase().includes(query) ||
        product.subjects?.some(s => s.toLowerCase().includes(query));

      return matchesMain && matchesSub && matchesSearch;
    });
  }, [activeCategory, activeSub, searchQuery]);

  // 4. Slice data for Performance (Infinite Scroll)
  const visibleProducts = useMemo(() => {
    return allFilteredProducts.slice(0, displayLimit);
  }, [allFilteredProducts, displayLimit]);

  // 5. Infinite Scroll Logic
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 150 >= 
        document.documentElement.offsetHeight
      ) {
        if (displayLimit < allFilteredProducts.length && !isBotLoading) {
          loadMore();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayLimit, allFilteredProducts.length, isBotLoading]);

  const loadMore = () => {
    setIsBotLoading(true);
    setTimeout(() => {
      setDisplayLimit(prev => prev + 10);
      setIsBotLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#fcfdfd] pb-20 font-sans">
      
      {/* STICKY HEADER */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-emerald-50 px-4 py-2">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <button 
            onClick={() => router.push('/')}
            className="p-2 hover:bg-emerald-50 rounded-xl text-emerald-950 transition-colors flex-shrink-0"
          >
            <ArrowLeft size={24} />
          </button>

          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600/40" size={18} />
            <input 
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeCategory}...`}
              className="w-full pl-11 pr-4 py-3 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all text-sm font-medium"
            />
          </div>
        </div>
      </div>

      <StoreNav activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

      <SubFilterNav 
        activeMain={activeCategory} 
        activeSub={activeSub} 
        onSelectSub={setActiveSub} 
        subCategories={SUB_CATEGORIES}
      />

      <main className="max-w-5xl mx-auto px-4 mt-8">
        <div className="mb-8 px-2 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-[0.25em] mb-1">
              Store Library
            </span>
            <h2 className="text-2xl font-black text-emerald-950 tracking-tight">
              {activeSub === 'All' ? `Premium ${activeCategory}` : activeSub}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-emerald-900/40 uppercase">
              Showing {visibleProducts.length} of {allFilteredProducts.length}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-8 items-center">
          <AnimatePresence mode="popLayout">
            {visibleProducts.length > 0 ? (
              visibleProducts.map((product) => (
                <motion.div 
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-full md:w-[98%]"
                >
                  <WideProductCard product={product} />
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="py-32 text-center"
              >
                <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12">
                  <PackageSearch className="text-emerald-200" size={40} />
                </div>
                <h3 className="text-emerald-950 font-bold text-xl">No items found</h3>
                <p className="text-emerald-800/40 text-sm max-w-xs mx-auto">
                  Adjust your search filters to find scientific resources.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {allFilteredProducts.length > displayLimit && (
            <div className="w-full flex flex-col items-center py-12 gap-3">
              <Loader2 className="animate-spin text-emerald-500" size={28} />
              <span className="text-[11px] font-black text-emerald-900/20 uppercase tracking-[0.3em]">
                Fetching more items
              </span>
            </div>
          )}
        </div>

        <footer className="mt-20 py-10 border-t border-emerald-50 text-center">
          <p className="text-[11px] text-emerald-900/30 max-w-2xl mx-auto leading-relaxed uppercase tracking-widest font-medium">
            As an Amazon Associate and Coursera Partner, SynapStore earns from qualifying purchases. 
            This helps us keep our educational resources free for students.
          </p>
        </footer>
      </main>

      <BackToTop />
    </div>
  );
}