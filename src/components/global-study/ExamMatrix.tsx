"use client";

import { memo } from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, DollarSign, Target, Globe2 } from 'lucide-react';
import { EXAMS, type Exam } from '@/data/study-abroad';

const ExamMatrix = memo(() => {
  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {EXAMS.map((exam: Exam, index: number) => (
          <motion.div
            key={exam.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            {/* Header: Exam Name & Purpose */}
            <div className="bg-gray-50 p-6 border-b border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                    <FileText size={20} className="text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                    {exam.name}
                  </h3>
                </div>
                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                  Essential
                </span>
              </div>
              <p className="text-sm text-gray-500 font-medium pl-14">
                {exam.purpose}
              </p>
            </div>

            {/* The Matrix Grid */}
            <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4">
              <Stat 
                icon={<DollarSign size={14} />} 
                label="Exam Fee" 
                value={exam.cost}
                color="text-emerald-600" 
              />
              <Stat 
                icon={<Target size={14} />} 
                label="Target Score" 
                value={exam.minScoreForAid}
                color="text-rose-600" 
              />
              <Stat 
                icon={<Clock size={14} />} 
                label="Validity" 
                value={exam.validity}
                color="text-gray-600" 
              />
              <Stat 
                icon={<Globe2 size={14} />} 
                label="Accepted In" 
                value={`${exam.acceptedBy.length} Regions`}
                color="text-purple-600" 
              />
            </div>

            {/* Footer: Where it is accepted */}
            <div className="px-6 pb-6 mt-auto">
              <div className="flex flex-wrap gap-2">
                {exam.acceptedBy.map((region) => (
                  <span 
                    key={region} 
                    className="text-[10px] font-bold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full"
                  >
                    {region}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

// Helper for the Stats Grid
const Stat = ({ icon, label, value, color }: any) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-1.5 text-gray-400">
      {icon}
      <span className="text-[10px] uppercase font-bold tracking-wider">{label}</span>
    </div>
    <span className={`text-lg font-black ${color} tracking-tight`}>{value}</span>
  </div>
);

ExamMatrix.displayName = 'ExamMatrix';
export default ExamMatrix;