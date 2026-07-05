'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Users, Building2 } from 'lucide-react';

interface Creator {
  creator_id: string;
  creator_name: string;
  creator_college: string;
  total_tests: number;
  latest_test: string;
}

export default function StudentDashboardPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCreators() {
      try {
        const res = await fetch('/api/test-creator');
        const data = await res.json();

        setCreators(data.creators || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadCreators();
  }, []);

  const totalTests = creators.reduce(
    (sum, creator) => sum + creator.total_tests,
    0
  );

  return (
    <main className="min-h-screen bg-slate-50/50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 shadow-xl">
          <span className="text-[10px] font-black tracking-widest uppercase text-emerald-400 bg-emerald-950/50 px-3 py-1 rounded-full">
            LMS Navigation Center
          </span>

          <h1 className="text-3xl font-black mt-4">
            Active Evaluation Matrix Hub
          </h1>

          <p className="text-slate-300 mt-2">
            Browse educators and take their published assessments.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-4">

            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">
              Featured Educators
            </h2>

            {loading ? (
              <div className="bg-white rounded-2xl border p-12 text-center">
                Loading educators...
              </div>
            ) : creators.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed p-12 text-center">
                No educators have published any tests yet.
              </div>
            ) : (
              creators.map((creator) => (
                <Link
                  key={creator.creator_id}
                  href={`/creator/${creator.creator_id}`}
                  className="block"
                >
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all">

                    <div className="flex justify-between items-center">

                      <div>

                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-indigo-600" />

                          <h3 className="text-xl font-black">
                            {creator.creator_name}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2 mt-2 text-slate-500">
                          <Building2 className="w-4 h-4" />
                          <span>{creator.creator_college}</span>
                        </div>

                        <p className="mt-4 text-sm font-semibold text-indigo-700">
                          {creator.total_tests} Published Tests
                        </p>

                      </div>

                      <ArrowRight className="text-slate-400" />

                    </div>

                  </div>
                </Link>
              ))
            )}

          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">

            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">
              Platform Statistics
            </h2>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">

              <div>

                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                  Total Educators
                </p>

                <h2 className="text-4xl font-black text-slate-900 mt-2">
                  {creators.length}
                </h2>

              </div>

              <div className="border-t pt-6">

                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                  Published Tests
                </p>

                <h2 className="text-4xl font-black text-indigo-700 mt-2">
                  {totalTests}
                </h2>

              </div>

            </div>

          </div>

        </div>
      </div>
    </main>
  );
}