"use client";
import { BrainCircuit, Network, Home, Lock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BotanyHub() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-24 right-6 z-[200] flex flex-col gap-4 items-end pointer-events-none">
      
      {/* 1. PROFESSOR ADMIN (New Concept Addition) */}
      <Link href="/admin/quiz-creator" className="pointer-events-auto group flex items-center gap-3">
        <span className="opacity-0 group-hover:opacity-100 transition-all bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-2xl translate-x-2 group-hover:translate-x-0">
          PROFESSOR ACCESS
        </span>
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-all border-2 border-white">
          <Lock className="text-emerald-700 w-4 h-4" />
        </div>
      </Link>

      {/* 2. PLAY ACTIVE QUIZ */}
      <Link href="/quizzes" className="pointer-events-auto group flex items-center gap-3">
        <span className="opacity-0 group-hover:opacity-100 transition-all bg-emerald-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-2xl translate-x-2 group-hover:translate-x-0">
          SOLVE QUIZZES
        </span>
        <div className="w-14 h-14 bg-lime-400 rounded-2xl flex items-center justify-center shadow-[0_8px_30px_rgb(163,230,53,0.5)] hover:scale-110 active:scale-95 transition-all border-2 border-white group-hover:rotate-6">
          <BrainCircuit className="text-emerald-950 w-7 h-7" />
        </div>
      </Link>

      {/* 3. MINDMAP BUTTON */}
      <Link href="/mindmaps" className="pointer-events-auto group flex items-center gap-3">
        <span className="opacity-0 group-hover:opacity-100 transition-all bg-emerald-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-2xl translate-x-2 group-hover:translate-x-0">
          GENERATE MINDMAP
        </span>
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all border-2 border-emerald-100">
          <Network className="text-emerald-600 w-5 h-5" />
        </div>
      </Link>

      {/* 4. HOME */}
      {pathname !== "/" && (
        <Link href="/" className="pointer-events-auto group flex items-center gap-3 animate-in fade-in zoom-in">
          <span className="opacity-0 group-hover:opacity-100 transition-all bg-emerald-800 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-xl">
            GO HOME
          </span>
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-xl hover:scale-110 transition-all border-2 border-white">
            <Home className="text-white w-5 h-5" />
          </div>
        </Link>
      )}
    </div>
  );
}