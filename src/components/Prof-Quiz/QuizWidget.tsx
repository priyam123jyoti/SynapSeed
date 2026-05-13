'use client';
import { Rocket, Brain, GraduationCap, Bot, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function QuizWidget({ quiz }: { quiz: any }) {
  return (
    <div className="w-full max-w-md mx-auto overflow-hidden rounded-[2.5rem] bg-[#0a0a1a] shadow-2xl border border-white/10">
      
      {/* 1. CONDITIONAL POSTER SECTION */}
      {quiz ? (
        <div className="relative p-8 bg-gradient-to-br from-[#1a1a3a] via-[#0a0a1a] to-[#2a1a4a] overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          {/* Decorative Rocket Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/20 blur-[80px] -mr-10 -mt-10" />
          
          <div className="relative z-10 flex justify-between items-start">
            <div className="space-y-4 max-w-[60%]">
              <span className="bg-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-tighter">
                New
              </span>
              <h2 className="text-3xl font-black text-white italic leading-tight tracking-tighter uppercase">
                New Quiz <br /> <span className="text-yellow-400">Launched!</span>
              </h2>
              <p className="text-slate-400 text-xs font-medium leading-relaxed">
                Test your skills, earn points and level up!
              </p>
              <Link 
                href={`/quiz/${quiz.id}`}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95 group"
              >
                Try Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse" />
              <Rocket className="w-24 h-24 text-indigo-400 rotate-12 drop-shadow-[0_0_15px_rgba(129,140,248,0.5)]" />
            </div>
          </div>
        </div>
      ) : (
        /* STAY TUNED FALLBACK (POSTER REPLACEMENT) */
        <div className="relative p-10 flex flex-col items-center text-center space-y-3 bg-[#0a0a1a] border-b border-white/5 overflow-hidden">
             {/* Subtle pulsing background dot */}
             <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div className="w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
             </div>

             <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 relative z-10">
               <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
             </div>
             
             <div className="relative z-10">
               <h3 className="text-white font-bold text-sm uppercase tracking-widest">Stay Tuned</h3>
               <p className="text-slate-500 font-medium text-[10px] uppercase tracking-wider mt-1 px-8 leading-relaxed">
                 Waiting for the next Professor challenge...
               </p>
             </div>
        </div>
      )}

      {/* 2. PERMANENT NAVIGATION DOCK */}
      <div className="p-4 grid grid-cols-3 gap-3 bg-[#0c0c1e] backdrop-blur-md">
        {/* AI Quiz Button */}
        <Link href="/ai-quiz" className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#1e1e3e]/50 border border-white/5 hover:border-indigo-500/50 transition-all hover:bg-[#1e1e3e] group">
          <Bot className="w-6 h-6 text-indigo-400 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-[9px] font-bold text-slate-300 uppercase">AI Quiz</span>
        </Link>

        {/* Professor Quiz Button */}
        <Link href="/professor-quizzes" className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#1e1e3e]/50 border border-white/5 hover:border-emerald-500/50 transition-all hover:bg-[#1e1e3e] group text-center">
          <GraduationCap className="w-6 h-6 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-[9px] font-bold text-slate-300 uppercase leading-none">Prof. Quiz</span>
        </Link>

        {/* Mind Map Button */}
        <Link href="/mindmap" className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#1e1e3e]/50 border border-white/5 hover:border-yellow-500/50 transition-all hover:bg-[#1e1e3e] group text-center">
          <Brain className="w-6 h-6 text-yellow-400 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-[9px] font-bold text-slate-300 uppercase leading-none px-1">Mind Map</span>
        </Link>
      </div>
    </div>
  );
}