"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft, Upload, Check } from 'lucide-react';

// 50 Interests as requested
const INTEREST_TAGS = [
  "Botany", "Physics", "Chemistry", "Genetics", "Artificial Intelligence", 
  "Blockchain", "Robotics", "Quantum Science", "Quantum Computing", "Software Development", 
  "Foreign University Internships", "Study Abroad", "Machine Learning", "Data Science", "Web3",
  "Cybersecurity", "Cloud Computing", "Space Exploration", "Astrophysics", "Neuroscience",
  "Biotechnology", "Nanotechnology", "Renewable Energy", "Mathematics", "Economics",
  "Philosophy", "Psychology", "History", "Literature", "Creative Writing",
  "Digital Art", "UI/UX Design", "Entrepreneurship", "Startups", "Venture Capital",
  "Public Speaking", "Language Learning", "Sociology", "Political Science", "Law",
  "Medicine", "Pharmacology", "Ecology", "Marine Biology", "Zoology",
  "Geology", "Agriculture", "Food Science", "Architecture", "Civil Engineering"
];

export default function OnboardingPage() {
  const { user }: any = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [username, setUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [occupation, setOccupation] = useState('');
  const [institution, setInstitution] = useState('');
  const [isDhakuakhana, setIsDhakuakhana] = useState(false);
  const [phone, setPhone] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [bio, setBio] = useState('');

  // 1. Check if user already completed onboarding
  useEffect(() => {
    const checkExistingProfile = async () => {
      if (!user) return;
      const { data } = await supabase.from('profiles').select('username').eq('id', user.id).single();
      
      if (data?.username) {
        router.push('/'); // Already has a username, skip onboarding
      } else {
        setLoading(false); // Let them onboard
      }
    };
    checkExistingProfile();
  }, [user, router]);

  // 2. Real-time Username Check (Debounced)
  useEffect(() => {
    if (username.length < 3) {
      setUsernameStatus('idle');
      return;
    }
    const timer = setTimeout(async () => {
      setUsernameStatus('checking');
      const { data } = await supabase.from('profiles').select('username').eq('username', username.toLowerCase()).single();
      setUsernameStatus(data ? 'taken' : 'available');
    }, 500); // 500ms delay to prevent spamming DB

    return () => clearTimeout(timer);
  }, [username]);

  const toggleInterest = (tag: string) => {
    setSelectedInterests(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleComplete = async () => {
    setSaving(true);
    // Construct profile data
    const profileData = {
      id: user.id, // Links to auth.users
      username: username.toLowerCase(),
      occupation,
      institution: ['Student', 'Teacher'].includes(occupation) ? institution : null,
      is_dhakuakhana: isDhakuakhana,
      phone: phone || null,
      interests: selectedInterests,
      bio: bio || null,
      avatar_url: null, // You can implement Supabase Storage upload here later
      updated_at: new Date()
    };

    const { error } = await supabase.from('profiles').upsert(profileData);
    
    if (!error) {
      router.push('/profile');
    } else {
      console.error(error);
      alert("Error saving profile. Please try again.");
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-emerald-800 font-bold animate-pulse">Verifying Neural Identity...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 min-h-[600px] flex flex-col relative">
        
        {/* Progress Bar */}
        <div className="h-2 w-full bg-slate-100 absolute top-0 left-0">
          <motion.div 
            className="h-full bg-emerald-500"
            initial={{ width: "25%" }}
            animate={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <div className="p-10 flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Identity & Occupation */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create your SynapSeed Identity</h2>
                
                {/* Username */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Unique Username</label>
                  <div className="relative">
                    <input 
                      type="text" value={username} onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ''))} // No spaces
                      placeholder="e.g. quantum_coder"
                      className={`w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${usernameStatus === 'taken' ? 'border-red-300' : 'border-slate-200'}`}
                    />
                    <div className="absolute right-4 top-4">
                      {usernameStatus === 'checking' && <span className="text-slate-400 text-sm animate-pulse">Checking...</span>}
                      {usernameStatus === 'available' && <CheckCircle2 className="text-emerald-500" />}
                      {usernameStatus === 'taken' && <XCircle className="text-red-500" />}
                    </div>
                  </div>
                  {usernameStatus === 'taken' && <p className="text-xs text-red-500 font-bold mt-2">This username is already taken.</p>}
                </div>

                {/* Occupation */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Occupation</label>
                  <select 
                    value={occupation} onChange={(e) => setOccupation(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                  >
                    <option value="">Select your path...</option>
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher / Professor</option>
                    <option value="Self Learner">Self Learner</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Dynamic Fields based on Occupation */}
                {['Student', 'Teacher'].includes(occupation) && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 mt-4">Institution Name</label>
                    <input 
                      type="text" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="College or School name"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                    />
                    
                    <label className="flex items-center gap-3 mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl cursor-pointer">
                      <input type="checkbox" checked={isDhakuakhana} onChange={(e) => setIsDhakuakhana(e.target.checked)} className="w-5 h-5 accent-emerald-600 rounded" />
                      <span className="text-sm font-bold text-emerald-900">Are you a student/teacher of Dhakuakhana College (Autonomous)?</span>
                    </label>
                  </motion.div>
                )}

                {/* Phone Number */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Stay Connected (Optional)</label>
                  <p className="text-xs text-slate-500 mb-2">Let us send you important updates. Your number remains strictly private.</p>
                  <input 
                    type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                  />
                </div>

                <button 
                  disabled={usernameStatus !== 'available' || !occupation}
                  onClick={() => setStep(2)}
                  className="w-full mt-6 py-4 bg-slate-900 text-white font-black rounded-2xl uppercase text-[11px] tracking-widest hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:hover:bg-slate-900 flex items-center justify-center gap-2"
                >
                  Continue <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

            {/* STEP 2: Interests */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 h-full flex flex-col">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Select Your Interests</h2>
                  <p className="text-sm text-slate-500 font-medium mt-2">Select at least one to train your Neural Hub. You can pick as many as you like.</p>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-2 pb-4 flex flex-wrap gap-2 content-start max-h-[350px]">
                  {INTEREST_TAGS.map(tag => {
                    const isSelected = selectedInterests.includes(tag);
                    return (
                      <button
                        key={tag} onClick={() => toggleInterest(tag)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                          isSelected 
                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-105' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
                        }`}
                      >
                        {tag} {isSelected && <Check size={12} className="inline ml-1" />}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <button onClick={() => setStep(1)} className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all"><ArrowLeft size={20} /></button>
                  <button 
                    disabled={selectedInterests.length === 0} onClick={() => setStep(3)}
                    className="flex-1 py-4 bg-slate-900 text-white font-black rounded-2xl uppercase text-[11px] tracking-widest hover:bg-emerald-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    Continue <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Avatar */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 text-center flex flex-col items-center">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Upload Profile Image</h2>
                <p className="text-sm text-slate-500 font-medium">Put a face to your Neural Map. Or skip to use your initial.</p>
                
                <div className="w-32 h-32 my-8 rounded-[40px] bg-emerald-100 border-4 border-dashed border-emerald-300 flex items-center justify-center text-emerald-600 cursor-pointer hover:bg-emerald-200 transition-colors group">
                  {/* Note: Actual file upload to Supabase Storage requires bucket config. Sticking to visual placeholder for flow completion. */}
                  <div className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform">
                    <Upload size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Upload</span>
                  </div>
                </div>

                <div className="flex gap-4 w-full pt-8">
                  <button onClick={() => setStep(2)} className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all"><ArrowLeft size={20} /></button>
                  <button onClick={() => setStep(4)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl uppercase text-[11px] tracking-widest hover:bg-slate-200 transition-all">
                    Skip for now
                  </button>
                  <button onClick={() => setStep(4)} className="flex-1 py-4 bg-slate-900 text-white font-black rounded-2xl uppercase text-[11px] tracking-widest hover:bg-emerald-600 transition-all">
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Bio & Finish */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Write your Bio</h2>
                <p className="text-sm text-slate-500 font-medium">A short description of who you are and what you're learning.</p>
                
                <div>
                  <textarea 
                    value={bio} onChange={(e) => setBio(e.target.value.slice(0, 150))} // Max 150 chars like IG
                    placeholder="Exploring the quantum realm and building AI..."
                    className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none resize-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                  <div className="text-right text-xs font-bold text-slate-400 mt-2">
                    {bio.length} / 150
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <button onClick={() => setStep(3)} className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all"><ArrowLeft size={20} /></button>
                  <button 
                    onClick={handleComplete} disabled={saving}
                    className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-2xl uppercase text-[11px] tracking-widest hover:bg-emerald-500 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    {saving ? "Initializing Profile..." : "Complete Setup"}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}