'use client';

import { useState, useEffect } from 'react';
import { Search, Building2, GraduationCap, Calendar, Loader2, MessageSquare } from 'lucide-react';

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

// Replace with your active business WhatsApp number (with country code, e.g., 919876543210)
const WHATSAPP_NUMBER = '917637968060';

export default function PaperCatalogPage() {
  const [papers, setPapers] = useState<PaperItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [semFilter, setSemFilter] = useState('');

  async function fetchMarketplaceData() {
    try {
      setLoading(true);
      const resCatalog = await fetch('/api/papers/catalog-list');
      if (resCatalog.ok) {
        const catalogData = await resCatalog.json();
        setPapers(catalogData);
      }
    } catch (e) {
      console.error("Error fetching catalog data:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMarketplaceData();
  }, []);

  const handleRequestPaper = (paper: PaperItem) => {
    const message = `Hello! I would like to buy the following question paper:\n\n` +
      `*Course:* ${paper.course_title} (${paper.course_code})\n` +
      `*Institution:* ${paper.college_name}\n` +
      `*Program & Sem:* ${paper.program} - Sem ${paper.semester}\n` +
      `*Year:* ${paper.year}\n` +
      `*Paper ID:* ${paper.id}\n\n` +
      `Please share the UPI QR Code for ₹5.00 payment.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  const filteredPapers = papers.filter((paper) => {
    const matchesSearch = 
      paper.course_title.toLowerCase().includes(search.toLowerCase()) ||
      paper.course_code.toLowerCase().includes(search.toLowerCase()) ||
      paper.college_name.toLowerCase().includes(search.toLowerCase());
    
    const matchesProgram = programFilter === '' || paper.program === programFilter;
    const matchesSemester = semFilter === '' || paper.semester.toString() === semFilter;

    return matchesSearch && matchesProgram && matchesSemester;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-xs font-bold uppercase tracking-widest text-slate-500 gap-2">
        <Loader2 className="animate-spin text-slate-900" size={20} /> Loading Marketplace Catalog...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Marketplace Header Banner */}
        <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">Question Paper Catalog</h1>
          <p className="text-xs text-slate-400 font-bold">
            All Question Papers Fixed at ₹5.00 • Instant Delivery via WhatsApp & QR Payment
          </p>
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
              <option value="">Select Programs</option>
              <option value="BTech">B.TECH</option>
              <option value="MTech">M.TECH</option>
              <option value="BSc">B.Sc</option>
              <option value="MSc">M.Sc</option>
              <option value="BCA">BCA</option>
              <option value="MCA">MCA</option>
              <option value="BBA">BBA</option>
              <option value="MBA">MBA</option>
              <option value="BCom">B.COM</option>
              <option value="MCom">M.COM</option>
              <option value="BA">B.A.</option>
              <option value="MA">M.A.</option>
              <option value="BEd">B.Ed</option>
              <option value="MEd">M.Ed</option>
              <option value="BPharma">B.PHARMA</option>
              <option value="MPharma">M.PHARMA</option>
              <option value="DPharma">D.PHARMA</option>
              <option value="LLB">LLB</option>
              <option value="LLM">LLM</option>
              <option value="BArch">B.ARCH</option>
              <option value="MArch">M.ARCH</option>
              <option value="MBBS">MBBS</option>
              <option value="BDS">BDS</option>
              <option value="BAMS">BAMS</option>
              <option value="BHMS">BHMS</option>
              <option value="Nursing">B.Sc NURSING</option>
              <option value="BPT">BPT</option>
              <option value="MPT">MPT</option>
            </select>

            <select 
              className="p-3 border border-slate-200 rounded-xl text-xs font-bold bg-white focus:outline-none"
              value={semFilter}
              onChange={(e) => setSemFilter(e.target.value)}
            >
              <option value="">All Semesters</option>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s.toString()}>Sem {s}</option>)}
            </select>
          </div>
        </div>

        {/* Catalog Grid Distribution */}
        {filteredPapers.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider">
            No papers found matching the specified parameters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPapers.map((paper) => (
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
                  onClick={() => handleRequestPaper(paper)}
                  className="w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-widest bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageSquare size={16} /> Request on WhatsApp (₹5.00)
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}