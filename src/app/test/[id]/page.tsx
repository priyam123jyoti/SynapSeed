'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, ChevronRight } from 'lucide-react';

export default function TakeTestPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [test, setTest] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchTest() {
      const res = await fetch(`/api/test/${params.id}`);
      const data = await res.json();
      setTest(data.test);
      setLoading(false);
    }
    fetchTest();
  }, [params.id]);

  const handleSelect = (qId: string, value: string, isMulti: boolean) => {
    setAnswers(prev => {
      const current = prev[qId] || [];
      if (isMulti) {
        return { ...prev, [qId]: current.includes(value) ? current.filter(v => v !== value) : [...current, value] };
      }
      return { ...prev, [qId]: [value] };
    });
  };

  const submitTest = async () => {
    setSubmitting(true);
    const res = await fetch('/api/submit-test', {
      method: 'POST',
      body: JSON.stringify({ testId: params.id, answers }),
    });
    if (res.ok) router.push('/student');
    setSubmitting(false);
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading Test...</div>;

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-black mb-8">{test.title}</h1>
      <div className="space-y-8">
        {test.questions.map((q: any, i: number) => (
          <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-200">
            <p className="font-bold text-lg mb-4">{i + 1}. {q.question_text}</p>
            {q.type === 'FITB' ? (
              <input 
                className="w-full p-3 border rounded-xl"
                onChange={(e) => setAnswers({...answers, [q.id]: [e.target.value]})}
              />
            ) : (
              <div className="grid gap-2">
                {q.options.map((opt: string) => (
                  <button 
                    key={opt}
                    onClick={() => handleSelect(q.id, opt, q.type === 'MSQ')}
                    className={`p-3 rounded-lg border text-left ${answers[q.id]?.includes(opt) ? 'bg-indigo-600 text-white' : 'hover:bg-slate-50'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <button 
          onClick={submitTest}
          disabled={submitting}
          className="w-full bg-slate-900 text-white py-4 rounded-xl font-black"
        >
          {submitting ? 'Calculating...' : 'Submit Evaluation'}
        </button>
      </div>
    </main>
  );
}