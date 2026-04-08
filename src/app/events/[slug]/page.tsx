import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Syne } from "next/font/google";
import { ArrowLeft } from "lucide-react";
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

const getEvent = cache(async (slug: string) => {
  const { data, error } = await supabase.from('events').select('*').eq('slug', slug).single();
  if (error || !data) return null;
  return data;
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: "Event Not Found" };
  return { title: `${event.title} | Botany Dept` };
}

export default async function EventDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) notFound();

  return (
    <main className="min-h-screen bg-emerald-50/40 selection:bg-lime-300 selection:text-emerald-900">
      <Navbar/>
      
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16">
          <div className="lg:col-span-8">
            <article className="prose prose-emerald max-w-none">
              <h2 className={cn(crazyFont.className, "text-xl lg:text-2xl text-emerald-900 mb-8 uppercase tracking-widest")}>
                Expedition Description
              </h2>
              <div className="text-slate-700 leading-relaxed font-medium text-lg lg:text-xl first-letter:text-7xl first-letter:font-black first-letter:text-emerald-600 first-letter:mr-3 first-letter:float-left first-letter:leading-[0.7] first-letter:mt-2">
                {event.full_description || event.description_short}
              </div>
            </article>
          </div>

          <EventSidebar objectives={event.key_objectives} />
        </div>

        {event.gallery?.length > 0 && (
          <div className="mt-20 border-t border-emerald-100 pt-16">
             <EventAlbum images={event.gallery} />
          </div>
        )}
      </div>
      <MobileBottomNavbar/>
    </main>
  );
}