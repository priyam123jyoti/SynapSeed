"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, Brain, Zap } from 'lucide-react';

const stats = [
  { 
    label: "Active Students", 
    value: "1,200+", 
    icon: Users, // Reference the component directly
    iconColor: "text-emerald-500",
    desc: "Empowering Dhakuakhana College" 
  },
  { 
    label: "AI Quizzes Generated", 
    value: "250K+", 
    icon: Zap, 
    iconColor: "text-amber-500",
    desc: "Powered by MoanaAI" 
  },
  { 
    label: "Mind Maps Created", 
    value: "15,000+", 
    icon: Brain, 
    iconColor: "text-purple-500",
    desc: "Visualizing complex science" 
  },
  { 
    label: "Success Rate", 
    value: "98%", 
    icon: GraduationCap, 
    iconColor: "text-blue-500",
    desc: "In academic assessments" 
  }
];

export default function ImpactStats() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => {
            // Assign to a capitalized variable so React recognizes it as a component
            const IconComponent = stat.icon;
            
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="mb-4 p-3 rounded-2xl bg-slate-50 group-hover:bg-slate-100 transition-colors duration-300">
                  {/* Now we can pass size and className safely */}
                  <IconComponent size={28} className={stat.iconColor} />
                </div>
                <h4 className="text-3xl md:text-4xl font-black text-slate-900 mb-1 tracking-tight">
                  {stat.value}
                </h4>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">
                  {stat.label}
                </p>
                <p className="text-xs text-slate-400 font-medium italic">
                  {stat.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}