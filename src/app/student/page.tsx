'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight, Smile, Meh, Frown, Laugh, Trophy, Target, Sparkles } from 'lucide-react';

interface UIProps {
  id: string;
  title: string;
  description: string;
  // Submission exists only if the student has taken the test
  submission?: { 
    score: number; // The pre-calculated final score
    total_questions: number; 
  };
}

export default function StudentDashboardPage() {
  const [tests, setTests] = useState<UIProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getDashboardFeed() {
      try {
        const res = await fetch('/api/student-feed');
        const data = await res.json();
        setTests(data.payload || []);
      } catch (e) {
        console.error('Failed to fetch student feed:', e);
      } finally {
        setLoading(false);
      }
    }
    getDashboardFeed();
  }, []);

  // 1. Calculate Aggregate Performance
  const evaluatedSubmissions = tests.filter(t => t.submission);
  
  const aggregateScoreRatio = evaluatedSubmissions.length > 0
    ? evaluatedSubmissions.reduce((acc, curr) => {
        // Calculate percentage: (Score / (Questions * 2)) * 100
        const possible = curr.submission!.total_questions * 2;
        return acc + (curr.submission!.score / possible) * 100;
      }, 0) / evaluatedSubmissions.length
    : 0;

  // 2. Logic for Performance Tiers
  const resolvePerformanceEmoji = (pct: number) => {
    if (evaluatedSubmissions.length === 0) return { icon: <Meh size={44} />, txt: 'No Data Collected', color: 'text-slate-400', bg: 'bg-slate-100' };
    if (pct < 40) return { icon: <Frown size={44} className="text-rose-500 animate-bounce" />, txt: 'Critical Revision Required', color: 'text-rose-600', bg: 'bg-rose-50' };
    if (pct < 60) return { icon: <Meh size={44} className="text-amber-500" />, txt: 'Steady Operational Standard', color: 'text-amber-600', bg: 'bg-amber-50' };
    if (pct < 85) return { icon: <Smile size={44} className="text-emerald-500" />, txt: 'Optimal Proficiency Verified', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    return { icon: <Laugh size={44} className="text-teal-500" />, txt: 'Outstanding Domain Mastery', color: 'text-teal-600', bg: 'bg-teal-50' };
  };

  const performance = resolvePerformanceEmoji(aggregateScoreRatio);

  const getMetricVisualColorClass = (pct: number) => {
    if (pct < 40) return 'bg-rose-50 border-rose-200 text-rose-700';
    if (pct < 65) return 'bg-orange-50 border-orange-200 text-orange-700';
    if (pct < 85) return 'bg-amber-50 border-amber-200 text-amber-700';
    return 'bg-emerald-50 border-emerald-200 text-emerald-700';
  };

  return (
    <main className="min-h-screen bg-slate-50/50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation Action Launchpad */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-xl space-y-3">
            <span className="text-[10px] font-black tracking-widest uppercase text-emerald-400 bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-800/30">LMS Navigation Center</span>
            <h1 className="text-3xl font-black tracking-tight">Active Evaluation Matrix Hub</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column Feed Panel */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Available Examination Listings</h2>
            {loading ? (
              <div className="bg-white rounded-2xl border p-12 text-center text-xs font-black text-slate-400">Syncing structural arrays...</div>
            ) : tests.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed p-12 text-center text-xs font-bold text-slate-400">No active test registries published.</div>
            ) : (
              tests.map((test) => {
                const totalPossibleMarks = test.submission ? test.submission.total_questions * 2 : 0;
                const percentageScore = test.submission ? Math.max(0, (test.submission.score / totalPossibleMarks) * 100) : 0;
                
                return (
                  <div key={test.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-700"><BookOpen size={16} /></div>
                        <h3 className="font-black text-slate-900 text-md tracking-tight">{test.title}</h3>
                      </div>
                      <p className="text-xs font-medium text-slate-400 max-w-md line-clamp-1">{test.description}</p>
                    </div>

                    <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                      {test.submission ? (
                        <div className={`px-4 py-2 border rounded-xl font-black text-xs text-center min-w-[100px] ${getMetricVisualColorClass(percentageScore)}`}>
                          <div className="text-[9px] uppercase tracking-wider opacity-75">Score Metric</div>
                          <div className="text-sm">{percentageScore.toFixed(0)}%</div>
                        </div>
                      ) : (
                        <Link 
                          href={`/test/${test.id}`}
                          className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-colors inline-flex items-center justify-center gap-2"
                        >
                          Engage <ArrowRight size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column Metrics Core */}
          <div className="space-y-6">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Metrics Processing Aggregate</h2>
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-center flex flex-col items-center justify-center space-y-6">
              
              <div className={`p-4 ${performance.bg} border rounded-2xl w-full flex items-center justify-center min-h-[120px]`}>
                {performance.icon}
              </div>
              
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Performance Index</span>
                <h3 className={`text-lg font-black tracking-tight ${performance.color}`}>{performance.txt}</h3>
              </div>

              <div className="border-t border-slate-100 pt-4 w-full grid grid-cols-2 gap-4">
                <div className="text-left">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1"><Target size={10}/> Participation</span>
                  <div className="text-md font-black text-slate-900 mt-0.5">{evaluatedSubmissions.length}</div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center justify-end gap-1"><Sparkles size={10}/> Efficiency</span>
                  <div className="text-md font-black text-indigo-950 mt-0.5">{aggregateScoreRatio.toFixed(0)}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}