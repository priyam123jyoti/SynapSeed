'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, HelpCircle, AlertCircle, CheckSquare } from 'lucide-react';
import { Question, Test } from '@/types';

export default function StudentTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: testId } = use(params);
  const router = useRouter();
  const [testDetails, setTestDetails] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Maps question identifiers to individual responses array strings
  const [responses, setResponses] = useState<Record<string, string[]>>({});

  useEffect(() => {
    async function loadTestEnvironment() {
      try {
        const res = await fetch(`/api/take-test/${testId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Environment download failure.');
        setTestDetails(data.test);
        setQuestions(data.questions);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (testId) loadTestEnvironment();
  }, [testId]);

  const handleSelectionValueChange = (questionId: string, value: string, isMulti: boolean) => {
    const activeCurrentSelection = responses[questionId] || [];
    let updatedSelection: string[] = [];

    if (!isMulti) {
      updatedSelection = activeCurrentSelection.includes(value) ? [] : [value];
    } else {
      updatedSelection = activeCurrentSelection.includes(value)
        ? activeCurrentSelection.filter(item => item !== value)
        : [...activeCurrentSelection, value];
    }

    setResponses({ ...responses, [questionId]: updatedSelection });
  };

  const handleTextValueChange = (questionId: string, value: string) => {
    setResponses({ ...responses, [questionId]: value.trim() ? [value] : [] });
  };

  const handleFormSubmission = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testId,
          studentName: 'Student Instance Alpha', // Extracted out of session verification wrappers contextually
          answers: responses
        })
      });
      if (!res.ok) throw new Error('Data package submission write operations rejected.');
      router.push('/');
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="animate-spin text-slate-900 w-10 h-10" /></div>;
  if (error || !testDetails) return <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-rose-500 font-bold p-4 text-center"><div><AlertCircle size={36} className="mx-auto mb-2" /> Interface Execution Failure: {error || 'Test Context Missing'}</div></div>;

  return (
    <main className="min-h-screen bg-slate-50/50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{testDetails.title}</h1>
          <p className="text-xs text-slate-400 font-medium mt-1">{testDetails.description}</p>
        </div>

        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-indigo-950 font-black text-xs uppercase tracking-wider bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg w-fit">
                <HelpCircle size={14} /> Item Framework {idx + 1} • <span className="text-slate-400">{q.type}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-md leading-snug">{q.question_text}</h3>

              {q.type !== 'FITB' && q.options && (
                <div className="grid grid-cols-1 gap-2.5">
                  {q.options.map((option, oIdx) => {
                    const selected = responses[q.id]?.includes(option) || false;
                    return (
                      <button
                        key={oIdx} onClick={() => handleSelectionValueChange(q.id, option, q.type === 'MSQ')}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-semibold transition-all flex items-center gap-3 ${
                          selected ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-4 h-4 border rounded flex items-center justify-center text-[9px] ${selected ? 'border-white bg-white text-slate-900' : 'border-slate-300'}`}>
                          {selected && '✓'}
                        </div>
                        {option}
                      </button>
                    );
                  })}
                </div>
              )}

              {q.type === 'FITB' && (
                <input
                  type="text" placeholder="Type evaluation target term keyword string response here..."
                  onChange={(e) => handleTextValueChange(q.id, e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                />
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleFormSubmission} disabled={submitting}
          className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2"
        >
          <CheckSquare size={16} /> {submitting ? 'Calculating Evaluation Ratios...' : 'Submit Final Answers Sheet'}
        </button>
      </div>
    </main>
  );
}