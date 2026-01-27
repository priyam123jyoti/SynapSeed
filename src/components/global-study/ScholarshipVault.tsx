"use client";

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Award, GraduationCap, Calendar, Zap, Globe } from 'lucide-react';
import { SCHOLARSHIPS, type Scholarship } from '@/data/study-abroad';

const ScholarshipVault = memo(() => {
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SCHOLARSHIPS.map((scholarship: Scholarship, index: number) => (
          <motion.div
            key={scholarship.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group bg-white border-2 border-gray-100 rounded-3xl p-6 hover:border-emerald-500/30 transition-all duration-300 shadow-sm"
          >
            {/* Top Row: Title & Coverage */}
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                <Award size={24} />
              </div>
              {scholarship.isFullyFunded && (
                <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-200">
                  Fully Funded
                </span>
              )}
            </div>

            <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
              {scholarship.name}
            </h3>

            <div className="flex items-center gap-2 mb-6">
               <Globe size={14} className="text-gray-400" />
               <span className="text-sm font-bold text-gray-500">{scholarship.country}</span>
            </div>

            {/* Content Details */}
            <div className="space-y-4">
              <DetailRow 
                icon={<Zap size={16} />} 
                label="Coverage" 
                value={scholarship.coverage} 
              />
              <DetailRow 
                icon={<GraduationCap size={16} />} 
                label="Target" 
                value={scholarship.targetAudience} 
              />
              <DetailRow 
                icon={<Calendar size={16} />} 
                label="Next Deadline" 
                value={scholarship.deadline} 
                isHighlight 
              />
            </div>

            <button className="w-full mt-6 py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all active:scale-95">
              Check Eligibility Roadmap
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

const DetailRow = ({ icon, label, value, isHighlight }: any) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-2 text-gray-400">
      {icon}
      <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
    </div>
    <p className={`text-sm font-bold ${isHighlight ? 'text-rose-600' : 'text-gray-700'}`}>
      {value}
    </p>
  </div>
);

ScholarshipVault.displayName = 'ScholarshipVault';
export default ScholarshipVault;