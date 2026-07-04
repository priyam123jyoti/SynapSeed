'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, FileText, Calendar, Loader2, ChevronRight, MoreVertical } from 'lucide-react';

// Define the shape of your test data returning from the database
interface TestSummary {
  id: string;
  title: string;
  description: string;
  created_at: string;
  question_count: number;
}

export default function AdminTestDashboard() {
  const [tests, setTests] = useState<TestSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all tests on component mount
  useEffect(() => {
    const fetchTests = async () => {
      try {
        // You will need an API route like /api/tests to GET this data from Supabase
        const res = await fetch('/api/tests');
        if (!res.ok) throw new Error('Failed to load tests.');
        
        const data = await res.json();
        setTests(data.tests || []); // Assuming your API returns { tests: [...] }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTests();
  }, []);

  // Filter tests based on the search bar
  const filteredTests = tests.filter(test => 
    test.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (test.description && test.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Assessment Matrix</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Manage, review, and provision your evaluation modules.</p>
          </div>
          
          <Link 
            href="/admin/test/create"
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-md shadow-slate-200"
          >
            <Plus size={16} /> Create New Test
          </Link>
        </div>

        {/* Toolbar (Search) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <Search size={18} className="text-slate-400 ml-2" />
          <input 
            type="text" 
            placeholder="Search assessments by title or keywords..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-sm font-semibold focus:outline-none focus:ring-0 text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-sm font-bold flex items-center gap-3">
            <span>Failed to load database state: {error}</span>
          </div>
        )}

        {/* Main Content Area */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 space-y-4">
            <Loader2 size={32} className="animate-spin text-emerald-500" />
            <span className="text-xs font-black uppercase tracking-widest">Querying Database...</span>
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-2">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-black text-slate-900">No Assessments Found</h3>
            <p className="text-sm text-slate-500 max-w-md">
              {searchQuery 
                ? "No tests matched your current search parameters. Try adjusting your keywords." 
                : "The system is currently empty. Initialize a new assessment matrix to begin."}
            </p>
            {!searchQuery && (
              <Link 
                href="/admin/test/create"
                className="mt-4 text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                Launch Generator Engine
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test) => (
              <div key={test.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group flex flex-col h-full">
                
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <button className="text-slate-300 hover:text-slate-600 transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">{test.title}</h3>
                <p className="text-xs font-medium text-slate-500 line-clamp-2 mb-6 flex-1">
                  {test.description || "No specific instructions provisioned for this matrix."}
                </p>
                
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(test.created_at).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5 text-emerald-600">{test.question_count} Qs</span>
                  </div>
                  
                  <Link 
                    href={`/admin/test/${test.id}`}
                    className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors"
                  >
                    <ChevronRight size={14} />
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