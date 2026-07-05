'use client';

import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function InstructorPanel() {
  const router = useRouter();

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-xl flex flex-col min-h-[430px]">

      <div>

        <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center mb-6">
          <ShieldCheck className="text-[#1a3c34]" />
        </div>

        <h2 className="text-2xl font-black text-[#1a3c34] mb-3">
          Instructor Panel
        </h2>

        <p className="text-sm text-stone-500 leading-relaxed">
          Upload PDFs, generate questions using AI,
          manage published tests and review student
          submissions.
        </p>

      </div>

      <button
        onClick={() => router.push('/admin/test/create')}
        className="mt-auto bg-[#1a3c34] hover:bg-[#132c26] text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 transition"
      >
        Access Workspace

        <ArrowRight size={18} />
      </button>

    </div>
  );
}