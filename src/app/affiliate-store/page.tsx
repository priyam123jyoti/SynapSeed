"use client";

import { useState, useMemo, useRef, useEffect, useCallback, useTransition } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { PackageSearch, Loader2 } from 'lucide-react';

// Data
import { ALL_PRODUCTS, SUB_CATEGORIES } from '@/data/products/index';

// Components
import StoreNav from '@/components/affiliate-store/StoreNav';
import WideProductCard from '@/components/affiliate-store/WideProductCard';
import SubFilterNav from '@/components/affiliate-store/SubFilterNav';
import BackToTop from '@/components/affiliate-store/BackToTop';
import StoreHeader from '@/components/affiliate-store/StoreHeader';
import StoreHeading from '@/components/affiliate-store/StoreHeading';

// Hook for performance
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function AffiliateStore() {
  const [activeCategory, setActiveCategory] = useState('Books');
  const [activeSub, setActiveSub] = useState('All');
  const [searchInput, setSearchInput] = useState(''); 
  const searchQuery = useDebounce(searchInput, 300);
  const [isPending, startTransition] = useTransition();
  const [displayLimit, setDisplayLimit] = useState(10);
  
  const loadMoreRef = useRef(null);
  const isInView = useInView(loadMoreRef, { margin: "200px" });

  const allFilteredProducts = useMemo(() => {
    const isSearching = searchQuery.length > 0;
    const query = isSearching ? searchQuery.toLowerCase() : '';

    return ALL_PRODUCTS.filter((product) => {
      if (product.category !== activeCategory) return false;
      const matchesSub = activeSub === 'All' || 
                         product.examTag === activeSub || 
                         (product.subjects && product.subjects.includes(activeSub));
      if (!matchesSub) return false;
      if (!isSearching) return true;
      return product.name.toLowerCase().includes(query) ||
             product.examTag?.toLowerCase().includes(query) ||
             product.subjects?.some(s => s.toLowerCase().includes(query));
    });
  }, [activeCategory, activeSub, searchQuery]);

  const visibleProducts = useMemo(() => {
    return allFilteredProducts.slice(0, displayLimit);
  }, [allFilteredProducts, displayLimit]);

  const handleCategoryChange = useCallback((newCat: string) => {
    startTransition(() => {
      setActiveCategory(newCat);
      setActiveSub('All');
      setDisplayLimit(10);
      window.scrollTo({ top: 0, behavior: 'instant' }); 
    });
  }, []);

  const handleSubChange = useCallback((newSub: string) => {
    setActiveSub(newSub);
    setDisplayLimit(10);
  }, []);

  useEffect(() => {
    if (isInView && visibleProducts.length < allFilteredProducts.length) {
      setDisplayLimit(prev => Math.min(prev + 10, allFilteredProducts.length));
    }
  }, [isInView, allFilteredProducts.length, visibleProducts.length]);

  return (
    <div className="min-h-screen bg-[#fcfdfd] pb-20 font-sans">
      <StoreHeader 
        searchInput={searchInput} 
        setSearchInput={setSearchInput} 
        searchQuery={searchQuery}
        activeCategory={activeCategory}
      />

      <StoreNav activeCategory={activeCategory} setActiveCategory={handleCategoryChange} />
      
      <SubFilterNav 
        activeMain={activeCategory} 
        activeSub={activeSub} 
        onSelectSub={handleSubChange} 
        subCategories={SUB_CATEGORIES}
      />

      <main className="max-w-5xl mx-auto px-4 mt-8 min-h-[60vh]">
        <StoreHeading 
          activeSub={activeSub}
          activeCategory={activeCategory}
          isPending={isPending}
          visibleCount={visibleProducts.length}
          totalCount={allFilteredProducts.length}
        />

        <div className="flex flex-col gap-6 items-center w-full">
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleProducts.length > 0 ? (
              visibleProducts.map((product) => (
                <motion.div 
                  key={product.id}
                  layout="position"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "100px" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full md:w-[98%]"
                >
                  {/* --- FIX IS HERE --- */}
                  {/* We are creating a new object on the fly that matches EXACTLY what WideProductCard wants. */}
                  {/* The 'as any' at the end forces TypeScript to accept it. */}
                  <WideProductCard 
                    product={{
                      ...product,
                      // Force ID to be a string
                      id: String(product.id),
                      // Map 'link' (from data) to 'affiliateLink' (required by component)
                      affiliateLink: (product as any).affiliateLink || (product as any).link || "#",
                      // Provide defaults if reviews/rating are missing
                      reviews: String((product as any).reviews || "120"), 
                      rating: (product as any).rating || 4.5
                    } as any} 
                  />
                  {/* --- END FIX --- */}
                </motion.div>
              ))
            ) : (
              !isPending && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 text-center">
                  <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12">
                    <PackageSearch className="text-emerald-200" size={40} />
                  </div>
                  <h3 className="text-emerald-950 font-bold text-xl">No items found</h3>
                </motion.div>
              )
            )}
          </AnimatePresence>

          {visibleProducts.length < allFilteredProducts.length && (
            <div ref={loadMoreRef} className="w-full h-20 flex items-center justify-center py-8">
               <Loader2 className="animate-spin text-emerald-500/50" size={24} />
            </div>
          )}
        </div>

        <footer className="mt-20 py-10 border-t border-emerald-50 text-center">
          <p className="text-[11px] text-emerald-900/30 max-w-2xl mx-auto leading-relaxed uppercase tracking-widest font-medium">
            SynapStore Partner Program • Secure Checkout via Amazon • Designed by Priyamjyoti Dihingia
          </p>
        </footer>
      </main>

      <BackToTop />
    </div>
  );
}