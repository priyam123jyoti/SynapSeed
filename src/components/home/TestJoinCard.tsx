"use client";

import { useRouter } from "next/navigation";
import { Clock, HelpCircle, ArrowRight, Sparkles } from "lucide-react";

interface TestJoinCardProps {
  testId: string;
  title: string;
  description?: string;
  questionCount: number;
  durationMinutes?: number;
  isUrgent?: boolean;
}

export default function TestJoinCard({
  testId,
  title,
  description = "Standard Academic Evaluation Module",
  questionCount,
  durationMinutes = 45,
  isUrgent = false,
}: TestJoinCardProps) {
  const router = useRouter();

  const handleLaunchTest = () => {
    // Navigates the student cleanly to your dynamic evaluation workspace route
    router.push(`/events/quiz/participate/${testId}`);
  };

  return (
    <div 
      className={`group relative bg-white rounded-3xl p-6 border transition-all duration-300 hover:shadow-xl hover:shadow-emerald-100/50 flex flex-col justify-between overflow-hidden ${
        isUrgent ? "border-amber-200 bg-gradient-to-br from-white to-amber-50/20" : "border-slate-100"
      }`}
    >
      {/* Decorative background glow on hover */}
      <div className="absolute -right-12 -top-12 w-32 h-32 bg-emerald-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div>
        {/* Top Badges row */}
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            Ready to Start
          </span>
          {isUrgent && (
            <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 animate-pulse">
              <Sparkles size={10} /> Priority
            </span>
          )}
        </div>

        {/* Text Content */}
        <h3 className="text-xl font-black text-slate-800 tracking-tight leading-tight mb-2 group-hover:text-emerald-900 transition-colors">
          {title}
        </h3>
        <p className="text-xs font-medium text-slate-500 line-clamp-2 mb-6 pr-4">
          {description}
        </p>
      </div>

      {/* Meta Indicators & Action Bar */}
      <div className="pt-4 border-t border-slate-50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-1.5">
            <HelpCircle size={14} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-600">{questionCount} Items</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-600">{durationMinutes} Mins</span>
          </div>
        </div>

        <button
          onClick={handleLaunchTest}
          className="bg-emerald-600 hover:bg-emerald-700 active:scale-[0.97] text-white p-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-600/10"
        >
          <span className="text-xs font-black uppercase tracking-wider pl-1 hidden sm:inline">
            Enter Assessment
          </span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}