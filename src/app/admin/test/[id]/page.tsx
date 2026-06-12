'use client';

import { useEffect, useState, use } from 'react';
import { Users, Award, Percent, Calendar, ArrowLeft, Loader2, BarChart3 } from 'lucide-react';
import Link from 'next/link';

interface Submission {
  id: string;
  student_name: string;
  score: number;
  total_questions: number;
  submitted_at: string;
}

interface AnalyticsData {
  quizTitle: string;
  totalQuestions: number;
  metrics: {
    totalSubmissions: number;
    classAverage: number;
    highestScore: number;
  };
  submissions: Submission[];
}

export default function QuizAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: quizId } = use(params);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setErrorMessage(null);
        const res = await fetch(`/api/test-analytics/${quizId}`);
        
        if (!res.ok) {
          throw new Error(`Server returned status code: ${res.status}`);
        }
        
        const json = await res.json();
        
        if (json.error) {
          throw new Error(json.error);
        }
        
        setData(json);
      } catch (err: any) {
        console.error('❌ Error compiling metrics:', err);
        setErrorMessage(err.message || "Unknown retrieval error");
      } finally {
        setLoading(false);
      }
    }
    
    if (quizId) {
      fetchAnalytics();
    }
  }, [quizId]); // ✅ Fixed typo here

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600 w-10 h-10" />
      </div>
    );
  }

  if (errorMessage || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="text-xl font-black text-slate-800">
          Analytics matrix couldn't be loaded.
        </div>
        <p className="text-sm font-semibold text-rose-500 max-w-md bg-rose-50 p-3 rounded-xl border border-rose-100">
          Reason: {errorMessage || "Verify quiz tracking registry ID match."}
        </p>
        <Link 
          href="/events/admin/quiz" 
          className="text-xs font-bold uppercase tracking-wider text-emerald-600 underline"
        >
          Return to Admin Panel
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <Link 
          href="/events/admin/quiz" 
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Panel
        </Link>

        <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-sm">
            <BarChart3 size={22} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Performance Assessment Tracker</span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{data.quizTitle}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Turnout</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{data.metrics.totalSubmissions} <span className="text-xs text-slate-400 font-medium">Students</span></h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Percent size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Class Average</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {data.metrics.classAverage} <span className="text-xs text-slate-400 font-medium">/ {data.totalQuestions}</span>
              </h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Award size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Highest Score Achieved</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {data.metrics.highestScore} <span className="text-xs text-slate-400 font-medium">/ {data.totalQuestions}</span>
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">Student Score Sheets</h2>
          </div>

          {data.submissions.length === 0 ? (
            <div className="p-12 text-center text-sm font-bold text-slate-400">
              No examination submissions logged yet for this assessment instance.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50/20">
                    <th className="py-4 px-6">Student Name</th>
                    <th className="py-4 px-6">Evaluation Score</th>
                    <th className="py-4 px-6">Percentage</th>
                    <th className="py-4 px-6">Submission Time Stamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                  {data.submissions.map((sub) => {
                    const pct = data.totalQuestions > 0 ? ((sub.score / data.totalQuestions) * 100).toFixed(0) : "0";
                    return (
                      <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 font-bold text-slate-900">{sub.student_name}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-black ${
                            sub.score === data.totalQuestions ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {sub.score} / {data.totalQuestions}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-500">{pct}%</td>
                        <td className="py-4 px-6 text-xs text-slate-400 inline-flex items-center gap-1 mt-1">
                          <Calendar size={12} />
                          {new Date(sub.submitted_at).toLocaleDateString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}