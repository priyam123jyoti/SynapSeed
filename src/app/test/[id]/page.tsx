'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
// Note: You imported Loader2, CheckCircle2, ChevronRight from lucide-react but aren't using them yet. 
// You can add them back in your UI if you decide to use them!

// 1. Update the type definition to explicitly expect a Promise for params
export default function TakeTestPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  // 2. Unwrap the dynamic route parameter using React.use()
  const { id } = use(params);

  const [test, setTest] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchTest() {
      // 3. Safely use the unwrapped 'id' string for your network request
      const res = await fetch(`/api/test/${id}`);
      const data = await res.json();
      setTest(data.test);
      setLoading(false);
    }
    fetchTest();
  }, [id]); // Update dependency array to use the unwrapped ID

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
      body: JSON.stringify({ testId: id, answers }),
    });
    
    // Change this line to route back to your new hub
    if (res.ok) router.push('/test-hub'); 
    
    setSubmitting(false);
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading Test...</div>;

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-black mb-8">{test?.title}</h1>
      <div className="space-y-8">
        {test?.questions?.map((q: any, i: number) => (
          <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-200">
            <p className="font-bold text-lg mb-4">{i + 1}. {q.question_text}</p>
            {q.type === 'FITB' ? (
              <input 
                className="w-full p-3 border rounded-xl"
                onChange={(e) => setAnswers({...answers, [q.id]: [e.target.value]})}
              />
            ) : (
              <div className="grid gap-2">
                {q.options?.map((opt: string) => (
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
          className="w-full bg-slate-900 text-white py-4 rounded-xl font-black disabled:bg-slate-400"
        >
          {submitting ? 'Calculating...' : 'Submit Evaluation'}
        </button>
      </div>
    </main>
  );
}