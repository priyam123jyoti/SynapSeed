import { supabase } from "@/lib/supabase";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Lock, Calendar, MapPin } from "lucide-react"; 
import Navbar from "@/components/layout/Navbar";
import MobileBottomNavbar from "@/components/layout/MobileBottomNavbar";

// SEO MASTER MOVE: 
// We change from "force-dynamic" to a 1-hour revalidation. 
// This allows Google to "cache" the page like a static file, 
// making it rank much higher.
export const revalidate = 3600; 

export const metadata: Metadata = {
  title: "Official Botanical Events & Expeditions | Dhakuakhana College",
  description: "Browse the latest botanical seminars, field expeditions, and research workshops at the Department of Botany, Dhakuakhana College (Autonomous).",
  alternates: { 
    canonical: "https://synap-seed.vercel.app/events" 
  },
  openGraph: {
    title: "Botanical Events Archive | Dhakuakhana College",
    description: "Documenting botanical research and student expeditions in Assam.",
    images: ['/images/dhakuakhana-college-botany-department.jpg']
  }
};

export default async function EventsPage() {
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) console.error("Supabase Error:", error);
  const displayEvents = events || [];

  // Enhanced JSON-LD: Linking these events to the College Authority
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Botany Department Events List",
    "itemListElement": displayEvents.map((event: any, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Event",
        "name": event.title,
        "startDate": event.date_iso || event.date_short,
        "description": event.description_short,
        "image": event.thumbnail,
        "location": {
          "@type": "Place",
          "name": "Dhakuakhana College (Autonomous)",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Dhakuakhana",
            "addressRegion": "Assam",
            "addressCountry": "IN"
          }
        },
        "organizer": {
          "@type": "Organization",
          "name": "Department of Botany, Dhakuakhana College",
          "url": "https://synap-seed.vercel.app"
        }
      }
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
      <section className="relative w-full h-[50vh] lg:h-[60vh] overflow-hidden bg-slate-900">
        <Image 
          src="/images/dhakuakhana-college-botany-department.jpg"
          alt="Research students and faculty at Dhakuakhana College Botany Department"
          fill
          priority
          className="object-cover opacity-60 z-0"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10"></div>
        <div className="relative z-20 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-[0.3em] text-[10px] mb-4">
               <Link href="/">Home</Link>
               <span>/</span>
               <span className="text-white">Events</span>
            </nav>
            <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tighter">
              Academic <br /> 
              <span className="text-emerald-500">Expeditions</span>
            </h1>
            <p className="text-slate-200 text-lg leading-relaxed font-medium max-w-xl border-l-2 border-emerald-500 pl-6">
              Official record of seminars, field studies, and botanical workshops 
              conducted by Dhakuakhana College.
            </p>
          </div>
        </div>
      </section>

      {/* --- Events Grid Section --- */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-12 border-b border-slate-100 pb-6 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
            <span className="w-8 h-[2px] bg-emerald-500"></span>
            Archive Catalog
          </h2>
          
          <Link 
            href="/events/admin" 
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 hover:bg-emerald-100 transition-all"
          >
            <Lock size={12} />
            Staff Portal
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {displayEvents.length === 0 ? (
             <div className="col-span-full py-20 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No records found in database.</p>
             </div>
          ) : (
            displayEvents.map((event: any) => (
              <EventCard key={event.id} event={event} />
            ))
          )}
        </div>
      </section>

      <footer className="mt-20 border-t border-slate-100 py-10 text-center">
        <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">
          Official Event Registry &bull; Department of Botany
        </p>
      </footer>
      <MobileBottomNavbar/>
    </main>
  );
}

function EventCard({ event }: { event: any }) {
  return (
    <Link href={`/events/${event.slug}`} className="group">
      <article className="h-full bg-white border border-slate-100 rounded-2xl overflow-hidden flex flex-col hover:shadow-xl hover:border-emerald-200 transition-all duration-500">
        
        <div className="relative aspect-video w-full overflow-hidden bg-slate-200">
          {event.thumbnail ? (
            <Image 
              src={event.thumbnail} 
              // SEO FIX: Highly descriptive Alt text
              alt={`${event.title} - Botanical event at Dhakuakhana College`} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-[10px] uppercase tracking-widest">
              Image Pending
            </div>
          )}
          
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-emerald-900 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
             {event.date_short}
          </div>
        </div>

        <div className="p-8 flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-3">
             <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
             <span className="text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em]">
               {event.category}
             </span>
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-emerald-700 transition-colors">
            {event.title}
          </h3>
          
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-8 font-medium">
            {event.description_short}
          </p>
          
          <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest group-hover:gap-4 transition-all flex items-center gap-2">
              View Expedition Details <span>→</span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}