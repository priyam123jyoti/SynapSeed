'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthProvider';

export default function TakeTestPage() {
  const router = useRouter();
  const params = useParams();

  const { user } = useAuth();

  const id = params.id as string;

  const [test, setTest] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchTest() {
      try {
        const res = await fetch(`/api/tests/${id}`);

        if (!res.ok) {
          throw new Error('Failed to fetch test');
        }

        const data = await res.json();

        console.log('Fetched Test:', data);

        setTest(data.test);
      } catch (err) {
        console.error('Error fetching test:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTest();
  }, [id]);

  const handleSelect = (
    qId: string,
    value: string,
    isMulti: boolean
  ) => {
    setAnswers((prev) => {
      const current = prev[qId] || [];

      if (isMulti) {
        return {
          ...prev,
          [qId]: current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value],
        };
      }

      return {
        ...prev,
        [qId]: [value],
      };
    });
  };

  async function submitTest() {
    if (!user) {
      alert('Please login first.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/submit-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testId: id,

          // IMPORTANT
          studentName:
            user.user_metadata?.username ||
            user.email ||
            'Anonymous Student',

          // IMPORTANT
          studentId: user.id,

          answers,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      // Redirect to individual result page
      router.push(`/results/${data.submissionId}`);

    } catch (err) {
      console.error(err);
      alert('Failed to submit test.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading Test...
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Test not found.
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-2">
          {test.title}
        </h1>

        {test.description && (
          <p className="text-slate-500 text-lg">
            {test.description}
          </p>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-8">

        {test.questions?.map((q: any, index: number) => (
          <div
            key={q.id}
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"
          >
            <div className="mb-5">
              <p className="text-sm font-bold text-indigo-600 mb-2">
                Question {index + 1}
              </p>

              <h2 className="font-bold text-xl text-slate-900 leading-relaxed">
                {q.question_text}
              </h2>
            </div>

            {/* FITB */}
            {q.type === 'FITB' ? (
              <input
                type="text"
                className="w-full border border-slate-300 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500"
                value={answers[q.id]?.[0] || ''}
                onChange={(e) =>
                  setAnswers({
                    ...answers,
                    [q.id]: [e.target.value],
                  })
                }
                placeholder="Type your answer..."
              />
            ) : (
              <div className="space-y-3">

                {q.options?.map((option: string) => {
                  const selected =
                    answers[q.id]?.includes(option);

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        handleSelect(
                          q.id,
                          option,
                          q.type === 'MSQ'
                        )
                      }
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-200

                        ${
                          selected
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50'
                        }
                      `}
                    >
                      {option}
                    </button>
                  );
                })}

              </div>
            )}

            {/* Type Badge */}
            <div className="mt-5">
              <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                {q.type}
              </span>
            </div>
          </div>
        ))}

        {/* Submit Button */}
        <button
          onClick={submitTest}
          disabled={submitting}
          className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black text-lg hover:bg-slate-800 transition disabled:bg-slate-400"
        >
          {submitting
            ? 'Submitting Test...'
            : 'Submit Test'}
        </button>

      </div>
    </main>
  );
}