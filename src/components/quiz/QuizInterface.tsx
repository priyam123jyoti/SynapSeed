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
  totalQuestions = 10,
  userAnswer,
  isRecap,
  onAnswer,
  onNext,
  onPrev,
  onFinish
}: QuizInterfaceProps) => {

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

  return (
    <div className="min-h-screen bg-[#020617] p-0.1 flex items-center justify-center font-mono selection:bg-emerald-500/30">
      {/* Moana Ambient Bio-Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-3xl w-full bg-slate-900/40 border border-emerald-500/10 rounded-[1.5rem] p-4 md:p-12 relative shadow-2xl backdrop-blur-xl overflow-hidden">
        
        {/* MOANA SYSTEM PROGRESS BAR */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
          <motion.div 
            className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-teal-300" 
            animate={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
            transition={{ duration: 0.8, ease: "circOut" }}
          />
        </div>

        {/* MOANA SYSTEM HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Leaf size={16} className="text-emerald-500 animate-pulse" />
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-emerald-500 rounded-full blur-md"
              />
            </div>
            <span className="text-[10px] font-black text-emerald-500 tracking-[0.25em] uppercase bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
              {isRecap ? "MOANA_RECALL_MODE" : `MOANA_SYNC: ${subjectLabel}`}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-emerald-200/50 font-bold tracking-widest uppercase">
              NODE {currentIdx + 1} <span className="text-emerald-900 mx-1">/</span> {totalQuestions}
            </span>
            <div className="text-[8px] text-emerald-700 font-bold uppercase tracking-tighter">MoanaAI</div>
          </div>
        </div>

        {/* QUESTION AREA */}
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl md:text-2xl font-bold text-white mb-10 leading-relaxed tracking-tight min-h-[80px]">
              {question.question}
            </h2>
          </motion.div>
        </AnimatePresence>

        {/* OPTIONS GRID */}
        <div className="grid grid-cols-1 gap-3 mb-12">
          {question.options.map((opt, i) => (
            <button
              key={i}
              disabled={isRecap}
              onClick={() => onAnswer(i)}
              className={`w-full p-5 rounded-2xl border text-left text-sm font-medium transition-all duration-300 flex justify-between items-center group ${getOptionStyle(i)}`}
            >
              <div className="flex items-center gap-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${userAnswer === i ? 'border-emerald-400 bg-emerald-400 text-slate-950 shadow-[0_0_10px_#10b981]' : 'border-white/10 text-emerald-500/50 group-hover:border-emerald-500/50'}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="leading-tight group-hover:translate-x-1 transition-transform">{opt}</span>
              </div>
              
              {isRecap && (
                <div className="flex gap-2">
                  {question.correct === i && <CheckCircle size={20} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />}
                  {userAnswer === i && question.correct !== i && <XCircle size={20} className="text-red-500" />}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* MOANA ANALYSIS BOX */}
        <AnimatePresence>
          {isRecap && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: "auto" }} 
              className="p-6 bg-emerald-950/20 rounded-2xl border border-emerald-500/20 text-[12px] text-emerald-100/80 mb-8 leading-relaxed shadow-inner overflow-hidden"
            >
              <span className="text-emerald-400 font-black tracking-[0.3em] uppercase text-[9px] block mb-3 flex items-center gap-2">
                <Dna size={12} className="animate-spin" /> MOANA_ANALYSIS_ENGINE
              </span> 
              {question.explanation || "Biological data pattern confirmed. No genetic anomalies detected in this module."}
            </motion.div>
          )}
        </AnimatePresence>

        {/* FOOTER NAVIGATION */}
        <div className="flex justify-between items-center pt-8 border-t border-emerald-500/10">
          <button 
            disabled={currentIdx === 0} 
            onClick={onPrev} 
            className="flex items-center gap-2 px-4 py-2 text-emerald-500/50 hover:text-emerald-400 disabled:opacity-0 transition-all text-xs font-bold tracking-[0.2em] uppercase"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          
          {currentIdx === totalQuestions - 1 ? (
            <button 
              onClick={onFinish} 
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              {isRecap ? "EXIT_REVIEW" : "DONE"} <ChevronRight size={14} />
            </button>
          ) : (
            <button 
              onClick={onNext} 
              className="flex items-center gap-2 px-8 py-4 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 transition-all text-[10px] font-black tracking-[0.3em] uppercase group"
            >
              Next <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};