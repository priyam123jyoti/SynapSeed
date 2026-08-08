"use client";

import React, { memo, useMemo } from 'react';
import { TopicSelection } from './TopicSelection';
import type { Topic } from '@/components/quiz/constants'; 

interface TopicSelectionViewProps {
  subjectTitle: string;
  topics: any[]; 
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

  const formattedTopics: Topic[] = useMemo(() => {
    return topics.map((item) => {
      if (typeof item === 'object' && item !== null && 'name' in item) {
        return item as Topic;
      }
      return {
        name: String(item),
        icon: "🧪" 
      };
    });
  }, [topics]);

  return (
    // SEO FIX: Replaced heavy motion.div with a semantic section tag
    <section className="relative z-10 w-full min-h-screen">
      
      {/* SEO ACCESSIBILITY: Hidden H1 for bots to understand this page's specific context */}
      <h1 className="sr-only">{subjectTitle} AI Quiz Selection - Dhakuakhana College Botany Department</h1>

      {/* Stats Overlay: Reduced animation to zero for better Largest Contentful Paint (LCP) */}
      <div className="absolute top-6 right-6 z-50 hidden md:block">
        <div className="text-right">
          <p className="text-emerald-500/40 font-mono text-[10px] uppercase tracking-[0.3em]">
            SUBJECT: <span className="text-emerald-400">{subjectTitle}</span>
          </p>
          <p className="text-slate-700 font-mono text-[10px] uppercase tracking-[0.3em]">
            OPERATOR: {researcherName}
          </p>
        </div>
      </div>

      {/* IMPORTANT: TopicSelection must use <a> or <Link> tags 
          internally for these topics to be indexed! 
      */}
      <TopicSelection
        subjectTitle={subjectTitle}
        topics={formattedTopics} 
        onStart={onStart}
        onBack={onBack}
      />

      {/* SEO Footer Context */}
      <footer className="sr-only">
        Interactive educational module for {subjectTitle}. 
        Dhakuakhana College Botanical Research and AI Integration.
      </footer>
    </section>
  );
};

export default memo(TopicSelectionView); 