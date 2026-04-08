"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle, XCircle, Leaf, Dna } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

interface QuizInterfaceProps {
  subjectLabel: string;
  question: Question;
  currentIdx: number;
  totalQuestions: number;
  userAnswer: number;
  isRecap: boolean;
  onAnswer: (index: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onFinish: () => void;
}

export const QuizInterface = ({
  subjectLabel,
  question,
  currentIdx,
  totalQuestions,
  userAnswer,
  isRecap,
  onAnswer,
  onNext,
  onPrev,
  onFinish
}: QuizInterfaceProps) => {

  // Visual logic for Option Buttons
  const getOptionStyle = (index: number) => {
    const isSelected = userAnswer === index;
    const isCorrect = question.correct === index;

    if (isRecap) {
      if (isCorrect) return "border-emerald-500 bg-emerald-500/15 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] z-10 scale-[1.02]";
      if (isSelected && !isCorrect) return "border-red-500 bg-red-500/10 text-red-400 opacity-90";
      return "border-white/10 bg-slate-800/40 text-slate-400 opacity-60"; 
    }

    if (isSelected) return "border-emerald-400 bg-emerald-400/10 text-emerald-50 shadow-[0_0_15px_rgba(52,211,153,0.2)] scale-[1.02]";
    return "border-slate-400 border-[0.2px] hover:bg-emerald-500/5 hover:border-emerald-500/30 text-slate-300";
  };

  if (!question) return null;

  return (
    <div className="min-h-screen bg-[#020617] p-0.1 flex items-center justify-center font-mono">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-3xl w-full bg-slate-900/40 border border-emerald-500/10 rounded-[1.5rem] p-4 md:p-12 relative shadow-2xl backdrop-blur-xl overflow-hidden">
        
        {/* PROGRESS BAR */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
          <motion.div 
            className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-teal-300" 
            animate={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
            transition={{ duration: 0.8, ease: "circOut" }}
          />
        </div>

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <Leaf size={16} className="text-emerald-500" />
            <span className="text-[10px] font-black text-emerald-500 tracking-[0.25em] uppercase bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
              {isRecap ? "RECALL_PROTOCOL" : `SYNC: ${subjectLabel}`}
            </span>
          </div>
          <span className="text-[10px] text-emerald-200/50 font-bold tracking-widest uppercase">
            NODE {currentIdx + 1} / {totalQuestions}
          </span>
        </div>

        {/* QUESTION */}
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-[100px]"
          >
            <h2 className="text-xl md:text-2xl font-bold text-white mb-10 leading-relaxed italic">
              {question.question}
            </h2>
          </motion.div>
        </AnimatePresence>

        {/* OPTIONS */}
        <div className="grid grid-cols-1 gap-3 mb-10">
          {question.options.map((opt, i) => (
            <button
              key={i}
              disabled={isRecap}
              onClick={() => onAnswer(i)}
              className={`w-full p-5 rounded-2xl border text-left text-sm font-medium transition-all duration-300 flex justify-between items-center group ${getOptionStyle(i)}`}
            >
              <div className="flex items-center gap-4">
                <span className={`text-[10px] font-bold w-7 h-7 rounded-lg flex items-center justify-center border ${userAnswer === i ? 'bg-emerald-400 text-slate-950' : 'border-white/10 text-emerald-500'}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span>{opt}</span>
              </div>
              
              {isRecap && (
                <div className="flex gap-2">
                  {question.correct === i && <CheckCircle size={20} className="text-emerald-400" />}
                  {userAnswer === i && question.correct !== i && <XCircle size={20} className="text-red-500" />}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* ANALYSIS BOX (Explanation) */}
        <AnimatePresence>
          {isRecap && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="p-6 bg-emerald-950/20 rounded-2xl border border-emerald-500/20 text-[12px] text-emerald-100/80 mb-8 leading-relaxed"
            >
              <span className="text-emerald-400 font-black tracking-widest text-[9px] block mb-2 uppercase flex items-center gap-2">
                <Dna size={12} /> MOANA_ANALYSIS_DATA:
              </span> 
              {question.explanation}
            </motion.div>
          )}
        </AnimatePresence>

        {/* NAVIGATION */}
        <div className="flex justify-between items-center pt-8 border-t border-emerald-500/10">
          <button 
            disabled={currentIdx === 0} 
            onClick={onPrev} 
            className="text-emerald-500/50 hover:text-emerald-400 disabled:opacity-0 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
          >
            <ChevronLeft size={16} /> Prev
          </button>
          
          <button 
            onClick={currentIdx === totalQuestions - 1 ? onFinish : onNext} 
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2"
          >
            {currentIdx === totalQuestions - 1 ? (isRecap ? "EXIT" : "FINISH") : "Next"} <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};