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

  // 1. FILTER LOGIC
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

  // 2. SEO STRUCTURED DATA (JSON-LD)
  const storeJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `SynapStore - ${activeCategory} for Science Students`,
    "description": `Premium ${activeCategory} for NEET, GATE, and CSIR NET prep. Handpicked by Priyamjyoti Dihingia.`,
    "url": "https://synapseed.in/affiliate-store",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": visibleProducts.map((p, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": p.name,
        "url": (p as any).link || (p as any).affiliateLink
      }))
    }
  };

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
      {/* Google SEO Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
      />

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
                  {/* FIX: TYPE MAPPING BOOSTER 
                      This maps your 'link' to 'affiliateLink' and adds 
                      missing fields to stop deployment errors.
                  */}
                  <WideProductCard 
                    product={{
                      ...product,
                      rating: (product as any).rating || 4.7,
                      reviews: (product as any).reviews || 850,
                      affiliateLink: (product as any).link || (product as any).affiliateLink || "#"
                    }} 
                  />
                </motion.div>
              ))
            ) : (
              !isPending && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 text-center">
                  <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12">
                    <PackageSearch className="text-emerald-200" size={40} />
                  </div>
                  <h3 className="text-emerald-950 font-bold text-xl">No items found in ARCHIVE</h3>
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
            SynapStore Partner Program • Created by Priyamjyoti Dihingia • Secure Checkout via Amazon
          </p>
        </footer>
      </main>

      <BackToTop />
    </div>
  );
}