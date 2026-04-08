import Image from "next/image";
import { Syne } from "next/font/google";
import { cn } from "@/lib/utils";
import { CalendarDays, MapPin } from "lucide-react";

const crazyFont = Syne({ subsets: ["latin"], weight: ["800"] });

interface EventHeroProps {
  thumbnail: string;
  title: string;
  category: string;
  date: string;
}

export default function EventHero({ thumbnail, title, category, date }: EventHeroProps) {
  return (
    <header className="relative w-full rounded-2xl overflow-hidden shadow-1xl bg-slate-200 border border-emerald-100">
      <div className="relative aspect-[16/9] lg:aspect-[21/7] w-full">
        <Image 
          src={thumbnail} 
          alt={title} 
          fill 
          priority 
          unoptimized
          className="object-cover z-0" 
          sizes="100vw"
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-emerald-950 via-emerald-950/20 to-transparent"></div>
        
        <div className="absolute inset-0 z-20 p-6 lg:p-12 flex flex-col justify-end">
          <span className="bg-lime-400 text-emerald-950 font-black text-[9px] uppercase tracking-[0.3em] px-4 py-1 rounded-full w-fit mb-4">
            {category}
          </span>
          <h1 className={cn(crazyFont.className, "text-3xl lg:text-7xl font-black tracking-tighter text-white leading-[0.9] drop-shadow-md")}>
            {title}
          </h1>
        </div>
      </div>

      <div className="bg-white px-8 py-5 flex flex-wrap gap-6 items-center border-t border-emerald-50">
          <InfoPill icon={CalendarDays} text={date} />
          <InfoPill icon={MapPin} text="Dhakuakhana College, Assam" />
      </div>
    </header>
  );
}

function InfoPill({ icon: Icon, text }: { icon: any, text: string }) {
  return (
    <div className="flex items-center gap-2.5 text-emerald-900 font-bold text-[10px] uppercase tracking-widest">
      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
        <Icon className="w-4 h-4" />
      </div>
      {text}
    </div>
  );
}