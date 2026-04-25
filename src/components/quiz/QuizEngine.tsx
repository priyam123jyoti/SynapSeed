"use client";

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, BookOpen, LogOut, Award, Target, BarChart3 } from 'lucide-react';

interface ResultsModalProps {
  score: number;
  topic: string;
  subject: string;
  onReview: () => void;
  onTerminate: () => void;
  onRestart: () => void;
}

const ResultsModal = ({
  score,
  topic,
  subject,
  onReview,
  onTerminate,
  onRestart
}: ResultsModalProps) => {
  
  // SEO logic: Determine achievement level for metadata
  const getPerformanceLabel = (s: number) => {
    if (s >= 90) return "Expert";
    if (s >= 70) return "Proficient";
    return "Researcher";
  };

  const performance = getPerformanceLabel(score);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      {/* SEO DATA: Semantic structure for screen readers and bots */}
      <div className="sr-only">
        <h2>{subject} Quiz Results</h2>
        <p>Topic: {topic}</p>
        <p>Final Score: {score}%</p>
        <p>Academic Status: {performance}</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-slate-900 border border-emerald-500/30 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl shadow-emerald-500/10"
      >
        {/* Header Decoration */}
        <div className="bg-emerald-500/10 p-8 text-center border-b border-emerald-500/10 relative">
          <div className="absolute top-4 right-8 opacity-10">
            <Award size={80} className="text-emerald-500" />
          </div>
          
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 mb-4 border border-emerald-500/40">
            <span className="text-3xl font-black text-emerald-400">{score}%</span>
          </div>
          
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-1">
            {performance} Level Reached
          </h3>
          <p className="text-emerald-500/60 font-mono text-[10px] uppercase tracking-[0.2em]">
            Archive Sync: {topic}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-px bg-emerald-500/10">
          <div className="bg-slate-900 p-6 flex flex-col items-center">
            <Target className="text-slate-500 mb-2" size={18} />
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Accuracy</span>
            <span className="text-white font-black">{score}%</span>
          </div>
          <div className="bg-slate-900 p-6 flex flex-col items-center">
            <BarChart3 className="text-slate-500 mb-2" size={18} />
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Subject</span>
            <span className="text-white font-black truncate max-w-[120px]">{subject}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-8 space-y-3">
          <button
            onClick={onReview}
            className="w-full flex items-center justify-center gap-3 bg-white text-slate-950 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-400 transition-colors"
          >
            <BookOpen size={16} /> Review Analysis
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onRestart}
              className="flex items-center justify-center gap-2 bg-slate-800 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-700 transition-colors border border-white/5"
            >
              <RotateCcw size={14} /> Restart
            </button>
            <button
              onClick={onTerminate}
              className="flex items-center justify-center gap-2 bg-red-500/10 text-red-500 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
            >
              <LogOut size={14} /> Terminate
            </button>
          </div>
        </div>

        {/* SEO Context Footer */}
        <div className="px-8 pb-6 text-center">
          <p className="text-[9px] text-slate-600 font-medium leading-relaxed italic">
            This assessment for {topic} is validated by MoanaAI Neural Engine. 
            Results are stored in the Dhakuakhana College Academic Database.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default memo(ResultsModal);