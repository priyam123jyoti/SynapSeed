'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthProvider';

interface Result {
  id: string;
  score: number;
  total_questions: number;
  percentage: number;

  test: {
    id: string;
    title: string;
    description: string;
    creator_name?: string;
    creator_college?: string;
  };
}

export default function ResultsPage() {
  const router = useRouter();

  const { user } = useAuth();

  const [results, setResults] =
    useState<Result[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchResults() {
      try {

        const res = await fetch('/api/results', {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            studentId: user.id,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.error || 'Failed to fetch results'
          );
        }

        setResults(data.results || []);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();

  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading Results...
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Please login to view your results.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10">

          <h1 className="text-4xl font-black text-slate-900 mb-2">
            My Results
          </h1>

          <p className="text-slate-500">
            Review all your participated tests.
          </p>

        </div>

        {/* Empty State */}
        {results.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">

            <h2 className="text-2xl font-black text-slate-800 mb-3">
              No Results Yet
            </h2>

            <p className="text-slate-500">
              You have not participated in a test yet.
            </p>

          </div>
        )}

        {/* Results */}
        <div className="grid gap-6">

          {results.map((result) => (

            <button
              key={result.id}
              onClick={() =>
                router.push(`/results/${result.id}`)
              }
              className="bg-white border border-slate-200 rounded-3xl p-6 text-left hover:border-indigo-400 hover:shadow-lg transition-all"
            >

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                {/* Left */}
                <div className="flex-1">

                  <h2 className="text-2xl font-black text-slate-900">
                    {result.test?.title}
                  </h2>

                  <p className="text-slate-500 mt-2">
                    {result.test?.description}
                  </p>

                  <div className="mt-4 text-sm text-slate-400">
                    By {result.test?.creator_name}
                  </div>

                </div>

                {/* Right */}
                <div className="flex items-center gap-4">

                  {/* Score */}
                  <div className="bg-slate-100 rounded-2xl px-5 py-4 text-center min-w-[120px]">

                    <div className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">
                      Score
                    </div>

                    <div className="text-2xl font-black text-slate-900">
                      {result.score}/
                      {result.total_questions * 2}
                    </div>

                  </div>

                  {/* Percentage */}
                  <div
                    className={`rounded-2xl px-5 py-4 text-center min-w-[120px]

                      ${
                        result.percentage >= 80
                          ? 'bg-emerald-100 text-emerald-700'
                          : result.percentage >= 50
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-rose-100 text-rose-700'
                      }
                    `}
                  >

                    <div className="text-xs uppercase tracking-widest font-bold opacity-70 mb-1">
                      Percentage
                    </div>

                    <div className="text-3xl font-black">
                      {result.percentage}%
                    </div>

                  </div>

                </div>

              </div>

            </button>

          ))}

        </div>

      </div>

    </main>
  );
}