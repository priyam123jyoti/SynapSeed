import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';

interface SwimRowProps {
  events: any[];
}

export function EventSwimRow({ events }: SwimRowProps) {
  if (!events || events.length === 0) return null;

  return (
    <div className="relative w-full">
      {/* The Fade Overlay: 
        Creates a subtle gradient on the right edge to visually hint that there are more cards to scroll to.
      */}
      <div className="absolute right-0 top-0 bottom-0 w-16 lg:w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

      {/* The Scroll Container: 
        Uses standard Tailwind to hide the scrollbar but keep the functionality.
        snap-x and snap-mandatory ensure the cards lock into place beautifully.
      */}
      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {events.map((event) => (
          <Link
            href={`/events/${event.slug}`}
            key={event.id}
            className="snap-start shrink-0 w-[280px] md:w-[320px] group flex flex-col"
          >
            {/* Image Container */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-slate-100 border border-slate-200">
              <Image
                src={event.thumbnail}
                alt={event.title}
                fill
                loading="lazy" // SEO/Speed: We defer loading until the user scrolls
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                sizes="(max-width: 768px) 80vw, 320px"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full z-10">
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-800">
                  {event.category}
                </span>
              </div>
            </div>

            {/* Text Content */}
            <div className="flex flex-col flex-1 px-1">
              <time className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-2">
                <Calendar size={12} />
                {event.date_short}
              </time>
              
              {/* Secondary H3 Tag for Google */}
              <h3 className="text-lg font-bold text-slate-900 leading-snug tracking-tight mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
                {event.title}
              </h3>
              
              <div className="mt-auto pt-3 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-600 transition-colors">
                View Event <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}