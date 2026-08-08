import Image from "next/image";
import { cn } from "@/lib/utils";
import { CalendarDays, MapPin } from "lucide-react";

interface EventHeroProps {
  thumbnail: string;
  title: string;
  category: string;
  date: string;
}

export default function EventHero({ thumbnail, title, category, date }: EventHeroProps) {
  return (
    <header className="relative w-full rounded-2xl overflow-hidden shadow-sm bg-slate-200 border border-emerald-100">
      {/* Container for the Hero Image */}
      <div className="relative aspect-[16/9] lg:aspect-[21/7] w-full bg-slate-800">
        <Image 
          src={thumbnail} 
          alt={`${title} - Botany Department Event Cover`} 
          fill 
          priority 
          className="object-cover z-0" 
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
        
        {/* Cinematic Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-emerald-950 via-emerald-950/20 to-transparent"></div>
        
        {/* Hero Content */}
        <div className="absolute inset-0 z-20 p-6 lg:p-10 flex flex-col justify-end">
          <span className="bg-lime-400 text-emerald-950 font-black text-[9px] uppercase tracking-[0.3em] px-4 py-1 rounded-full w-fit mb-3">
            {category}
          </span>
          
          {/* UPDATED: Changed typography classes to reduce text size and style font */}
          <h1 className="text-2xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight drop-shadow-sm font-sans">
            {title}
          </h1>
        </div>
      </div>

      {/* Meta Information Bar */}
      <div className="bg-white px-8 py-5 flex flex-wrap gap-6 items-center border-t border-emerald-50">
          <InfoPill icon={CalendarDays} text={date} label="Event Date" />
          <InfoPill icon={MapPin} text="Dhakuakhana College, Assam" label="Location" />
      </div>
    </header>
  );
}

interface InfoPillProps {
  icon: any;
  text: string;
  label: string; 
}

function InfoPill({ icon: Icon, text, label }: InfoPillProps) {
  return (
    <div 
      className="flex items-center gap-2.5 text-emerald-900 font-bold text-[10px] uppercase tracking-widest"
      aria-label={`${label}: ${text}`}
    >
      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
        <Icon className="w-4 h-4" aria-hidden="true" />
      </div>
      <span>{text}</span>
    </div>
  );
}