'use client';

import { useEffect, useState } from 'react';
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from 'lucide-react';

import ProfessorList from './ProfessorList';
import ProfessorTests from './ProfessorTests';

type Step = 'menu' | 'professors' | 'tests';

export default function TestPortal() {
  const [step, setStep] = useState<Step>('menu');

  const [loading, setLoading] = useState(false);

  const [professors, setProfessors] = useState<any[]>([]);

  const [selectedProfessor, setSelectedProfessor] = useState<any>(null);

  const [tests, setTests] = useState<any[]>([]);

  // Load creators
  useEffect(() => {
    if (step !== 'professors') return;

    async function fetchCreators() {
      setLoading(true);

      try {
        const res = await fetch('/api/test-creator');
        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        setProfessors(data.creators || []);
      } catch (err) {
        console.error(err);
        setProfessors([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCreators();
  }, [step]);

  // Load selected professor tests
  async function handleProfessorSelect(professor: any) {
    setSelectedProfessor(professor);

    setStep('tests');

    setLoading(true);

    try {
      const res = await fetch(
        `/api/test-creator/${professor.creator_id}`
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setTests(data.tests || []);
    } catch (err) {
      console.error(err);
      setTests([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-xl flex flex-col min-h-[430px]">

      {step === 'menu' && (
        <>
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6">
              <GraduationCap className="text-emerald-700" />
            </div>

            <h2 className="text-2xl font-black text-[#1a3c34]">
              Student Portal
            </h2>

            <p className="text-xs text-stone-500 mt-2">
              Browse educators and attempt published examinations.
            </p>
          </div>

          <button
            onClick={() => setStep('professors')}
            className="mt-auto bg-[#ef7b3f] text-white rounded-xl py-3 font-bold flex items-center justify-center gap-2"
          >
            Enter Student Portal

            <ArrowRight size={18} />
          </button>
        </>
      )}

      {step === 'professors' && (
        <>
          <div className="flex justify-between items-center mb-5">

            <button
              onClick={() => setStep('menu')}
              className="flex items-center gap-1 text-xs font-bold"
            >
              <ArrowLeft size={14} />

              Back
            </button>

            <span className="text-xs font-bold text-emerald-700 uppercase">
              Professors
            </span>

          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <ProfessorList
              professors={professors}
              onSelect={handleProfessorSelect}
            />
          )}
        </>
      )}

      {step === 'tests' && (
        <>
          <div className="flex justify-between items-center mb-5">

            <button
              onClick={() => setStep('professors')}
              className="flex items-center gap-1 text-xs font-bold"
            >
              <ArrowLeft size={14} />

              Back
            </button>

            <span className="text-xs font-bold text-emerald-700 uppercase">
              {selectedProfessor?.creator_name}
            </span>

          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <ProfessorTests tests={tests} />
          )}
        </>
      )}
    </div>
  );
}