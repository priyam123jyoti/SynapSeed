'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  UploadCloud, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  GraduationCap,
  Layers,
  FileText
} from 'lucide-react';

interface Paper {
  id: string;
  course_title: string;
  course_code: string;
  department: string;
  college_name: string;
  program: string;
  stream?: string;
  course_type?: string;
  exam_type?: string;
  year: string | number;
  semester: string | number;
}

// Card component with edge-to-edge thumbnail at the top and floating overlay tags
function PaperCardItem({ paper }: { paper: Paper }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="w-72 shrink-0 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm hover:border-indigo-300 transition-all flex flex-col justify-between select-none overflow-hidden group/card">
      
      {/* Edge-to-edge Thumbnail Container starting at top edge (0 padding) */}
      <div className="relative w-full h-48 bg-slate-200/80 flex items-center justify-center overflow-hidden">
        
        {/* Subtle Dark Gradient Overlay at Top for High Tag Contrast */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-slate-950/60 via-slate-950/20 to-transparent z-10 pointer-events-none" />

        {/* Floating Tags (Overlayed on top of thumbnail) */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between text-[10px] font-black uppercase pointer-events-none">
          <span className="bg-slate-900/85 backdrop-blur-md text-amber-400 px-2.5 py-1 rounded-md truncate max-w-[150px] border border-white/10 shadow-sm">
            {paper.department || paper.stream || 'General'}
          </span>
          <span className="bg-slate-900/85 backdrop-blur-md text-white border border-white/10 px-2 py-0.5 rounded-md font-bold shadow-sm">
            {paper.year}
          </span>
        </div>

        {/* Thumbnail Image / Fallback */}
        {!imgError ? (
          <img
            src={`/api/papers/thumbnail/${paper.id}`}
            alt={paper.course_title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-top group-hover/card:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5">
            <FileText size={32} className="text-indigo-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Preview N/A</span>
          </div>
        )}
      </div>

      {/* Card Content (Padded section below thumbnail) */}
      <div className="p-4 space-y-3 flex flex-col justify-between flex-1">
        <div>
          <h4 className="text-xs font-black text-slate-900 line-clamp-2 leading-snug">
            {paper.course_title}
          </h4>
          <p className="text-[11px] text-slate-500 font-bold truncate mt-1">
            {paper.course_code} • {paper.program} {paper.semester ? `(Sem ${paper.semester})` : ''}
          </p>
        </div>

        {/* College & Price Tag */}
        <div className="pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-[10px] font-black">
          <span className="text-slate-500 uppercase tracking-wide truncate max-w-[150px]">
            {paper.college_name || 'University'}
          </span>
          <span className="text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md shrink-0">₹5.00</span>
        </div>
      </div>

    </div>
  );
}

export function HomePaperPortal() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPapers() {
      try {
        const res = await fetch('/api/papers/catalog-list');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setPapers(data.slice(0, 20));
          }
        }
      } catch (error) {
        console.error('Failed to load live papers:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPapers();
  }, []);

  // Deactivate continuous marquee animation when there are fewer than 4 papers
  const isMarqueeActive = papers.length >= 4;

  // Duplicate paper items ONLY if marquee is active for seamless continuous scrolling
  const displayPapers = isMarqueeActive ? [...papers, ...papers] : papers;

  return (
    <section className="w-full py-12 px-4 md:px-8 bg-slate-50">
      {/* CSS Animation for Horizontal Continuous Motion */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-[11px] font-black uppercase tracking-wider">
            <Sparkles size={14} /> Synap Paper Hub
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">
            Previous Year Question Papers
          </h2>
        </div>

        {/* Main Portal Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* PORTAL 1: BROWSE CATALOG (~90% AREA) */}
          <Link 
            href="/papers/catalog" 
            className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden cursor-pointer"
          >
            {/* Background Accent Glow */}
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-indigo-50 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-100 transition-colors" />

            {/* Headline */}
            <div className="relative z-10 flex items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight uppercase group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                Buy all Indian Colleges/Universities PYQs (Semester & Sessional)
              </h3>
              <div className="bg-slate-900 text-white p-2 rounded-xl shrink-0 group-hover:bg-indigo-600 transition-colors">
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* PAPER CARDS CONTAINER */}
            <div className="relative w-full overflow-hidden my-4 py-2">
              {/* Fade Edges (Only active during marquee mode) */}
              {isMarqueeActive && (
                <>
                  <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />
                </>
              )}

              {loading ? (
                <div className="p-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Loading Papers...
                </div>
              ) : papers.length === 0 ? (
                <div className="p-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                  No question papers available in database yet.
                </div>
              ) : (
                /* Dynamic Marquee or Static Flex Grid based on paper count */
                <div className={isMarqueeActive ? "animate-marquee gap-5" : "flex flex-wrap gap-5 justify-start"}>
                  {displayPapers.map((paper, idx) => (
                    <PaperCardItem key={`${paper.id}-${idx}`} paper={paper} />
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Indicator */}
            <div className="relative z-10 pt-2 text-center border-t border-slate-100">
              <span className="text-[11px] font-black text-indigo-600 uppercase tracking-wider flex items-center justify-center gap-1.5 group-hover:underline">
                Click anywhere to open full catalog <ArrowRight size={14} />
              </span>
            </div>
          </Link>

          {/* PORTAL 2: UPLOAD PAPERS (4 COLS) */}
          <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-5 relative z-10">
              <div className="flex items-center justify-between">
                <span className="bg-amber-400/10 text-amber-400 border border-amber-400/30 text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1.5">
                  <UploadCloud size={12} /> Contribute Archive
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black tracking-tight uppercase group-hover:text-amber-400 transition-colors">
                  Upload Question Paper
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-1">
                  Share past semester question papers to expand our campus archive.
                </p>
              </div>

              <div className="space-y-2.5 bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-300 font-semibold">Select Program, Stream & Semester</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-300 font-semibold">Earn ₹3.00 payout per paper download</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-300 font-semibold">Help Peer Students Pass Exams</p>
                </div>
              </div>
            </div>

            <div className="pt-5 relative z-10">
              <Link 
                href="/papers/upload"
                className="w-full py-3 px-5 rounded-xl font-black text-xs uppercase tracking-widest bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center justify-center gap-2 shadow-lg group-hover:scale-[1.01]"
              >
                <UploadCloud size={16} />
                <span>Upload Paper Now</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Feature Highlights Footer */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-around gap-4 text-center md:text-left text-xs font-bold text-slate-600 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-600" />
            <span>Verified Question Papers</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap size={18} className="text-indigo-600" />
            <span>Covers Major & Minor Degrees</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-sky-600" />
            <span>Organized by Semester & Stream</span>
          </div>
        </div>

      </div>
    </section>
  );
}