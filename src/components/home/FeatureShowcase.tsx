"use client";

import { BrainCircuit, Globe2, Target, Zap } from 'lucide-react';
import Link from 'next/link'; // Added Link for SEO

const FeatureShowcase = () => {
  return (
    <section className="py-24 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Engineered for <span className="text-emerald-600">Scientists.</span>
          </h2>
          <p className="text-gray-500 font-medium text-lg">
            Beyond simple flashcards. We built a neural ecosystem for deep learning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* SEO FIX: Wrapped the main feature in a Link to guide crawlers to your Quiz tool */}
          <Link href="/moana-ai-unlimited-quiz-generator" className="md:col-span-2 row-span-2 bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
            <div className="relative z-10">
              {/* SEO FIX: Added aria-hidden to decorative icons */}
              <div className="bg-emerald-100 text-emerald-600 p-4 rounded-2xl w-fit mb-6" aria-hidden="true">
                <BrainCircuit size={32} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-4">Neural Topic Generation</h3>
              <p className="text-gray-500 font-medium text-lg max-w-md mb-8 leading-relaxed">
                MoanaAI doesn't just pull from a database. It understands the syllabus of 
                <strong> Physics, Botany, and Zoology</strong> to create original, 
                high-yield questions in real-time.
              </p>
              <ul className="space-y-4">
                {['Dynamic Difficulty Scaling', 'Instant Explanation Engine', 'Context-Aware Hints'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                    <Zap size={16} className="text-emerald-500" aria-hidden="true" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-emerald-100 transition-colors" />
          </Link>

          {/* Small Feature 1 */}
          <Link href="/research" className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group flex flex-col justify-between h-[300px] md:h-full hover:-translate-y-1 transition-transform">
            <div>
              <Globe2 size={28} className="text-emerald-400 mb-6 group-hover:rotate-12 transition-transform" aria-hidden="true" />
              <h4 className="text-xl font-black mb-2">Global Gateway</h4>
              <p className="text-gray-400 text-sm font-medium leading-relaxed">
                Connect your academic performance with fully-funded scholarship roadmaps automatically.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
               <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active in 150+ Countries</span>
            </div>
          </Link>

          {/* Small Feature 2 */}
          <Link href="/quiz" className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm group flex flex-col justify-between h-[300px] md:h-full hover:-translate-y-1 hover:shadow-md transition-all">
            <div>
              <Target size={28} className="text-blue-500 mb-6 group-hover:scale-110 transition-transform" aria-hidden="true" />
              <h4 className="text-xl font-black mb-2 text-gray-900">Exam-Ready</h4>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Questions tailored to meet the standards of GRE, DAAD, and international entrance exams.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100"> 
               <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Validated Accuracy</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;