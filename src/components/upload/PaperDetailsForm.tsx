'use client';

import Image from 'next/image';
import { Image as ImageIcon, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

export function PaperDetailsForm() {
  return (
    <>
      {/* College / Institute */}
      <div className="flex flex-col gap-1.5">
        <label className="font-semibold text-slate-700 text-sm">Institute Name</label>
        <input
          type="text"
          name="college_name"
          required
          placeholder="e.g., Dhakuakhana College"
          className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
        />
      </div>

      {/* Program */}
      <div className="flex flex-col gap-1.5">
        <label className="font-semibold text-slate-700 text-sm">Academic Program</label>
        <select
          name="program"
          required
          className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none bg-white"
        >
          <option value="">Select Program</option>
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
      </div>

      {/* Academic Stream */}
      <div className="flex flex-col gap-1.5">
        <label className="font-semibold text-slate-700 text-sm">Academic Stream</label>
        <input
          type="text"
          name="stream"
          required
          placeholder="e.g., Science, Arts, Commerce, Technology..."
          className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
        />
      </div>

      {/* Department / Subject */}
      <div className="flex flex-col gap-1.5">
        <label className="font-semibold text-slate-700 text-sm">Department / Subject</label>
        <input
          type="text"
          name="department"
          required
          placeholder="e.g., Physics, Chemistry, History, Computer Science..."
          className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
        />
      </div>

      {/* Course Type */}
      <div className="flex flex-col gap-1.5">
        <label className="font-semibold text-slate-700 text-sm">Course Type</label>
        <select
          name="course_type"
          required
          className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none bg-white"
        >
          <option value="">Select Course Type</option>
          <option value="Major">Major</option>
          <option value="Minor">Minor</option>
          <option value="SEC">Skill Enhancement Course (SEC)</option>
          <option value="VAC">Value Addition Course (VAC)</option>
          <option value="AEC">Ability Enhancement Course (AEC)</option>
          <option value="IDC">Interdisciplinary Course (IDC / MDC)</option>
          <option value="Core">Core Paper</option>
          <option value="Elective">Elective</option>
        </select>
      </div>

      {/* Semester */}
      <div className="flex flex-col gap-1.5">
        <label className="font-semibold text-slate-700 text-sm">Semester Lifecycle</label>
        <input
          type="number"
          name="semester"
          min="1"
          max="10"
          required
          placeholder="e.g., 3"
          className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
        />
      </div>

      {/* Year */}
      <div className="flex flex-col gap-1.5">
        <label className="font-semibold text-slate-700 text-sm">Examination Year Conducted</label>
        <input
          type="number"
          name="year"
          min="2000"
          max="2030"
          defaultValue={2026}
          required
          className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
        />
      </div>

      {/* Course Code */}
      <div className="flex flex-col gap-1.5">
        <label className="font-semibold text-slate-700 text-sm">Paper/Course Code</label>
        <input
          type="text"
          name="course_code"
          required
          placeholder="e.g., CS-302"
          className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
        />
      </div>

      {/* Course Title */}
      <div className="flex flex-col gap-1.5 md:col-span-2">
        <label className="font-semibold text-slate-700 text-sm">Course Title</label>
        <input
          type="text"
          name="course_title"
          required
          placeholder="e.g., Object Oriented Data Structures"
          className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
        />
      </div>

      {/* Exam Type */}
      <div className="flex flex-col gap-1.5 md:col-span-2">
        <label className="font-semibold text-slate-700 text-sm">Exam Assessment Classification Type</label>
        <div className="flex gap-4 p-1">
          <label className="flex items-center gap-2 font-semibold cursor-pointer text-sm">
            <input type="radio" name="exam_type" value="Semester End" defaultChecked /> Semester End Exam
          </label>
          <label className="flex items-center gap-2 font-semibold cursor-pointer text-sm">
            <input type="radio" name="exam_type" value="Sessional" /> Sessional / Mid-Term Test
          </label>
        </div>
      </div>

      {/* EXAMPLE THUMBNAIL REFERENCE CARD */}
      <div className="md:col-span-2 bg-amber-50/80 border border-amber-200 rounded-2xl p-4 space-y-3 mt-2">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
          <ShieldAlert size={16} className="text-amber-600" />
          Thumbnail Requirements & Guidelines
        </div>
        
        <p className="text-xs font-black text-amber-950 bg-amber-100/70 border border-amber-200 p-2.5 rounded-lg">
          The thumbnail should be like this and no question visible in the thumbnail.
        </p>

        {/* Static Image Example Box */}
        <div className="bg-white border border-amber-200 rounded-xl p-3 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
            <Image
              src="/thumbnail-example.jpg"
              alt="Thumbnail Example"
              width={176}
              height={112}
              className="w-full sm:w-44 h-28 object-cover rounded-lg"
            />
            <span className="absolute top-1 right-1 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
              Example
            </span>
          </div>

          <div className="space-y-1 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <CheckCircle2 size={14} /> Include top header / cover title only
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <CheckCircle2 size={14} /> Maximum photo file size: 500 KB
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              Crop the photo so only college name, paper title, course code, and exam year are shown. Keep actual exam questions hidden.
            </p>
          </div>
        </div>
      </div>

      {/* Paper Cover Thumbnail Upload Input */}
      <div className="flex flex-col gap-1.5 md:col-span-2">
        <label className="flex items-center gap-1.5 font-bold text-sm">
          <ImageIcon size={14} className="text-amber-500" />
          Paper Front Cover Thumbnail Photo (Max 500 KB)
        </label>
        <input
          type="file"
          name="thumbnail_file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          required
          className="p-3 border border-dashed border-amber-300 rounded-xl bg-amber-50/40 file:mr-4 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-white cursor-pointer"
        />
      </div>

      {/* Full Question Paper PDF ONLY Input */}
      <div className="flex flex-col gap-1.5 md:col-span-2 mt-1">
        <label className="flex items-center gap-1.5 font-bold text-sm">
          <FileText size={14} className="text-indigo-600" />
          Full Question Paper File (PDF Only, Max 1 MB)
        </label>
        <input
          type="file"
          name="file"
          accept="application/pdf, .pdf"
          required
          className="p-3 border border-dashed border-slate-300 rounded-xl bg-slate-50 file:mr-4 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white cursor-pointer"
        />
        <p className="text-[10px] text-slate-500 font-semibold">
          Only PDF document files are allowed. Photos or images of full papers will be rejected.
        </p>
      </div>
    </>
  );
}