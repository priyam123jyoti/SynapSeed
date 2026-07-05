'use client';

import { ArrowRight, School, User } from 'lucide-react';
import { Professor } from './types';

interface ProfessorListProps {
  professors: Professor[];
  onSelect: (professor: Professor) => void;
}

export default function ProfessorList({
  professors,
  onSelect,
}: ProfessorListProps) {
  if (professors.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-center text-stone-400 text-sm">
        No published educators found.
      </div>
    );
  }

  return (
    <div className="space-y-3 overflow-y-auto flex-1 pr-1">
      {professors.map((professor) => (
        <button
          key={professor.creator_id}
          onClick={() => onSelect(professor)}
          className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-4 hover:border-emerald-600 hover:bg-emerald-50 transition-all text-left group"
        >
          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg">
              {professor.creator_name
                ? professor.creator_name.charAt(0).toUpperCase()
                : <User size={20} />}
            </div>

            <div className="flex-1 min-w-0">

              <h3 className="font-bold text-stone-900 truncate">
                {professor.creator_name}
              </h3>

              <div className="flex items-center gap-1 text-xs text-stone-500 mt-1">
                <School size={13} />
                <span className="truncate">
                  {professor.creator_college}
                </span>
              </div>

              <div className="mt-2 inline-block bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-[11px] font-bold">
                {professor.total_tests} Published Test
                {professor.total_tests > 1 ? 's' : ''}
              </div>

            </div>

            <ArrowRight
              size={18}
              className="text-stone-400 group-hover:text-emerald-700 transition"
            />

          </div>
        </button>
      ))}
    </div>
  );
}