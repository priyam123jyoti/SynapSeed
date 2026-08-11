'use client';

import { Building2, GraduationCap, Calendar, MessageSquare, Eye, ShieldCheck, QrCode, FileText, Bookmark, Layers } from 'lucide-react';

export interface PaperItem {
  id: string;
  college_name: string;
  program: string;
  stream?: string;
  department: string;
  course_type?: string;
  semester: number;
  year: number;
  course_code: string;
  course_title: string;
  exam_type: string;
  uploader_id: string;
  thumbnail_url?: string;
}

interface PaperCardProps {
  paper: PaperItem;
  currentUserEmail: string | null;
  adminEmail: string;
  isImageFailed: boolean;
  onImageError: (paperId: string) => void;
  onRequestPaper: (paper: PaperItem) => void;
}

export function PaperCard({
  paper,
  currentUserEmail,
  adminEmail,
  isImageFailed,
  onImageError,
  onRequestPaper,
}: PaperCardProps) {
  const thumbnailUrl = paper.thumbnail_url || `/api/papers/thumbnail/${paper.id}`;

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 overflow-hidden">
      <div className="space-y-4">
        {/* Paper Thumbnail Container */}
        <div className="relative w-full aspect-[4/3] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center">
          {!isImageFailed ? (
            <img
              src={thumbnailUrl}
              alt={paper.course_title}
              onError={() => onImageError(paper.id)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-slate-400 p-4 text-center">
              <FileText size={36} className="text-slate-300" />
              <span className="text-[10px] font-black uppercase tracking-wider">Preview Unavailable</span>
            </div>
          )}

          {/* Floating Exam Type Tag */}
          <span className="absolute top-2.5 left-2.5 bg-slate-900/90 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest shadow-sm">
            {paper.exam_type}
          </span>

          {/* Floating Price Tag */}
          <span className="absolute top-2.5 right-2.5 bg-emerald-600 text-white px-2.5 py-1 rounded-md text-xs font-black shadow-sm">
            ₹5.00
          </span>
        </div>

        {/* Paper Badges & Header Info */}
        <div>
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {paper.course_type && (
              <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1">
                <Bookmark size={10} /> {paper.course_type}
              </span>
            )}
            {paper.stream && (
              <span className="bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1">
                <Layers size={10} /> {paper.stream}
              </span>
            )}
          </div>

          <h3 className="font-black text-slate-900 text-sm tracking-tight leading-tight uppercase line-clamp-2">
            {paper.course_title}
          </h3>
          <p className="text-[11px] font-bold text-slate-500 mt-1">
            {paper.course_code} • {paper.department}
          </p>
        </div>

        <hr className="border-slate-100" />

        {/* Paper Details */}
        <div className="space-y-2 text-[11px] font-bold text-slate-600">
          <div className="flex items-center gap-2">
            <Building2 size={14} className="text-slate-400 shrink-0" />
            <span className="truncate">{paper.college_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap size={14} className="text-slate-400 shrink-0" />
            <span>
              {paper.program} {paper.stream ? `(${paper.stream})` : ''} • Semester {paper.semester}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-slate-400 shrink-0" />
            <span>Academic Exam Term Year: {paper.year}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() => onRequestPaper(paper)}
          className="w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-widest bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <MessageSquare size={16} /> Request on WhatsApp (₹5.00)
        </button>

        {/* ADMIN CONTROLS */}
        {currentUserEmail === adminEmail && (
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => window.open(`/papers/view/${paper.id}`, '_blank')}
              className="py-2.5 px-3 rounded-xl font-black text-[11px] uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-400/40 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Eye size={14} /> View PDF
            </button>

            <button
              onClick={() => window.open(`/papers/payment-info/${paper.id}`, '_blank')}
              className="py-2.5 px-3 rounded-xl font-black text-[11px] uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <QrCode size={14} /> Payment Info
            </button>
          </div>
        )}
      </div>
    </div>
  );
}