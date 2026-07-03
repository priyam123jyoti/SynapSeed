'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Plus, ClipboardList, ArrowRight, Loader2, Calendar } from 'lucide-react';

interface TestItem {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

export default function AdminTestDashboard() {
  const [tests, setTests] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTests() {
      try {
        const { data, error } = await supabase
          .from('tests')
          .select('id, title, description, created_at')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTests(data || []);
      } catch (err) {
        console.error('Error fetching assessments:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTests();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-900 w-8 h-8" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Management Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Assessment Control Tower</h1>
            <p className="text-slate-500 text-xs mt-0.5">Manage your AI-generated curriculum evaluation matrices.</p>
          </div>
          <Link 
            href="/admin/test/create"
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest px-5 py-3 rounded-xl shadow-md transition-all h-fit"
          >
            <Plus size={14} /> Generate New Test
          </Link>
        </div>

        {/* Dynamic Assessments List Feed */}
        {tests.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-3">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mx-auto">
              <ClipboardList size={22} />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">No Active Tests Found</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">Use the provisioning generator engine to build live interactive examinations using AI pipelines.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tests.map((item) => (
              <div key={item.id} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <Calendar size={12} /> {new Date(item.created_at).toLocaleDateString()}
                  </div>
                  <h3 className="font-black text-slate-900 text-base tracking-tight leading-snug group-hover:text-emerald-600 transition-colors">{item.title}</h3>
                  <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{item.description}</p>
                </div>
                
                <div className="pt-6 mt-auto border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-300 bg-slate-50 px-2 py-0.5 rounded">ID: {item.id.slice(0, 8)}...</span>
                  <Link 
                    href={`/test/${item.id}`}
                    className="text-xs font-black text-slate-900 hover:text-emerald-600 flex items-center gap-1 transition-colors"
                  >
                    View Live Node <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}