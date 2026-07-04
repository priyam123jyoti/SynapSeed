'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, ShieldCheck, ArrowRight } from 'lucide-react';

export default function TestHubPage() {
  const router = useRouter();
  const [testId, setTestId] = useState('');

  const handleJoinTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testId.trim()) return;
    router.push(`/test/${testId.trim()}`);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Academic Assessment Core
        </h1>
        <p className="text-lg text-slate-600 max-w-xl mx-auto">
          Welcome to the Departmental Evaluation Portal. Select your portal track to proceed.
        </p>
      </div>

      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-6">
        {/* Track 1: Student Participation */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Student Portal</h2>
            <p className="text-sm text-slate-500 mb-6">
              Participate in live examinations, complete assigned quizzes, and submit evaluations.
            </p>
          </div>

          <form onSubmit={handleJoinTest} className="space-y-3">
            <input
              type="text"
              placeholder="Enter Test Instance ID"
              value={testId}
              onChange={(e) => setTestId(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              Launch Assessment
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Track 2: Instructor Workspace */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Instructor Panel</h2>
            <p className="text-sm text-slate-500 mb-6">
              Upload course material PDFs, initialize cognitive model parameters, and configure automated quiz generations.
            </p>
          </div>

          <button
            onClick={() => router.push('/admin/test/create')}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 flex items-center justify-center gap-2 mt-auto"
          >
            Access Controller Workspace
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </main>
  );
}