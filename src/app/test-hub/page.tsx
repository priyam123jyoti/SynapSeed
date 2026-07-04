'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js'; // Adapt to your project's initialization utility
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, ShieldCheck, ArrowLeft, School, Calendar, BookOpen, User } from 'lucide-react';
import AuthGuardModal from '@/components/auth/AuthGuardModal'; // Adjust import path to your project layout

// Standard client initialization (Fallback uses environment variables)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function TestHubPage() {
  const router = useRouter();

  // Guard & User Session States
  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Core Functional States
  const [instructors, setInstructors] = useState<any[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<any | null>(null);
  const [instructorTests, setInstructorTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Verify User Authentication Session
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAuthModalOpen(true);
      } else {
        setUser(user);
        fetchInstructors();
      }
    }
    checkAuth();
  }, []);

  // 2. Fetch Unique Instructors who have published evaluations
  async function fetchInstructors() {
    try {
      setLoading(true);
      // Calls your custom backend API route compiling instructor aggregations
      const res = await fetch('/api/instructors');
      if (res.ok) {
        const data = await res.json();
        setInstructors(data.instructors || []);
      }
    } catch (err) {
      console.error("Error fetching aggregated instructor tracks:", err);
    } finally {
      setLoading(false);
    }
  }

  // 3. Drilldown: Fetch Tests for a Specific Instructor (Latest to Oldest)
  const handleSelectInstructor = async (instructor: any) => {
    setSelectedInstructor(instructor);
    try {
      setLoading(true);
      const res = await fetch(`/api/instructors/${instructor.id}/tests`);
      if (res.ok) {
        const data = await res.json();
        setInstructorTests(data.tests || []);
      }
    } catch (err) {
      console.error("Error fetching specific instructor evaluations:", err);
    } finally {
      setLoading(false);
    }
  };

  // Guard Modal Redirection Fallback
  const handleAuthClose = () => {
    setIsAuthModalOpen(false);
    router.push('/'); // Redirect unauthenticated users to a landing layout
  };

  if (isAuthModalOpen) {
    return <AuthGuardModal isOpen={isAuthModalOpen} onClose={handleAuthClose} title="MOANA AI HUB" />;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white py-12 px-4 md:px-8">
      {/* Upper Navigation Header */}
      <div className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            MOANA EVALUATION CORE
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Secure cross-departmental testing node powered by Supabase Identity.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/admin/test/create')}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-xs font-bold tracking-wide uppercase transition-all flex items-center gap-2"
          >
            <ShieldCheck size={16} className="text-emerald-400" />
            Instructor Panel
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {/* VIEW 2: Individual Tests Grid (Latest to Oldest) */}
          {selectedInstructor ? (
            <motion.div
              key="tests-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <button
                onClick={() => setSelectedInstructor(null)}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider transition-colors mb-4"
              >
                <ArrowLeft size={14} /> Back to Instructors
              </button>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
                {selectedInstructor.profile_picture ? (
                  <img src={selectedInstructor.profile_picture} alt="" className="w-16 h-16 rounded-2xl object-cover" />
                ) : (
                  <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center"><User /></div>
                )}
                <div>
                  <h2 className="text-2xl font-black uppercase">{selectedInstructor.name}</h2>
                  <p className="text-sm text-slate-400 flex items-center gap-1.5"><School size={14} /> {selectedInstructor.college_name}</p>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-20 text-slate-500 text-sm font-medium animate-pulse">Syncing dynamic data streams...</div>
              ) : instructorTests.length === 0 ? (
                <div className="text-center py-25 border border-dashed border-slate-800 rounded-3xl text-slate-500">
                  This instructor hasn't published any active assessments.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {instructorTests.map((test) => (
                    <div
                      key={test.id}
                      onClick={() => router.push(`/test/${test.id}`)}
                      className="group bg-slate-900/40 border border-slate-800 hover:border-indigo-500/50 p-6 rounded-3xl flex flex-col justify-between cursor-pointer transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.05)]"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <span className="px-3 py-1 bg-slate-800 text-[10px] font-black tracking-widest text-slate-300 uppercase rounded-full">
                            {test.questions_count || 0} Questions
                          </span>
                          <Calendar size={14} className="text-slate-600" />
                        </div>
                        <h3 className="text-lg font-bold group-hover:text-indigo-400 transition-colors line-clamp-2 uppercase tracking-tight">
                          {test.title}
                        </h3>
                        {test.description && <p className="text-xs text-slate-500 mt-2 line-clamp-2">{test.description}</p>}
                      </div>
                      <div className="mt-6 pt-4 border-t border-slate-800/60 flex justify-between items-center text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
                        <span>LAUNCH ASSESSMENT</span>
                        <BookOpen size={14} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            // VIEW 1: Aggregated Instructor Profile Cards Grid
            <motion.div
              key="instructors-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-xs font-black tracking-widest text-slate-500 uppercase mb-6">Select Departmental Evaluation Portal</h2>

              {loading ? (
                <div className="text-center py-20 text-slate-500 text-sm font-medium animate-pulse">Parsing verified identities...</div>
              ) : instructors.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl text-slate-500 text-sm">
                  No published evaluations found on the system networks.
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {instructors.map((inst) => (
                    <div
                      key={inst.id}
                      onClick={() => handleSelectInstructor(inst)}
                      className="group bg-slate-950 border border-slate-800 hover:border-slate-700 p-6 rounded-[2rem] flex items-center gap-4 cursor-pointer transition-all hover:bg-slate-900/30"
                    >
                      <div className="relative flex-shrink-0">
                        {inst.profile_picture ? (
                          <img
                            src={inst.profile_picture}
                            alt={inst.name}
                            className="w-14 h-14 rounded-2xl object-cover border border-slate-800 group-hover:scale-95 transition-transform"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
                            <User size={20} />
                          </div>
                        )
                        }
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-black tracking-tight text-white group-hover:text-indigo-400 transition-colors uppercase truncate">
                          {inst.name}
                        </h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                          <School size={12} className="text-slate-600 flex-shrink-0" />
                          {inst.college_name || "Independent Institution"}
                        </p>
                        <span className="inline-block mt-2 text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          {inst.total_tests || 0} active tests
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}