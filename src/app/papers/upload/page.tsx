'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function PaperUploadClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/papers/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server rejected submission package.');

      setSuccess(true);
      setTimeout(() => router.push('/papers/catalog'), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl p-8 space-y-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Upload Previous Year Paper</h1>
          <p className="text-xs text-slate-500 font-bold mt-1">Ears ₹3 per download sale split. Fixed user rate cost: ₹5.00</p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl flex items-center gap-2 text-xs font-bold">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl flex items-center gap-2 text-xs font-bold">
            <CheckCircle size={16} /> Upload completed successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-slate-700">
          <div className="flex flex-col gap-1.5">
            <label>College / Institute Title Name</label>
            <input type="text" name="college_name" required placeholder="e.g., Dhakuakhana College" className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label>Academic Program</label>
            <select name="program" required className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none bg-white">
              <option value="BTech">B.TECH</option>
              <option value="BSc">B.Sc</option>
              <option value="MSc">M.Sc</option>
              <option value="BCA">BCA</option>
              <option value="MCA">MCA</option>
              <option value="BBA">BBA</option>
              <option value="MBA">MBA</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label>Department Stream</label>
            <input type="text" name="department" required placeholder="e.g., Computer Science" className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label>Semester Lifecycle</label>
            <input type="number" name="semester" min="1" max="10" required placeholder="e.g., 3" className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label>Examination Year Conducted</label>
            <input type="number" name="year" min="2000" max="2030" defaultValue={2026} required className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label>Paper/Course Code Identification</label>
            <input type="text" name="course_code" required placeholder="e.g., CS-302" className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none" />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label>Course Title Specification</label>
            <input type="text" name="course_title" required placeholder="e.g., Object Oriented Data Structures" className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none" />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label>Exam Assessment Classification Type</label>
            <div className="flex gap-4 p-1">
              <label className="flex items-center gap-2 font-semibold"><input type="radio" name="exam_type" value="Semester End" defaultChecked /> Semester End Exam</label>
              <label className="flex items-center gap-2 font-semibold"><input type="radio" name="exam_type" value="Sessional" /> Sessional / Mid-Term Test</label>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2 mt-2">
            <label>Upload Document File Asset (PDF / JPG Layouts)</label>
            <input type="file" name="file" accept=".pdf,.png,.jpg,.jpeg" required className="p-3 border border-dashed border-slate-300 rounded-xl bg-slate-50 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white cursor-pointer" />
          </div>

          <button type="submit" disabled={loading} className="w-full md:col-span-2 flex items-center justify-center gap-2 bg-slate-900 text-white p-4 rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-all uppercase tracking-widest mt-4">
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
            {loading ? 'Uploading Core Assets...' : 'Publish Paper - Cost Fixed ₹5.00'}
          </button>
        </form>
      </div>
    </main>
  );
}