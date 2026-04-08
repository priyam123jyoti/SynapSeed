import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';

// 1. Import Components
import Navbar from '@/components/layout/Navbar'; 
import BotanyHero from '@/components/layout/HeroSection';
import MobileBottomNavbar from '@/components/layout/MobileBottomNavbar';
import AIFloatingButton from '@/components/layout/AIFloatingButton';
import SubjectPillars from '@/components/home/SubjectPillars';
import FeatureShowcase from '@/components/home/FeatureShowcase';
import ImpactStats from '@/components/home/ImpactStats';
import ResearchMosaic from '@/components/home/ResearchMosaic';

// PERFORMANCE: Incremental Static Regeneration (ISR)
// This fixes the "Server responded slowly" error by caching the page.
export const revalidate = 3600; // Revalidate data at most once per hour

// 2. Extreme Metadata (SEO Item 2)
export const metadata: Metadata = {
  title: "Department of Botany | Excellence in Plant Science",
  description: "Advancing global plant science through research, biodiversity studies, and academic excellence at the University Botany Department.",
  alternates: { canonical: 'https://synap-seed.vercel.app' }, // Replace with your actual URL
  openGraph: {
    title: "Department of Botany",
    description: "Excellence in Plant Science and Research.",
    images: ['/og-image.jpg'], // Make sure this exists in your public folder
  }
};

// 3. SSR Data Fetching (SEO Item 1)
async function getLatestEvents() {
  // We fetch here on the server so the HTML is fully populated for Google
  const { data, error } = await supabase
    .from('events')
    .select('id, title, slug, category, date_short, description_short, thumbnail')
    .order('created_at', { ascending: false })
    .limit(10);
    
  if (error) {
    console.error("Supabase Error:", error);
    return [];
  }
  return data || [];
}

export default async function Home() {
  // Fetching data at the top level of the Server Component
  const initialEvents = await getLatestEvents();

  return (
    <div className="w-full bg-[#f8fafc] flex flex-col min-h-screen">
      {/* Navigation should be outside <main> but inside the wrapper */}
      <Navbar /> 
      
      {/* 4. Semantic Main (SEO Item 4) */}
      <main id="main-content" className="flex-grow">
        <BotanyHero />
        
        {/* Research Mosaic provides high-value internal links */}
        <ResearchMosaic />

        <div className="p-1 md:p-10">
          <div className="max-w-[1600px] mx-auto w-full space-y-20">
            
            {/* PERFORMANCE: Passing initialEvents prevents a second fetch on the client */}

            
            <SubjectPillars />
            <FeatureShowcase />
            <ImpactStats />
          </div>
        </div>
      </main>
      
      {/* Footer / Interactive Elements */}
      <AIFloatingButton />
      <MobileBottomNavbar />
    </div>
  );
}