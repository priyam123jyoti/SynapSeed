"use client";

import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TopicSelection } from './TopicSelection';
import type { Topic } from '@/components/quiz/constants'; 

interface TopicSelectionViewProps {
  subjectTitle: string;
  topics: any[]; // Changed to any[] temporarily to handle both strings and objects
  researcherName: string;
  onStart: (topic: string) => void;
  onBack: () => void;
}

const TopicSelectionView = ({
  subjectTitle,
  topics,
  researcherName,
  onStart,
  onBack
}: TopicSelectionViewProps) => {

  // 0 LAG: Smart transformation logic
  const formattedTopics: Topic[] = useMemo(() => {
    return topics.map((item) => {
      // 1. If it's already a proper Topic object, return it
      if (typeof item === 'object' && item !== null && 'name' in item) {
        return item as Topic;
      }
      
      // 2. If it's a string, convert it to a Topic object
      return {
        name: String(item),
        icon: "🧪" 
      };
    });
  }, [topics]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10"
    >
      <div className="absolute top-6 right-6 z-50 pointer-events-none hidden md:block">
        <div className="text-right">
          <p className="text-emerald-500/40 font-mono text-[10px] uppercase tracking-[0.3em]">
            SYSTEM_SECTOR: <span className="text-emerald-400">{subjectTitle}</span>
          </p>
          <p className="text-slate-700 font-mono text-[10px] uppercase tracking-[0.3em]">
            OPERATOR: {researcherName}
          </p>
        </div>
      </div>

      <TopicSelection
        subjectTitle={subjectTitle}
        topics={formattedTopics} 
        onStart={onStart}
        onBack={onBack}
      />
    </motion.div>
  );
};

export default memo(TopicSelectionView);