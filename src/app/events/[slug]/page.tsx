import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Syne } from "next/font/google";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cache } from "react";
import { cn } from "@/lib/utils";

import Navbar from "@/components/layout/Navbar";
import MobileBottomNavbar from "@/components/layout/MobileBottomNavbar";
import EventAlbum from "@/components/events/EventAlbum";
import EventHero from "@/components/events/EventHero";
import EventSidebar from "@/components/events/EventSidebar";

const crazyFont = Syne({ subsets: ["latin"], weight: ["800"] });

const getEvent = cache(async (slug: string) => {
  const { data, error } = await supabase.from('events').select('*').eq('slug', slug).single();
  if (error || !data) return null;
  return data;
});

// EXTREME SEO FIX 1: Rich Dynamic Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  
  if (!event) return { title: "Event Not Found" };
  
  return { 
    title: `${event.title} | Botany Dept Events`,
    description: event.description_short,
    alternates: {
      canonical: `https://yourdomain.com/events/${slug}`
    },
    openGraph: {
      title: event.title,
      description: event.description_short,
      url: `https://yourdomain.com/events/${slug}`,
      siteName: 'Dhakuakhana College Botany Dept',
      images: [{ url: event.thumbnail, width: 1200, height: 630 }],
      locale: 'en_IN',
      type: 'article',
    }
  };
}

export default async function EventDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) notFound();

  // EXTREME SEO FIX 2: Individual Event Schema
  // Note: ensure event.date_iso exists in your DB (e.g., "2026-10-24T09:00:00+05:30")
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "startDate": event.date_iso || event.date_short, // Use ISO format!
    "endDate": event.end_date_iso || event.date_iso,
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": "Dhakuakhana College",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Dhakuakhana",
        "addressRegion": "Assam",
        "addressCountry": "IN"
      }
    },
    "image": [event.thumbnail],
    "description": event.description_short,
    "organizer": {
      "@type": "Organization",
      "name": "Department of Botany, Dhakuakhana College",
      "url": "https://yourdomain.com"
    }
  };

  return (
    <main className="min-h-screen bg-emerald-50/40 selection:bg-lime-300 selection:text-emerald-900">
      {/* Inject Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar/>
      
      {/* Rest of your component remains exactly the same */}
      <div className="max-w-6xl mx-auto px-4 lg:px-0 pt-8 pb-24">
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
        
        {/* ... Grid, Sidebar, Album ... */}
      </div>
      <MobileBottomNavbar/>
    </main>
  );
}