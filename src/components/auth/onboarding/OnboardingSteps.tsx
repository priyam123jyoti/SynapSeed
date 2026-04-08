"use client";

import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Upload, CheckCircle2, XCircle } from 'lucide-react';
import { INTEREST_TAGS } from '@/lib/contants';

// --- STEP 1: IDENTITY ---
export const IdentityStep = ({ data, update, status, onNext }: any) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Identity Setup</h2>
    <div>
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Unique Username</label>
      <div className="relative">
        <input 
          type="text" value={data.username} 
          onChange={(e) => update({ username: e.target.value.replace(/\s+/g, '') })}
          placeholder="e.g. quantum_coder"
          className={`w-full p-4 bg-slate-50 border rounded-2xl outline-none transition-all ${status === 'taken' ? 'border-red-300' : 'border-slate-200 focus:ring-2 focus:ring-emerald-500/20'}`}
        />
        <div className="absolute right-4 top-4">
          {status === 'checking' && <span className="text-slate-400 text-sm animate-pulse">Checking...</span>}
          {status === 'available' && <CheckCircle2 className="text-emerald-500" />}
          {status === 'taken' && <XCircle className="text-red-500" />}
        </div>
      </div>
    </div>
    <div>
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Occupation</label>
      <select value={data.occupation} onChange={(e) => update({ occupation: e.target.value })} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
        <option value="">Select your path...</option>
        <option value="Student">Student</option>
        <option value="Teacher">Teacher / Professor</option>
        <option value="Self Learner">Self Learner</option>
        <option value="Other">Other</option>
      </select>
    </div>
    {['Student', 'Teacher'].includes(data.occupation) && (
      <div className="space-y-4">
        <input type="text" value={data.institution} onChange={(e) => update({ institution: e.target.value })} placeholder="Institution Name" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
        <label className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl cursor-pointer">
          <input type="checkbox" checked={data.isDhakuakhana} onChange={(e) => update({ isDhakuakhana: e.target.checked })} className="w-5 h-5 accent-emerald-600 rounded" />
          <span className="text-sm font-bold text-emerald-900">Dhakuakhana College affiliate?</span>
        </label>
      </div>
    )}
    <button disabled={status !== 'available' || !data.occupation} onClick={onNext} className="w-full mt-6 py-4 bg-slate-900 text-white font-black rounded-2xl uppercase text-[11px] tracking-widest hover:bg-emerald-600 disabled:opacity-50 flex items-center justify-center gap-2">
      Continue <ArrowRight size={16} />
    </button>
  </motion.div>
);

// --- STEP 2: INTERESTS ---
export const InterestsStep = ({ selected, onToggle, onNext, onBack }: any) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 flex flex-col">
    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Interests</h2>
    <div className="flex-1 overflow-y-auto pr-2 flex flex-wrap gap-2 max-h-[350px]">
      {INTEREST_TAGS.map(tag => (
        <button key={tag} onClick={() => onToggle(tag)} className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${selected.includes(tag) ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200'}`}>
          {tag}
        </button>
      ))}
    </div>
    <div className="flex gap-4 pt-4 border-t border-slate-100">
      <button onClick={onBack} className="p-4 bg-slate-100 rounded-2xl"><ArrowLeft size={20} /></button>
      <button disabled={selected.length === 0} onClick={onNext} className="flex-1 py-4 bg-slate-900 text-white font-black rounded-2xl uppercase text-[11px] tracking-widest hover:bg-emerald-600 disabled:opacity-50">Continue</button>
    </div>
  </motion.div>
);

// --- STEP 3: AVATAR ---
export const AvatarStep = ({ onNext, onBack }: any) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 text-center">
    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Avatar</h2>
    <div className="w-32 h-32 mx-auto my-8 rounded-[40px] bg-emerald-100 border-4 border-dashed border-emerald-300 flex items-center justify-center text-emerald-600 cursor-pointer hover:bg-emerald-200 group">
      <Upload size={24} className="group-hover:scale-110 transition-transform" />
    </div>
    <div className="flex gap-4 pt-8">
      <button onClick={onBack} className="p-4 bg-slate-100 rounded-2xl"><ArrowLeft size={20} /></button>
      <button onClick={onNext} className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl uppercase text-[11px]">Skip</button>
      <button onClick={onNext} className="flex-1 py-4 bg-slate-900 text-white font-black rounded-2xl uppercase text-[11px]">Continue</button>
    </div>
  </motion.div>
);

// --- STEP 4: BIO ---
export const BioStep = ({ bio, update, onComplete, onBack, saving }: any) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Bio</h2>
    <textarea value={bio} onChange={(e) => update(e.target.value.slice(0, 150))} placeholder="Tell us about yourself..." className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none resize-none focus:ring-2 focus:ring-emerald-500/20" />
    <div className="flex gap-4 pt-4 border-t border-slate-100">
      <button onClick={onBack} className="p-4 bg-slate-100 rounded-2xl"><ArrowLeft size={20} /></button>
      <button onClick={onComplete} disabled={saving} className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-2xl uppercase text-[11px] tracking-widest shadow-lg">
        {saving ? "SAVING..." : "COMPLETE SETUP"}
      </button>
    </div>
  </motion.div>
);