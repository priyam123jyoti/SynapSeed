'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, ArrowRight } from 'lucide-react';

interface Test {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

interface CreatorData {
  creator_name: string;
  creator_college: string;
  tests: Test[];
}

export default function CreatorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [creator, setCreator] = useState<CreatorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCreator() {
      try {
        const res = await fetch(`/api/test-creator/${id}`);
        const data = await res.json();

        setCreator(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadCreator();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Loading...
      </main>
    );
  }

  if (!creator) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Creator not found.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">

      <div className="max-w-5xl mx-auto">

        <Link
          href="/student"
          className="inline-flex items-center gap-2 text-sm mb-8 hover:text-indigo-600"
        >
          <ArrowLeft size={18} />
          Back
        </Link>

        {/* Creator Header */}

        <div className="bg-white rounded-3xl shadow p-8 mb-8">

          <div className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xl font-bold mb-4">
            {creator.creator_name.charAt(0)}
          </div>

          <h1 className="text-3xl font-bold">
            {creator.creator_name}
          </h1>

          <p className="text-slate-500 mt-2">
            {creator.creator_college}
          </p>

          <div className="mt-4 inline-block bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-semibold">
            {creator.tests.length} Published Tests
          </div>

        </div>

        {/* Tests */}

        <div className="space-y-5">

          {creator.tests.map((test) => (

            <div
              key={test.id}
              className="bg-white rounded-2xl shadow p-6 flex justify-between items-center"
            >

              <div>

                <div className="flex items-center gap-2 mb-2">

                  <BookOpen size={18} />

                  <h2 className="font-bold text-xl">
                    {test.title}
                  </h2>

                </div>

                <p className="text-slate-500">
                  {test.description}
                </p>

                <p className="text-xs text-slate-400 mt-3">
                  Published{" "}
                  {new Date(test.created_at).toLocaleDateString()}
                </p>

              </div>

              <Link
                href={`/test/${test.id}`}
                className="bg-indigo-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-indigo-700"
              >
                Start Test
                <ArrowRight size={16} />
              </Link>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}