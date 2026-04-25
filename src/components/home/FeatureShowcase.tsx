"use client";

import { BrainCircuit, Zap } from 'lucide-react';
import Link from 'next/link';

const FeatureShowcase = () => {
  return (
    <section className="py-24 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Engineered for <span className="text-emerald-600">Scientists.</span>
          </h2>
          <p className="text-gray-500 font-medium text-lg">
            Beyond simple flashcards. We built a neural ecosystem for deep learning.
          </p>
        </div>

        {/* The Main AI Feature Card */}
        <Link 
          href="/moana-ai-unlimited-quiz-generator" 
          className="block bg-white rounded-[2.5rem] p-10 md:p-14 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all"
        >
          <div className="relative z-10">
            <div className="bg-emerald-100 text-emerald-600 p-4 rounded-2xl w-fit mb-8" aria-hidden="true">
              <BrainCircuit size={36} />
            </div>
            
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
              Neural Topic Generation
            </h3>
            
            <p className="text-gray-500 font-medium text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
              MoanaAI doesn't just pull from a database. It understands the syllabus of 
              <strong> Physics, Botany, and Zoology</strong> to create original, 
              high-yield questions in real-time.
            </p>
            
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Dynamic Difficulty Scaling', 'Instant Explanation Engine', 'Context-Aware Hints'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-base font-bold text-gray-700">
                  <Zap size={20} className="text-emerald-500 flex-shrink-0" aria-hidden="true" /> 
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Abstract Background Decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-emerald-100 transition-colors duration-700" />
        </Link>
      </div>
    </section>
  );
};

export default FeatureShowcase;