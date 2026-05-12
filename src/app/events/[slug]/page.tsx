import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Syne } from "next/font/google";
import { ArrowLeft, Home, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cache } from "react";
import { cn } from "@/lib/utils";

// Component Imports
import Navbar from "@/components/layout/Navbar";
import MobileBottomNavbar from "@/components/layout/MobileBottomNavbar";
import EventAlbum from "@/components/events/EventAlbum";
import EventHero from "@/components/events/EventHero";
import EventSidebar from "@/components/events/EventSidebar";

const crazyFont = Syne({ subsets: ["latin"], weight: ["800"] });

// 1. SEO PERFORMANCE WIN: 
// Allows Google to see this as a fast, static page rather than waiting for a DB query.
export const revalidate = 3600; 

const getEvent = cache(async (slug: string) => {
  const { data, error } = await supabase.from('events').select('*').eq('slug', slug).single();
  if (error || !data) return null;
  return data;
});

// 2. DYNAMIC METADATA
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  
  if (!event) return { title: "Event Not Found" };

  const fullTitle = `${event.title} | Botany Department, Dhakuakhana College`;
  const description = event.description_short || `Official documentation of the botanical expedition: ${event.title}`;

  return {
    title: fullTitle,
    description: description,
    alternates: {
      canonical: `https://synap-seed.vercel.app/events/${slug}`,
    },
    openGraph: {
      title: fullTitle,
      description: description,
      url: `https://synap-seed.vercel.app/events/${slug}`,
      siteName: 'Dhakuakhana College Botany Portal',
      images: [{ url: event.thumbnail, width: 1200, height: 630, alt: `Cover image for ${event.title}` }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: description,
      images: [event.thumbnail],
    },
  };
}

export default async function EventDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) notFound();

  // 3. ENHANCED JSON-LD STRUCTURED DATA
  // This "Organiser" section links this page to the already-indexed Faculty page.
  // Inside your EventDetailsPage function:

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  "name": event.title,
  "description": event.description_short,
  "image": event.thumbnail,
  "startDate": event.date_iso || event.date_short,
  // ISSUE FIX: endDate (Google likes to know when it ends)
  // If you don't have an end date in Supabase, we can default it to 4 hours after start
  "endDate": event.end_date_iso || event.date_iso || event.date_short, 
  
  // ISSUE FIX: eventStatus (Tells Google the event isn't cancelled)
  "eventStatus": "https://schema.org/EventScheduled",
  
  // ISSUE FIX: offers (Tells Google it's a free educational event)
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock",
    "url": `https://synap-seed.vercel.app/events/${slug}`
  },

  // ISSUE FIX: performer (For college events, the Department is the performer)
  "performer": {
    "@type": "Organization",
    "name": "Department of Botany Students & Faculty"
  },

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
    "url": "https://synap-seed.vercel.app",
    "sameAs": [
      "https://synap-seed.vercel.app/faculty",
      "https://dhakuakhanacollege.ac.in"
    ]
  }
};

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-emerald-50/40 selection:bg-lime-300 selection:text-emerald-900">
        <Navbar />
        
        <div className="max-w-6xl mx-auto px-4 lg:px-0 pt-8 pb-24">
          
          {/* BREADCRUMBS: Helps bots understand site hierarchy */}
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-800/50 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-emerald-600 flex items-center gap-1"><Home size={10}/> Home</Link>
            <ChevronRight size={10} />
            <Link href="/events" className="hover:text-emerald-600">Events</Link>
            <ChevronRight size={10} />
            <span className="text-emerald-600 truncate max-w-[150px]">{event.title}</span>
          </nav>

          <Link href="/events" className="group inline-flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-8 bg-white px-4 py-2 rounded-md shadow-sm border border-emerald-100 hover:bg-emerald-50 transition-all">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> 
            Back to Events
          </Link>

          <EventHero 
            thumbnail={event.thumbnail} 
            title={event.title} 
            category={event.category} 
            date={event.date_short} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16">
            <section className="lg:col-span-8">
              <article className="prose prose-emerald max-w-none">
                <h2 className={cn(crazyFont.className, "text-xl lg:text-2xl text-emerald-900 mb-8 uppercase tracking-widest flex items-center gap-3")}>
                  <span className="w-10 h-[1px] bg-emerald-300"></span>
                  Expedition Description
                </h2>
                <div className="text-slate-700 leading-relaxed font-medium text-lg lg:text-xl first-letter:text-7xl first-letter:font-black first-letter:text-emerald-600 first-letter:mr-3 first-letter:float-left first-letter:leading-[0.7] first-letter:mt-2">
                  {event.full_description || event.description_short}
                </div>
              </article>
            </section>

            <EventSidebar objectives={event.key_objectives} />
          </div>

          {event.gallery?.length > 0 && (
            <section className="mt-20 border-t border-emerald-100 pt-16" aria-label="Event Image Gallery">
               <EventAlbum images={event.gallery} />
            </section>
          )}
        </div>
        <MobileBottomNavbar />
      </main>
    </>
  );
}