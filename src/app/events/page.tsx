import { supabase } from "@/lib/supabase";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Lock } from "lucide-react"; // Added a small icon for the button
import Navbar from "@/components/layout/Navbar";
import MobileBottomNavbar from "@/components/layout/MobileBottomNavbar";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Departmental Events | Botany Dept | Dhakuakhana College",
  description: "Official calendar of botanical events, seminars, and field trips at Dhakuakhana College (Autonomous).",
  alternates: { canonical: "https://yourdomain.com/events" },
};

export default async function EventsPage() {
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Supabase Error:", error);
  }

  const displayEvents = events || [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    "name": "Botany Department Events",
    "description": "Scientific seminars and field trips at Dhakuakhana College.",
    "subEvent": displayEvents.map((event: any) => ({
      "@type": "Event",
      "name": event.title,
      "startDate": event.date_short,
      "description": event.description_short,
      "image": event.thumbnail, 
      "location": { "@type": "Place", "name": "Dhakuakhana College" }
    }))
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar/>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* --- Full-Width Cinematic Hero --- */}
      <section className="relative w-full h-[50vh] lg:h-[70vh] overflow-hidden bg-slate-900">
        <Image 
          src="/images/dhakuakhana-college-botany-department.jpg"
          alt="Department of Botany, Dhakuakhana College"
          fill
          priority
          className="object-cover opacity-70 z-0"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="relative z-20 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
          <div className="max-w-3xl">
            <span className="text-emerald-400 font-bold uppercase tracking-[0.4em] text-xs mb-4 block">
              Dhakuakhana College
            </span>
            <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tighter">
              Events & <br /> 
              <span className="text-emerald-500">Expeditions</span>
            </h1>
            <p className="text-slate-200 text-lg leading-relaxed font-medium max-w-xl">
              Exploring the biodiversity of Assam through academic seminars, 
              field research, and botanical workshops.
            </p>
          </div>
        </div>
      </section>

      {/* --- Events Grid Section --- */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        
        {/* --- THE FIX: Flex Header for Heading + Staff Login --- */}
        <div className="mb-12 border-b border-slate-100 pb-6 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">
            Latest Updates
          </h2>
          
          <Link 
            href="/events/admin" 
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-700 hover:text-emerald-600 transition-colors bg-slate-50 hover:bg-emerald-50 px-4 py-2 rounded-full border border-green-700 hover:border-emerald-200"
          >
            <Lock size={12} />
            Staff Login
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {displayEvents.length === 0 ? (
             <div className="col-span-full py-20 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No events published yet.</p>
             </div>
          ) : (
            displayEvents.map((event: any) => (
              <EventCard key={event.id} event={event} />
            ))
          )}
        </div>
      </section>

      {/* --- Cleaned up Footer --- */}
      <footer className="mt-20 border-t border-emerald-100 py-10 text-center">
        <p className="text-slate-400 text-[10px] uppercase tracking-widest">
          © {new Date().getFullYear()} Department of Botany
        </p>
      </footer>
      <MobileBottomNavbar/>
    </main>
  );
}

function EventCard({ event }: { event: any }) {
  return (
    <Link href={`/events/${event.slug}`} className="group">
      <article className="h-full bg-white border border-slate-100 rounded-sm overflow-hidden flex flex-col hover:border-emerald-200 transition-all duration-300 shadow-sm">
        
        <div className="relative aspect-video w-full overflow-hidden bg-slate-200">
          {event.thumbnail ? (
            <Image 
              src={event.thumbnail} 
              alt={event.title} 
              fill 
              unoptimized
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                No Thumbnail
            </div>
          )}
          
          <div className="absolute top-0 left-0 bg-black text-white px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] flex flex-col items-center">
             {event.date_short}
          </div>
        </div>

        <div className="p-8 flex flex-col flex-grow">
          <span className="text-emerald-600 text-[10px] font-black uppercase tracking-[0.3em] mb-3">
            {event.category}
          </span>
          <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-emerald-800 transition-colors">
            {event.title}
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-8 font-medium">
            {event.description_short}
          </p>
          
          <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
              Learn More <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}