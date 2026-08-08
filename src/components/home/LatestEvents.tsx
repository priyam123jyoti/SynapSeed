import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

export default async function LatestEvents() {
  // Fetch only the 3 most recent events
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  if (!events || events.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-sm font-black text-emerald-600 uppercase tracking-[0.3em] mb-4">
              Departmental Archives
            </h2>
            <p className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter">
              Latest <span className="text-emerald-500 text-outline-sm">Events</span> & Reports
            </p>
          </div>
          <Link 
            href="/events" 
            className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors"
          >
            View Full Gallery <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event) => (
            <Link key={event.id} href={`/events/${event.slug}`} className="group">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100">
                {event.thumbnail && (
                  <Image
                    src={event.thumbnail}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                
                <div className="absolute bottom-0 p-6">
                  <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                    <Calendar size={12} />
                    {event.date_short}
                  </div>
                  <h3 className="text-xl font-bold text-white leading-tight group-hover:text-emerald-300 transition-colors">
                    {event.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}