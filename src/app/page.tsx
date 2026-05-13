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
import LatestEvents from '@/components/home/LatestEvents';

// QUIZ WIDGET IMPORT
import QuizWidget from "@/components/Prof-Quiz/QuizWidget";

// PERFORMANCE: Incremental Static Regeneration (ISR)
export const revalidate = 3600; 

// 2. Metadata (SEO)
export const metadata: Metadata = {
  title: "Department of Botany | Dhakuakhana College - AI Learning Portal",
  description: "Official Botany Department portal at Dhakuakhana College. Explore interactive AI mind maps, take science quizzes, and view departmental research.",
  alternates: { canonical: 'https://synap-seed.vercel.app' }, 
  keywords: ["Botany Dhakuakhana College", "Assam Botany Research", "AI Quiz Generator Science", "Botany Mind Maps"],
  openGraph: {
    title: "Botany Department | Dhakuakhana College",
    description: "Visualizing Plant Science with AI-powered mind maps and quizzes.",
    url: 'https://synap-seed.vercel.app',
    siteName: 'SynapSeed',
    images: '/botany-department-dhakuakhana-college.png',
  }
};

// 3. Data Fetching Function
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
  // Fetch the quiz data from Supabase
  const activeQuiz = await getLatestQuiz();

  return (
    <div className="w-full bg-[#f8fafc] flex flex-col min-h-screen">
      
      {/* JSON-LD for SEO */}
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
        
        {/* --- DYNAMIC CHALLENGE SECTION --- */}
        <section className="max-w-xl mx-auto px-6 py-12">
          {activeQuiz ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Active Challenge</h2>
              <QuizWidget quiz={activeQuiz} />
            </div>
          ) : (
            /* SIMPLE STAY TUNED FALLBACK */
            <div className="py-16 border-2 border-dashed border-emerald-100 rounded-[2.5rem] bg-emerald-50/30 flex flex-col items-center text-center space-y-3">
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                 <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
               </div>
               <p className="text-emerald-900 font-bold text-xs uppercase tracking-widest">
                 Stay Tuned
               </p>
               <p className="text-emerald-800/40 font-medium text-[10px] uppercase tracking-wider px-12">
                 New departmental quizzes are coming soon. Review your lectures in the meantime!
               </p>
            </div>
          )}
        </section>
        {/* --- END CHALLENGE SECTION --- */}

        <div className="p-1 md:p-10">
          <div className="max-w-[1600px] mx-auto w-full space-y-20">
            <LatestEvents />
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