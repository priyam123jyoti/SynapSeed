'use client';

import { Search, Building2 } from 'lucide-react';

interface PaperFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  collegeFilter: string;
  setCollegeFilter: (value: string) => void;
  programFilter: string;
  setProgramFilter: (value: string) => void;
  semFilter: string;
  setSemFilter: (value: string) => void;
}

export function PaperFilters({
  search,
  setSearch,
  collegeFilter,
  setCollegeFilter,
  programFilter,
  setProgramFilter,
  semFilter,
  setSemFilter,
}: PaperFiltersProps) {
  return (
    <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col gap-3">
      {/* Row 1: Full-width Main Search Input */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-3.5 text-slate-400" size={16} />
        <input
          type="text"
          placeholder="Multi-search: e.g. 2024 Botany 2nd sem MNBOT202 Angiosperm..."
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Row 2: Full-width Institution / College Name Filter */}
      <div className="relative w-full">
        <Building2 className="absolute left-3 top-3.5 text-slate-400" size={16} />
        <input
          type="text"
          placeholder="Type Institution / College Name..."
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
          value={collegeFilter}
          onChange={(e) => setCollegeFilter(e.target.value)}
        />
      </div>

      {/* Row 3: Program and Semester Select Dropdowns (Together side-by-side) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        <select
          className="p-3 border border-slate-200 rounded-xl text-xs font-bold bg-white focus:outline-none w-full"
          value={programFilter}
          onChange={(e) => setProgramFilter(e.target.value)}
        >
          <option value="">All Programs</option>
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
          className="p-3 border border-slate-200 rounded-xl text-xs font-bold bg-white focus:outline-none w-full"
          value={semFilter}
          onChange={(e) => setSemFilter(e.target.value)}
        >
          <option value="">All Semesters</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <option key={s} value={s.toString()}>
              Sem {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}