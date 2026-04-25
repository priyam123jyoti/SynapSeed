"use client";

import React, { useState, useMemo, memo } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
// Reduced Framer Motion to simple fades to prevent Layout Shift (SEO factor)
import { motion, AnimatePresence } from 'framer-motion';
import type { Topic } from '@/components/quiz/constants'; 

interface TopicSelectionProps {
  subjectTitle: string;
  topics: Topic[];
  onStart: (topic: string) => void;
  onBack: () => void;
}

// SEO FIX: TopicCard is now a semantic List Item
const TopicCard = memo(({ name, icon, onClick }: { name: string, icon: string, onClick: (t: string) => void }) => (
  <motion.li
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="list-none"
  >
    <button
      onClick={() => onClick(name)}
      aria-label={`Start ${name} quiz`}
      className="w-full relative p-6 bg-slate-900/40 backdrop-blur-sm border border-emerald-600/20 rounded-3xl hover:border-emerald-500/50 transition-colors text-left group overflow-hidden"
    >
      {/* Decorative effect - Kept because it doesn't hurt SEO/Layout */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#29ccbe] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      
      <div className="text-3xl mb-3 filter drop-shadow-lg group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-all" aria-hidden="true">
        {icon}
      </div>
      
      <span className="block text-[9px] text-emerald-500/60 mb-1 font-bold uppercase tracking-widest">
        Scientific Module
      </span>
      
      <h3 className="font-bold uppercase text-slate-200 group-hover:text-white transition-all text-sm leading-tight">
        {name}
      </h3>
    </button>
  </motion.li>
));

TopicCard.displayName = 'TopicCard';

export const TopicSelection = ({ subjectTitle, topics, onStart, onBack }: TopicSelectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTopics = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return query ? topics.filter(t => t.name.toLowerCase().includes(query)) : topics;
  }, [searchQuery, topics]);

  return (
    <div className="min-h-screen p-6 md:p-12 text-white font-mono selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div>
            <button 
              onClick={onBack} 
              className="group flex items-center gap-2 text-slate-500 font-bold hover:text-emerald-400 transition-all text-[10px] tracking-[0.2em] mb-4"
            >
              <ArrowLeft size={12} /> RETURN_TO_DASHBOARD
            </button>
            {/* SEO FIX: Use H2 here as the parent TopicSelectionView handles the page H1 */}
            <h2 className="text-4xl font-black tracking-tighter uppercase text-white">
              {subjectTitle} <span className="text-emerald-500 underline decoration-emerald-500/20">Archive</span>
            </h2>
          </div>

          <div className="relative w-full md:w-80">
            <label htmlFor="topic-search" className="sr-only">Search Quiz Topics</label>
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              id="topic-search"
              type="text" 
              placeholder="FILTER_ARCHIVE..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/30 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-emerald-500/50 focus:bg-slate-800/50 transition-all uppercase"
            />
          </div>
        </header>

        {/* SEO FIX: Use <ul> for the grid items to help bots understand the content structure */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-20 p-0 m-0">
          <AnimatePresence mode="popLayout">
            {filteredTopics.map((topic, idx) => (
              <TopicCard key={`${topic.name}-${idx}`} {...topic} onClick={onStart} />
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
};