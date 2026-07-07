'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, BookOpen, GraduationCap, Building2, Calendar, Wallet, CheckCircle } from 'lucide-react';

interface PaperItem {
  id: string;
  college_name: string;
  program: string;
  department: string;
  semester: number;
  year: number;
  course_code: string;
  course_title: string;
  exam_type: string;
  uploader_id: string;
}

export default function PaperCatalogPage() {
  const router = useRouter();
  const [papers, setPapers] = useState<PaperItem[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [userWallet, setUserWallet] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  // Filter states
  const [search, setSearch] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [semFilter, setSemFilter] = useState('');

  async function fetchMarketplaceData() {
    try {
      // 1. In a production build, combine these fetch paths or pull them from an overarching state provider
      const resCatalog = await fetch('/api/papers/catalog-list'); // Create a standard fetch wrapper to query public.papers
      // For this step execution context, we simulate pulling the current authenticated parameters
      const resProfile = await fetch('/api/user/profile-wallet'); 
      
      // Stand-in mapping block until custom api wrappers are bound:
      // const data = await resCatalog.json();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handlePurchase = async (paperId: string) => {
    setActionId(paperId);
    try {
      const res = await fetch('/api/papers/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paperId }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Transaction failure.');

      alert('Purchase completely cleared! Secure tokens mapped to profile.');
      router.push(`/papers/view/${paperId}`);
    } catch (err: any) {
      alert(`Transaction Rejected: ${err.message}`);
    } finally {
      setActionId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Marketplace Header Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 text-white p-8 rounded-2xl shadow-xl gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-black uppercase tracking-tight">Question Paper Marketplace</h1>
            <p className="text-xs text-slate-400 font-bold">Secure Academic Document Exchange Protocol • All Papers Fixed at ₹5.00</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 px-5 py-3 rounded-xl">
            <Wallet className="text-emerald-400" size={18} />
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Your Wallet</p>
              <p className="text-sm font-black text-white">₹{userWallet.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Dynamic Navigation Filter Framework */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3 top-3.5 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by Course Title, Course Code or Institution Name..." 
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <select 
              className="p-3 border border-slate-200 rounded-xl text-xs font-bold bg-white focus:outline-none"
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
            >
              <option value="">All Programs</option>
              <option value="BTech">B.TECH</option>
              <option value="BSc">B.Sc</option>
              <option value="MSc">M.Sc</option>
            </select>

            <select 
              className="p-3 border border-slate-200 rounded-xl text-xs font-bold bg-white focus:outline-none"
              value={semFilter}
              onChange={(e) => setSemFilter(e.target.value)}
            >
              <option value="">All Semesters</option>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
            </select>
          </div>
        </div>

        {/* Catalog Grid Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mock Item Mapping Loop for illustration context visualization */}
          {papers.map((paper) => (
            <div key={paper.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest">
                    {paper.exam_type}
                  </span>
                  <span className="text-xs font-black text-slate-900">₹5.00</span>
                </div>

                <div>
                  <h3 className="font-black text-slate-900 text-sm tracking-tight leading-tight uppercase">{paper.course_title}</h3>
                  <p className="text-[11px] font-bold text-slate-500 mt-0.5">{paper.course_code} • {paper.department}</p>
                </div>

                <hr className="border-slate-100" />

                <div className="space-y-2 text-[11px] font-bold text-slate-600">
                  <div className="flex items-center gap-2"><Building2 size={14} className="text-slate-400" /> {paper.college_name}</div>
                  <div className="flex items-center gap-2"><GraduationCap size={14} className="text-slate-400" /> {paper.program} • Semester {paper.semester}</div>
                  <div className="flex items-center gap-2"><Calendar size={14} className="text-slate-400" /> Academic Exam Term Year: {paper.year}</div>
                </div>
              </div>

              <button
                onClick={() => handlePurchase(paper.id)}
                disabled={actionId !== null}
                className="w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                Unlock Document Access (₹5.00)
              </button>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}