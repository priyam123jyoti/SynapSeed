//src/app/admin/test/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Question {
  id: string;
  type: 'MCQ' | 'MSQ' ;
  question_text: string;
  options: string[] | null;
  correct_answers: string[];
}

interface TestDetails {
  id: string;
  title: string;
  description: string;
  created_at: string;
  questions: Question[];
}

export default function ViewTestPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id;

  const [test, setTest] = useState<TestDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        // We call a new GET endpoint passing the specific test ID
        const res = await fetch(`/api/tests/${testId}`);
        if (!res.ok) throw new Error('Failed to fetch assessment details.');
        
        const data = await res.json();
        setTest(data.test);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (testId) fetchTestDetails();
  }, [testId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <Loader2 size={32} className="animate-spin text-emerald-500" />
        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Loading Assessment Matrix...</span>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 max-w-md text-center space-y-4 shadow-sm">
          <AlertCircle size={40} className="text-rose-500 mx-auto" />
          <h3 className="text-lg font-black text-slate-900">Retrieval Failure</h3>
          <p className="text-sm text-slate-500">{error || "The requested assessment matrix does not exist."}</p>
          <Link href="/admin/test" className="inline-block text-xs font-bold bg-slate-900 text-white px-4 py-2 rounded-xl uppercase tracking-wider">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Back */}
        <Link href="/admin/test" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider">
          <ArrowLeft size={14} /> Back to Matrix Dashboard
        </Link>

        {/* Test Header Block */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded">
            Active Module
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-2">{test.title}</h1>
          <p className="text-sm text-slate-500 font-medium">{test.description || "No layout instructions provided."}</p>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Provisioned Questions ({test.questions.length})</h2>
          
          {test.questions.map((q, idx) => (
            <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 px-2.5 py-1 rounded">
                Question {idx + 1} &mdash; {q.type}
              </span>
              
              <p className="text-md font-bold text-slate-800">{q.question_text}</p>

              {/* Options layout for MCQ/MSQ */}
              {q.options && q.options.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {q.options.map((opt, oIdx) => {
                    const isCorrect = q.correct_answers.includes(opt);
                    return (
                      <div 
                        key={oIdx} 
                        className={`flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-colors ${
                          isCorrect 
                            ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' 
                            : 'bg-slate-50/50 border-slate-100 text-slate-600'
                        }`}
                      >
                        <span>{opt}</span>
                        {isCorrect && <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          ))}
        </div>

      </div>
    </main>
  );
}