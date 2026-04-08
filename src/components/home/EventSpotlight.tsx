import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';

interface SpotlightProps {
  event: any;
}

export function EventSpotlight({ event }: SpotlightProps) {
  if (!event) return null;

  return (
    <Link href={`/events/${event.slug}`} className="group block h-full">
      <article className="relative h-full flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500">
        
        {/* --- TOP: Cinematic Image --- */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
          <Image
            src={event.thumbnail}
            alt={event.title}
            fill
            priority // SEO MAGIC: Tells the browser to download this immediately
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
          
          {/* Pulsing "Latest" Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full z-10 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-800">
              Latest Event
            </span>
          </div>
          
          {/* Category Tag */}
          <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full z-10">
            <span className="text-[9px] font-black uppercase tracking-widest text-white">
              {event.category}
            </span>
          </div>
        </div>

        {/* --- BOTTOM: SEO Content --- */}
        <div className="p-6 md:p-8 flex flex-col flex-1">
          {/* Semantic Time Tag */}
          <time className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
            <Calendar size={12} />
            {event.date_short}
          </time>
          
          {/* Primary H2 Tag for Google */}
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-4 group-hover:text-emerald-700 transition-colors line-clamp-2">
            {event.title}
          </h2>
          
          <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
            {event.description_short}
          </p>
          
          <div className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 group-hover:text-emerald-800 transition-colors">
            Explore Details 
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
        
      </article>
    </Link>
  );
}