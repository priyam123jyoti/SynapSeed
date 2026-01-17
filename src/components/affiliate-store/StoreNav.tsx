"use client";

import { useEffect, useRef, memo } from 'react';
import { Book, Tv, Award, Smartphone, Microscope } from 'lucide-react';
import { motion, animate } from 'framer-motion';

const storeCategories = [
  { name: 'Books', icon: Book },
  { name: 'Courses', icon: Tv },
  { name: 'Certificates', icon: Award },
  { name: 'Tech & Tabs', icon: Smartphone },
  { name: 'Lab Gear', icon: Microscope },
];

interface StoreNavProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

// Wrapped in memo to prevent unnecessary re-renders during store filtering
const StoreNav = memo(({ activeCategory, setActiveCategory }: StoreNavProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    // Slow glide peek animation
    const controls = animate(0, 120, {
      duration: 1.8, 
      ease: "easeInOut",
      onUpdate: (value) => {
        if (node) node.scrollLeft = value;
      },
      onComplete: () => {
        if (!node) return;
        setTimeout(() => {
          animate(120, 0, {
            duration: 1.2,
            ease: "easeInOut",
            onUpdate: (value) => {
              if (node) node.scrollLeft = value;
            }
          });
        }, 400); 
      }
    });

    return () => controls.stop();
  }, []);

  return (
    <div className="w-full bg-white border-b border-emerald-100 sticky top-0 z-40 transform-gpu will-change-transform">
      <div 
        ref={scrollRef}
        className="max-w-7xl mx-auto flex items-center justify-start md:justify-center gap-2 overflow-x-auto no-scrollbar py-2 px-6"
        style={{ scrollBehavior: 'auto' }}
      >
        {storeCategories.map((cat, index) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.name;
          
          return (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all active:scale-95 ${
                isActive 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <Icon size={16} />
              {cat.name}
            </motion.button>
          );
        })}
      </div>

      {/* Ensuring no-scrollbar logic is baked in */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
});

StoreNav.displayName = 'StoreNav';

export default StoreNav;