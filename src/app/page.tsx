import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';

import Navbar from '@/components/layout/Navbar'; 
import BotanyHero from '@/components/layout/HeroSection';
import MobileBottomNavbar from '@/components/layout/MobileBottomNavbar';
import AIFloatingButton from '@/components/layout/AIFloatingButton';
import Footer from '@/components/layout/Footer'; 

import SubjectPillars from '@/components/home/SubjectPillars';
import FeatureShowcase from '@/components/home/FeatureShowcase';
import ImpactStats from '@/components/home/ImpactStats';
import LatestEvents from '@/components/home/LatestEvents';
import { HomePaperPortal } from '@/components/home/HomePaperPortal';


// DYNAMIC PERFORMANCE MATCH
export const revalidate = 30; 

export const metadata: Metadata = {
  title: "Department of Botany | Dhakuakhana College | Home Page",
  description: "Official Botany Department portal. Explore interactive AI mind maps and science quizzes.",
  alternates: { canonical: 'https://synap-seed.vercel.app' }, 
  openGraph: {
    title: "Botany Department | Dhakuakhana College",
    description: "Visualizing Plant Science with AI-powered tools.",
    url: 'https://synap-seed.vercel.app',
    images: '/botany-department-dhakuakhana-college.png',
  }
};

async function getLatestQuiz() {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle(); 
    
  if (error) {
    console.error("Quiz Fetch Error:", error);
    return null;
  }
  return data;
}

export default async function Home() {
  const activeQuiz = await getLatestQuiz();

  return (
    <div className="w-full bg-[#f8fafc] flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "Dhakuakhana College Botany Department",
            "url": "https://synap-seed.vercel.app"
          })
        }}
      />

      <Navbar /> 
      
      <main id="main-content" className="flex-grow">
        <BotanyHero />
        
        <div className="p-1 md:p-10">
          <div className="max-w-[1600px] mx-auto w-full space-y-20">
            <HomePaperPortal />
            <LatestEvents />
            <SubjectPillars />
            <FeatureShowcase />
            <ImpactStats />
          </div>
        </div>

        <Footer />
      </main>
      
      <AIFloatingButton />
      <MobileBottomNavbar />
    </div>
  );
}