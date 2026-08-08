"use client";

import { useState, useEffect, TouchEvent } from "react";
import { Syne } from "next/font/google";
import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";

const crazyFont = Syne({ subsets: ["latin"], weight: ["800"] });

interface EventAlbumProps {
  images: string[];
  eventTitle: string; // New prop
  eventSlug: string;  // New prop
}

export default function EventAlbum({ images, eventTitle, eventSlug }: EventAlbumProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const albumImages = images?.slice(0, 15) || [];

  /**
   * SEO FIX: JSON-LD for Image Search
   * This tells Google these images belong to a specific event gallery.
   */
  const imageSchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": `Gallery for ${eventTitle}`,
    "mainEntityOfPage": `https://synap-seed.vercel.app/events/${eventSlug}`,
    "image": albumImages.map((img, idx) => ({
      "@type": "ImageObject",
      "contentUrl": img,
      "name": `${eventTitle} - Photo ${idx + 1}`,
      "author": "Department of Botany, Dhakuakhana College"
    }))
  };

  const openImage = (index: number) => setSelectedIndex(index);
  const closeImage = () => setSelectedIndex(null);

  const nextImage = (e?: any) => {
    e?.stopPropagation();
    if (selectedIndex !== null) setSelectedIndex((selectedIndex + 1) % albumImages.length);
  };

  const prevImage = (e?: any) => {
    e?.stopPropagation();
    if (selectedIndex !== null) setSelectedIndex((selectedIndex - 1 + albumImages.length) % albumImages.length);
  };

  // Swipe Logic
  const onTouchStart = (e: TouchEvent) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
  const onTouchMove = (e: TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) nextImage();
    if (distance < -50) prevImage();
  };

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
    <section className="w-full bg-emerald-50/20 py-20" aria-label="Event Photo Gallery">
      {/* Injecting the Image Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageSchema) }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">
            Visual Documentation
          </span>
          <h2 className={`${crazyFont.className} text-4xl lg:text-6xl text-emerald-900 tracking-tighter`}>
            Event <span className="text-lime-500">Gallery</span>
          </h2>
        </div>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
          {albumImages.map((img, idx) => (
            <div 
              key={idx} 
              onClick={() => openImage(idx)}
              className="relative break-inside-avoid mb-4 group rounded-xl overflow-hidden border-[4px] border-white shadow-sm hover:shadow-xl transition-all duration-300 bg-white cursor-zoom-in"
            >
              <img 
                src={img} 
                // SEO FIX: Highly descriptive alt tag helps Google Image Search index this photo
                alt={`${eventTitle} - Botany Department Activity Photo ${idx + 1}`}
                loading="lazy"
                className="w-full h-auto block object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))}
        </div>

        {/* --- LIGHTBOX MODAL --- */}
        {selectedIndex !== null && (
          <div 
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4"
            onClick={closeImage}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <button onClick={closeImage} className="absolute top-6 right-6 text-white/50 hover:text-white z-[110]">
              <X className="w-8 h-8 md:w-10 md:h-10" />
            </button>

            <button onClick={prevImage} className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-white p-4 z-[110]">
              <ChevronLeft className="w-12 h-12" />
            </button>

            <div className="relative w-full max-w-5xl h-full flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
              <img 
                src={albumImages[selectedIndex]} 
                alt={`${eventTitle} view ${selectedIndex + 1}`} 
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl pointer-events-none" 
                onClick={(e) => e.stopPropagation()} 
              />
              
              {/* NAVIGATION FIX: Direct link back to the specific event page */}
              <div className="mt-8 flex flex-col items-center gap-4">
                <Link 
                  href={`/events/${eventSlug}`}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={14} />
                  View Full Event Details
                </Link>
                
                <div className="text-white/40 font-mono text-[9px] tracking-widest uppercase">
                  Photo {selectedIndex + 1} of {albumImages.length} — {eventTitle}
                </div>
              </div>
            </div>

            <button onClick={nextImage} className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-white p-4 z-[110]">
              <ChevronRight className="w-12 h-12" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}