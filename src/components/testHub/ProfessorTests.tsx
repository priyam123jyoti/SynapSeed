'use client';

import { useRouter } from 'next/navigation';
import {
  BookOpen,
  CalendarDays,
  ArrowRight,
} from 'lucide-react';

import { Test } from './types';

interface ProfessorTestsProps {
  tests: Test[];
}

export default function ProfessorTests({
  tests,
}: ProfessorTestsProps) {
  const router = useRouter();

  if (tests.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-center text-stone-400 text-sm">
        This educator has not published any tests yet.
      </div>
    );
  }

  return (
    <div className="space-y-3 overflow-y-auto flex-1 pr-1">
      {tests.map((test) => (
        <div
          key={test.id}
          className="bg-stone-50 border border-stone-200 rounded-2xl p-5 hover:border-emerald-600 hover:bg-emerald-50 transition-all"
        >
          <div className="flex justify-between items-start gap-4">

            <div className="flex-1">

              <div className="flex items-center gap-2 mb-2">
                <BookOpen
                  size={18}
                  className="text-emerald-700"
                />

                <h3 className="font-bold text-stone-900">
                  {test.title}
                </h3>
              </div>

              {test.description && (
                <p className="text-sm text-stone-500 mb-3">
                  {test.description}
                </p>
              )}

              <div className="flex items-center gap-2 text-xs text-stone-400">
                <CalendarDays size={13} />
                {new Date(test.created_at).toLocaleDateString()}
              </div>

            </div>

            <button
              onClick={() => router.push(`/test/${test.id}`)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition"
            >
              Start
              <ArrowRight size={14} />
            </button>

          </div>
        </div>
      ))}
    </div>
  );
}