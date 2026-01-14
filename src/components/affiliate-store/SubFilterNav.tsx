"use client";

import { useEffect, useRef } from 'react';
import { motion, animate, AnimatePresence } from 'framer-motion';

interface SubFilterProps {
  activeMain: string;
  activeSub: string;
  onSelectSub: (sub: string) => void;
  subCategories: Record<string, string[]>;
}

export default function SubFilterNav({ activeMain, activeSub, onSelectSub, subCategories }: SubFilterProps) {
  const currentOptions = subCategories[activeMain] || [];
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    // 2.5s Total Custom Glide (Tease Scroll to show more content)
    const controls = animate(0, 80, {
      duration: 1.4, // Glide out
      ease: "easeInOut",
      onUpdate: (value) => {
        node.scrollLeft = value;
      },
      onComplete: () => {
        setTimeout(() => {
          animate(80, 0, {
            duration: 0.9, // Glide back
            ease: "easeInOut",
            onUpdate: (value) => {
              node.scrollLeft = value;
            }
          });
        }, 200); // Tiny pause at the peak
      }
    });

    return () => controls.stop();
  }, [activeMain]); // Trigger glide every time the main category changes

  return (
    <div className="w-full bg-[#fcfdfd] border-b border-emerald-50/50">
      <div 
        ref={scrollRef}
        className="max-w-7xl mx-auto flex items-center sm:justify-center gap-2 overflow-x-auto py-3 px-6 no-scrollbar"
        style={{ scrollBehavior: 'auto' }} 
      >
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeMain} // Key forces re-animation when main cat changes
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* "All" Option */}
            <button
              onClick={() => onSelectSub('All')}
              className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all whitespace-nowrap shadow-sm border ${
                activeSub === 'All' 
                ? 'bg-emerald-950 text-white border-emerald-950' 
                : 'bg-white text-emerald-900/30 border-emerald-100 hover:border-emerald-300'
              }`}
            >
              All {activeMain}
            </button>

            {/* Dynamic Options */}
            {currentOptions.map((sub, index) => (
              <motion.button
                key={sub}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => onSelectSub(sub)}
                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all whitespace-nowrap shadow-sm border ${
                  activeSub === sub 
                  ? 'bg-emerald-950 text-white border-emerald-950' 
                  : 'bg-white text-emerald-900/30 border-emerald-100 hover:border-emerald-300'
                }`}
              >
                {sub}
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Internal CSS to hide scrollbar while keeping the logic inside the component */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}