"use client";

import { useState, useEffect, TouchEvent } from "react";
import { Syne } from "next/font/google";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const crazyFont = Syne({ subsets: ["latin"], weight: ["800"] });

interface EventAlbumProps {
  images: string[];
}

export default function EventAlbum({ images }: EventAlbumProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  // Swipe State
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const albumImages = images?.slice(0, 10) || [];

  // --- HANDLERS ---
  const openImage = (index: number) => setSelectedIndex(index);
  const closeImage = () => setSelectedIndex(null);

  const nextImage = (e?: React.MouseEvent | TouchEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % albumImages.length);
    }
  };

  const prevImage = (e?: React.MouseEvent | TouchEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + albumImages.length) % albumImages.length);
    }
  };

  // --- SWIPE LOGIC ---
  const minSwipeDistance = 50; // Minimum px to trigger swipe

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null); 
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) nextImage();
    if (isRightSwipe) prevImage();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") closeImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  if (albumImages.length === 0) return null;

  return (
    <section className="w-full bg-emerald-50/20 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">
            Visual Documentation
          </span>
          <h2 className={`${crazyFont.className} text-4xl lg:text-6xl text-emerald-900 tracking-tighter`}>
            All <span className="text-lime-500">Albums</span>
          </h2>
        </div>

        {/* --- GRID --- */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
          {albumImages.map((img, idx) => (
            <div 
              key={idx} 
              onClick={() => openImage(idx)}
              className="relative break-inside-avoid mb-4 group rounded-xl overflow-hidden border-[4px] border-white shadow-sm hover:shadow-xl transition-all duration-300 bg-white cursor-zoom-in"
            >
              <img 
                src={img} 
                alt={`Botany Archive ${idx + 1}`}
                className="w-full h-auto block object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))}
        </div>

        {/* --- LIGHTBOX MODAL --- */}
        {selectedIndex !== null && (
          <div 
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-500"
            onClick={closeImage}
            // Swipe event listeners attached here
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Close Button */}
            <button 
              onClick={closeImage}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-[110]"
            >
              <X className="w-8 h-8 md:w-10 md:h-10" />
            </button>

            {/* Desktop Arrows (Hidden on Mobile) */}
            <button 
              onClick={prevImage}
              className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-all hover:scale-110 p-4 z-[110]"
            >
              <ChevronLeft className="w-12 h-12" />
            </button>

            {/* The Main Image */}
            <div className="relative w-full h-full flex items-center justify-center animate-in zoom-in-95 duration-300 select-none">
              <img 
                src={albumImages[selectedIndex]} 
                alt="Enlarged view" 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl pointer-events-none" 
                onClick={(e) => e.stopPropagation()} 
              />
              
              {/* Counter Text */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 font-mono text-[10px] tracking-widest uppercase">
                {selectedIndex + 1} / {albumImages.length} — Swipe to browse
              </div>
            </div>

            <button 
              onClick={nextImage}
              className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-all hover:scale-110 p-4 z-[110]"
            >
              <ChevronRight className="w-12 h-12" />
            </button>
          </div>
        )}

        <footer className="mt-10 pt-6 border-t border-emerald-100 flex justify-between items-center">
          <p className="text-[9px] font-bold text-emerald-800/40 uppercase tracking-widest">
            &copy; 2026 Botany Department Archive
          </p>
        </footer>
      </div>
    </section>
  );
}