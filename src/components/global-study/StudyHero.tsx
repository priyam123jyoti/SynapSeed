"use client";

import { motion } from 'framer-motion';
import { Plane, Sparkles, GraduationCap } from 'lucide-react';

const StudyHero = () => {
  return (
    <section className="relative pt-20 pb-16 px-4 text-center overflow-hidden">
      {/* Background Decorative Blurs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-100/20 rounded-full blur-[100px] -z-10" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
            2026 Global Scholarship Guide Now Live
          </span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-7xl font-black text-gray-900 tracking-tight mb-8 leading-[1.1]"
        >
          Your Science Career <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
            Without Borders.
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 leading-relaxed mb-10 max-w-2xl mx-auto font-medium"
        >
          Stop dreaming about Oxford or Munich. We provide the 
          <span className="text-gray-900 font-bold"> exact roadmap</span>, 
          <span className="text-gray-900 font-bold"> scholarship data</span>, and 
          <span className="text-gray-900 font-bold"> exam targets</span> you need to get there for free.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-500">
            <GraduationCap size={16} className="text-emerald-500" />
            100% Fully Funded
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-500">
            <Sparkles size={16} className="text-blue-500" />
            AI-Powered Roadmap
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StudyHero;