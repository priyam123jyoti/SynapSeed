'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function TakeTestPage() {
  const router = useRouter();
  const params = useParams();

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
  setSubmitting(true);

  try {
    const res = await fetch('/api/submit-test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        testId: id,
        studentName: 'Anonymous Student',
        answers,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Submission failed');
    }

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

      <h1 className="text-3xl font-black mb-2">
        {test.title}
      </h1>

      {test.description && (
        <p className="text-slate-500 mb-8">
          {test.description}
        </p>
      )}

      <div className="space-y-8">

        {test.questions?.map((q: any, index: number) => (
          <div
            key={q.id}
            className="bg-white border border-slate-200 rounded-2xl p-6"
          >
            <h2 className="font-bold text-lg mb-4">
              {index + 1}. {q.question_text}
            </h2>

            {q.type === 'FITB' ? (
              <input
                type="text"
                className="w-full border rounded-xl p-3"
                value={answers[q.id]?.[0] || ''}
                onChange={(e) =>
                  setAnswers({
                    ...answers,
                    [q.id]: [e.target.value],
                  })
                }
              />
            ) : (
              <div className="space-y-2">

                {q.options?.map((option: string) => (
                  <button
                    key={option}
                    onClick={() =>
                      handleSelect(
                        q.id,
                        option,
                        q.type === 'MSQ'
                      )
                    }
                    className={`w-full text-left p-3 rounded-xl border transition

                      ${
                        answers[q.id]?.includes(option)
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white hover:bg-slate-50'
                      }
                    `}
                  >
                    {option}
                  </button>
                ))}

              </div>
            )}
          </div>
        ))}

        <button
          onClick={submitTest}
          disabled={submitting}
          className="w-full py-4 rounded-xl bg-slate-900 text-white font-black disabled:bg-slate-400"
        >
          {submitting
            ? 'Submitting...'
            : 'Submit Test'}
        </button>

      </div>
    </main>
  );
}