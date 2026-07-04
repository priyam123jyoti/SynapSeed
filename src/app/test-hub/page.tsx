'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, ShieldCheck, ArrowRight, ArrowLeft, School, BookOpen, Loader2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthProvider'; 
import { supabase } from '@/lib/supabase';
import AuthGuardModal from '@/components/auth/AuthGuardModal';

export default function TestHubPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Navigation Steps inside Student Card Track: 'menu' | 'professors' | 'tests'
  const [studentStep, setStudentStep] = useState<'menu' | 'professors' | 'tests'>('menu');
  
  // Dynamic Data States
  const [professors, setProfessors] = useState<any[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState<any | null>(null);
  const [tests, setTests] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // 1. DIRECT-URL ENTRY PROTECTION (KICKBACK RULE)
  // If user state finishes loading and evaluates to empty/null, trigger security layout.
  if (loading || !user) {
    return (
      <div className="h-screen w-full bg-[#f5f4ef] flex flex-col items-center justify-center relative">
        <div className="flex flex-col items-center text-center select-none">
          <ShieldAlert size={48} className="text-[#1a3c34] animate-pulse mb-4" />
          <h2 className="text-[#1a3c34] font-black uppercase text-xs tracking-[0.2em]">
            Validating Core Credentials...
          </h2>
        </div>
        
        {/* Forces the modal block overlay on unauthenticated URL injections */}
        {!loading && !user && (
          <AuthGuardModal 
            isOpen={true} 
            onClose={() => router.push('/')} 
            title="TEST HUB ACCESS" 
          />
        )}
      </div>
    );
  }

  // 2. FETCH ACTIVE PROFESSORS (Triggered when stepping into student flow)
  useEffect(() => {
    if (studentStep === 'professors') {
      const fetchProfessors = async () => {
        setLoadingData(true);
        try {
          // Pulling unique test creators directly from your database
          const { data, error } = await supabase
            .from('tests')
            .select('creator_id, creator_name, creator_college, creator_avatar');

          if (!error && data) {
            // Client-side de-duplication to generate unique Professor Profile cards
            const uniqueProfs = Array.from(new Map(data.map(item => [item.creator_id, item])).values());
            setProfessors(uniqueProfs);
          }
        } catch (err) {
          console.error("Error connecting to evaluation logs:", err);
        } finally {
          setLoadingData(false);
        }
      };
      fetchProfessors();
    }
  }, [studentStep]);

  // 3. FETCH SELECTED PROFESSOR'S TESTS (Latest to Oldest)
  const handleSelectProfessor = async (prof: any) => {
    setSelectedProfessor(prof);
    setStudentStep('tests');
    setLoadingData(true);
    try {
      const { data, error } = await supabase
        .from('tests')
        .select('*')
        .eq('creator_id', prof.creator_id)
        .order('created_at', { ascending: false }); // Latest tests sorted to topmost position

      if (!error && data) {
        setTests(data);
      }
    } catch (err) {
      console.error("Error pulling academic assessments:", err);
    } finally {
      setLoadingData(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f4ef] flex flex-col items-center justify-center px-4 py-12">
      
      {/* Branding Header Area */}
      <div className="max-w-4xl w-full text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-[1px] bg-emerald-800"></div>
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-emerald-800">
            Secure Examination Space
          </span>
          <div className="w-6 h-[1px] bg-emerald-800"></div>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-[#1a3c34] tracking-tight mb-4">
          Academic Assessment Core
        </h1>
        <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
          Welcome to the Departmental Evaluation Portal. Authenticated node profile: <span className="font-bold text-emerald-700">{user.email}</span>
        </p>
      </div>

      {/* Main Structural Twin Track Grid */}
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-6 items-stretch">
        
        {/* Track 1: Dynamic Student Participation Hub */}
        <div className="bg-white p-8 rounded-[2rem] border border-stone-200/60 shadow-xl shadow-stone-200/40 flex flex-col justify-between min-h-[400px] relative overflow-hidden">
          <AnimatePresence mode="wait">
            
            {/* STEP A: Default Entry Screen */}
            {studentStep === 'menu' && (
              <motion.div
                key="step-menu"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex flex-col h-full justify-between flex-1"
              >
                <div>
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100">
                    <GraduationCap className="w-6 h-6 text-emerald-700" />
                  </div>
                  <h2 className="text-2xl font-black text-[#1a3c34] tracking-tight mb-2">Student Portal</h2>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Access live assessments, review published faculty assignments, and submit academic examinations directly.
                  </p>
                </div>

                <button
                  onClick={() => setStudentStep('professors')}
                  className="w-full bg-[#ef7b3f] text-white py-3.5 rounded-xl font-bold hover:bg-[#d96a2f] transition-all flex items-center justify-center gap-2 mt-auto text-xs uppercase tracking-wider shadow-lg shadow-orange-700/10 active:scale-98"
                >
                  Enter Student Portal
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* STEP B: Professor Directory Grid Selection */}
            {studentStep === 'professors' && (
              <motion.div
                key="step-professors"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col h-full flex-1"
              >
                <div className="flex items-center justify-between mb-5 border-b border-stone-100 pb-3">
                  <button 
                    onClick={() => setStudentStep('menu')}
                    className="text-[10px] font-black text-stone-400 hover:text-stone-900 flex items-center gap-1 uppercase tracking-widest transition-colors"
                  >
                    <ArrowLeft className="w-3 h-3" /> Core Menu
                  </button>
                  <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Faculty Directory</span>
                </div>

                {loadingData ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-stone-400 gap-2 py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-700" />
                    <p className="text-[10px] uppercase font-bold tracking-wider">Syncing Faculties...</p>
                  </div>
                ) : professors.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-stone-400 text-xs py-8 text-center font-medium">
                    No active evaluation creators found in database records.
                  </div>
                ) : (
                  <div className="space-y-2 overflow-y-auto max-h-[250px] pr-1 flex-1 custom-scrollbar">
                    {professors.map((prof) => (
                      <div
                        key={prof.creator_id}
                        onClick={() => handleSelectProfessor(prof)}
                        className="p-4 border border-stone-100 rounded-xl hover:border-emerald-600 hover:bg-emerald-50/10 cursor-pointer transition-all flex items-center gap-3 bg-stone-50/50 group"
                      >
                        {prof.creator_avatar ? (
                          <img src={prof.creator_avatar} alt="" className="w-10 h-10 rounded-xl object-cover border border-stone-200" />
                        ) : (
                          <div className="w-10 h-10 bg-emerald-50 text-emerald-800 rounded-xl flex items-center justify-center font-black text-sm uppercase border border-emerald-100">
                            {prof.creator_name?.[0] || 'P'}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-stone-900 text-sm truncate uppercase tracking-tight group-hover:text-emerald-700 transition-colors">
                            {prof.creator_name}
                          </h4>
                          <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5 truncate font-medium">
                            <School className="w-3 h-3 text-stone-400 flex-shrink-0" />
                            {prof.creator_college || 'Dhakuakhana College'}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all ml-auto flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP C: Chronological Test List of Selected Professor */}
            {studentStep === 'tests' && (
              <motion.div
                key="step-tests"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col h-full flex-1"
              >
                <div className="flex items-center justify-between mb-5 border-b border-stone-100 pb-3">
                  <button 
                    onClick={() => setStudentStep('professors')}
                    className="text-[10px] font-black text-stone-400 hover:text-stone-900 flex items-center gap-1 uppercase tracking-widest transition-colors"
                  >
                    <ArrowLeft className="w-3 h-3" /> Faculties
                  </button>
                  <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest truncate max-w-[140px]">
                    {selectedProfessor?.creator_name}
                  </span>
                </div>

                {loadingData ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-stone-400 gap-2 py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-700" />
                    <p className="text-[10px] uppercase font-bold tracking-wider">Compiling Assessments...</p>
                  </div>
                ) : tests.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-stone-400 text-xs py-8 text-center font-medium">
                    This professor has no active examinations published.
                  </div>
                ) : (
                  <div className="space-y-2 overflow-y-auto max-h-[250px] pr-1 flex-1 custom-scrollbar">
                    {tests.map((test) => (
                      <div
                        key={test.id}
                        onClick={() => router.push(`/test/${test.id}`)}
                        className="p-4 border border-stone-100 rounded-xl hover:border-emerald-700 hover:bg-emerald-50/10 cursor-pointer transition-all flex justify-between items-center bg-white group"
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <h4 className="font-bold text-stone-900 text-sm truncate uppercase tracking-tight group-hover:text-emerald-700 transition-colors">
                            {test.title}
                          </h4>
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mt-0.5">
                            Active Assessment Track
                          </p>
                        </div>
                        <BookOpen className="w-4 h-4 text-stone-300 group-hover:text-emerald-700 transition-colors flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Track 2: Instructor Workspace Control Panel (Untouched Architecture) */}
        <div className="bg-white p-8 rounded-[2rem] border border-stone-200/60 shadow-xl shadow-stone-200/40 flex flex-col justify-between min-h-[400px]">
          <div>
            <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center mb-6 border border-stone-100">
              <ShieldCheck className="w-6 h-6 text-[#1a3c34]" />
            </div>
            <h2 className="text-2xl font-black text-[#1a3c34] tracking-tight mb-2">Instructor Panel</h2>
            <p className="text-xs text-stone-500 leading-relaxed">
              Upload core course material PDFs, specify generation parameters, configure automated question trees, and catalog live evaluations.
            </p>
          </div>

          <button
            onClick={() => router.push('/admin/test/create')}
            className="w-full bg-[#1a3c34] text-white py-4 rounded-xl font-bold hover:bg-[#132c26] transition-all flex items-center justify-center gap-2 mt-auto text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/20 active:scale-98"
          >
            Access Controller Workspace
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </main>
  );
}