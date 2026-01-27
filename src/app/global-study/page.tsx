import type { Metadata } from 'next';
import ViewController from '@/components/global-study/ViewController';
import { Plane } from 'lucide-react';

// 1. SEO Metadata (Server Side)
export const metadata: Metadata = {
  title: 'Global Study Gateway | Full Scholarships & Exam Roadmaps',
  description: 'The ultimate guide for students to find fully funded scholarships (DAAD, Fulbright), compare countries, and check exam requirements (GRE/IELTS).',
  openGraph: {
    title: 'Study Abroad for Free | SynapSeed',
    description: 'Don\'t let money stop your science career. Find 100% funded scholarships here.',
  }
};

export default function GlobalStudyPage() {
  return (
    <main className="bg-white min-h-screen">
      
      {/* 2. The Hero Section (Static Server Rendered for Speed) */}
      <section className="relative pt-20 pb-16 px-4 text-center overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <Plane size={14} />
            Global Career Map
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-6">
            Your Science Career <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
              Has No Borders.
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto">
            Don't just dream of Oxford or Munich. We provide the 
            <span className="font-bold text-gray-900"> exact roadmap</span>, 
            <span className="font-bold text-gray-900"> scholarship data</span>, and 
            <span className="font-bold text-gray-900"> exam targets</span> you need to get there for free.
          </p>
        </div>

        {/* Decorative Background Blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-100/50 to-blue-100/50 rounded-full blur-3xl -z-10 opacity-60" />
      </section>

      {/* 3. The Interactive App */}
      <ViewController />
      
    </main>
  );
}