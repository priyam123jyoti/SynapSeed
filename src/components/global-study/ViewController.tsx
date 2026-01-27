"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, GraduationCap, FileText, CalendarClock } from 'lucide-react';
import { STUDY_Tabs } from '@/data/study-abroad';

// Sub-Component Imports
import CountryGrid from './CountryGrid';
import ScholarshipVault from './ScholarshipVault';
import ExamMatrix from './ExamMatrix';
import StudyTimeline from './StudyTimeline';

const ViewController = () => {
  const [activeTab, setActiveTab] = useState('destinations');

  const getIcon = (id: string) => {
    switch (id) {
      case 'destinations': return <Globe size={18} />;
      case 'scholarships': return <GraduationCap size={18} />;
      case 'exams': return <FileText size={18} />;
      case 'timeline': return <CalendarClock size={18} />;
      default: return <Globe size={18} />;
    }
  };

  return (
    <div className="w-full bg-white">
      {/* Sticky Tab Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar gap-2 py-1">
            {STUDY_Tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative flex items-center gap-2 px-6 py-3 rounded-full text-sm font-black whitespace-nowrap transition-all duration-500
                    ${isActive ? 'text-white' : 'text-gray-500 hover:bg-gray-50'}
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-gray-900 rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {getIcon(tab.id)}
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content Render Engine */}
      <main className="py-12 bg-gray-50/40 min-h-[70vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full"
          >
            {activeTab === 'destinations' && <CountryGrid />}
            {activeTab === 'scholarships' && <ScholarshipVault />}
            {activeTab === 'exams' && <ExamMatrix />}
            {activeTab === 'timeline' && <StudyTimeline />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ViewController;