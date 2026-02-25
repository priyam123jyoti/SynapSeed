"use client";

import { motion } from 'framer-motion';
import { Users, GraduationCap, Cpu, Globe } from 'lucide-react';

const STATS = [
  {
    label: 'Questions Generated',
    value: '850K+',
    icon: <Cpu size={24} />,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50'
  },
  {
    label: 'Active Scholars',
    value: '12,400+',
    icon: <Users size={24} />,
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    label: 'Scholarships Tracked',
    value: '450+',
    icon: <GraduationCap size={24} />,
    color: 'text-purple-600',
    bg: 'bg-purple-50'
  },
  {
    label: 'Global Partners',
    value: '24',
    icon: <Globe size={24} />,
    color: 'text-amber-600',
    bg: 'bg-amber-50'
  }
];

const ImpactStats = () => {
  return (
    <section className="py-20 bg-white border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className={`mb-4 p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                {stat.icon}
              </div>
              <h4 className="text-3xl md:text-4xl font-black text-gray-900 mb-1 tracking-tighter">
                {stat.value}
              </h4>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Trust Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 p-6 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200 flex flex-col md:flex-row items-center justify-center gap-6"
        >
          <p className="text-sm font-bold text-gray-500 flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Neural Network updated 4 minutes ago
          </p>
          <div className="h-px w-12 bg-gray-200 hidden md:block" />
          <p className="text-sm font-bold text-gray-900">
            Trusted by students from <span className="underline decoration-emerald-400">TUM Germany</span>, <span className="underline decoration-blue-400">MIT USA</span>, and more.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactStats;