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


// PERFORMANCE: Incremental Static Regeneration (ISR)
export const revalidate = 3600; 

// 2. Extreme Metadata (SEO)
export const metadata: Metadata = {
  title: "Department of Botany | Dhakuakhana College - AI Learning Portal",
  description: "Official Botany Department portal at Dhakuakhana College. Explore interactive AI mind maps, take science quizzes in Physics, Chemistry, Botany, and Zoology, and view our research.",
  alternates: { canonical: 'https://synap-seed.vercel.app' }, 
  keywords: ["Botany Dhakuakhana College", "Assam Botany Research", "AI Quiz Generator Science", "Botany Mind Maps"],
  openGraph: {
    title: "Botany Department | Dhakuakhana College",
    description: "Visualizing Plant Science with AI-powered mind maps and quizzes.",
    images: '/botany-department-dhakuakhana-college.png',
  }
};

// 3. SSR Data Fetching
async function getLatestEvents() {
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
  const initialEvents = await getLatestEvents();

  return (
    <div className="w-full bg-[#f8fafc] flex flex-col min-h-screen">
      
      {/* 4. JSON-LD SEO Script (Must be inside the main div) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "Dhakuakhana College Botany Department",
            "url": "https://synap-seed.vercel.app",
            "description": "A college department offering AI-powered tools for Botany and Science students.",
            "knowsAbout": ["Botany", "Zoology", "Physics", "Chemistry", "Artificial Intelligence"]
          })
        }}
      />

      <Navbar /> 
      
      <main id="main-content" className="flex-grow">
        <BotanyHero />
        
         <div className="p-1 md:p-10">
          <div className="max-w-[1600px] mx-auto w-full space-y-20">
            {/* Subject Pillars, Feature Showcase, and Stats */}
            <SubjectPillars />
            <FeatureShowcase />
            <ImpactStats />
          </div>
        </div>
      </main>
      
      <AIFloatingButton />
      <MobileBottomNavbar />
    </div>
  );
}