import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';

// Layout & UI Components
import Navbar from '@/components/layout/Navbar'; 
import BotanyHero from '@/components/layout/HeroSection';
import MobileBottomNavbar from '@/components/layout/MobileBottomNavbar';
import AIFloatingButton from '@/components/layout/AIFloatingButton';
import Footer from '@/components/layout/Footer'; // New Client Footer

// Content Sections
import SubjectPillars from '@/components/home/SubjectPillars';
import FeatureShowcase from '@/components/home/FeatureShowcase';
import ImpactStats from '@/components/home/ImpactStats';
import LatestEvents from '@/components/home/LatestEvents';
import QuizWidget from "@/components/Prof-Quiz/QuizWidget";

// Performance Settings
export const revalidate = 3600; 

export const metadata: Metadata = {
  title: "Department of Botany | Dhakuakhana College - AI Learning Portal",
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
      
      {/* Structured Data for Google */}
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
        
        {/* Dynamic Quiz/Challenge Section */}
        <section className="max-w-xl mx-auto px-6 py-12">
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
                {activeQuiz ? "Active Challenge" : "Stay Tuned"}
              </h2>
              <QuizWidget quiz={activeQuiz} />
            </div>
        </section>

        {/* Home Sections */}
        <div className="p-1 md:p-10">
          <div className="max-w-[1600px] mx-auto w-full space-y-20">
            <LatestEvents />
            <SubjectPillars />
            <FeatureShowcase />
            <ImpactStats />
          </div>
        </div>

        {/* Interactive Footer */}
        <Footer />
      </main>
      
      <AIFloatingButton />
      <MobileBottomNavbar />
    </div>
  );
}