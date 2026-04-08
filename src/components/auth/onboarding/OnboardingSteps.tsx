"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Camera, CheckCircle2, XCircle } from 'lucide-react';
import { INTEREST_TAGS } from '@/lib/contants'; 
import PhoneInput from './PhoneInput';

// --- STEP 1: IDENTITY ---
export const IdentityStep = ({ data, update, status, onNext, onSwitch }: any) => {
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  // Mandatory: If Student or Teacher, institution cannot be empty
  const isInstitutionMissing = ['Student', 'Teacher'].includes(data.occupation) && !data.institution.trim();

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }} 
      className="space-y-6"
    >
      <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Identity Setup</h2>
      
      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Username</label>
        <div className="relative">
          <input 
            type="text" 
            value={data.username} 
            onChange={(e) => update({ username: e.target.value.replace(/\s+/g, '') })}
            className={`w-full p-4 bg-slate-50 border rounded-2xl outline-none transition-all ${status === 'taken' ? 'border-red-300' : 'border-slate-200 focus:ring-2 focus:ring-emerald-500/20'}`}
          />
          <div className="absolute right-4 top-4">
            {status === 'checking' && <span className="text-slate-400 text-sm animate-pulse">...</span>}
            {status === 'available' && <CheckCircle2 className="text-emerald-500" />}
            {status === 'taken' && <XCircle className="text-red-500" />}
          </div>
        </div>
      </div>

      <PhoneInput 
        onChange={(val: string) => update({ phone: val })} 
        onValidityChange={setIsPhoneValid} 
      />

      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Occupation</label>
        <select 
          value={data.occupation} 
          onChange={(e) => update({ occupation: e.target.value })} 
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold"
        >
          <option value="">Select path...</option>
          <option value="Student">Student</option>
          <option value="Teacher">Teacher / Professor</option>
          <option value="Self Learner">Self Learner</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {['Student', 'Teacher'].includes(data.occupation) && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
          <input 
            type="text" 
            value={data.institution} 
            onChange={(e) => update({ institution: e.target.value })} 
            placeholder="Institution Name (Required)" 
            className={`w-full p-4 bg-slate-50 border rounded-2xl outline-none transition-all ${!data.institution.trim() ? 'border-amber-300' : 'border-slate-200'}`} 
          />
          <label className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl cursor-pointer">
            <input 
              type="checkbox" 
              checked={data.isDhakuakhana} 
              onChange={(e) => update({ isDhakuakhana: e.target.checked })} 
              className="w-5 h-5 accent-emerald-600 rounded" 
            />
            <span className="text-sm font-bold text-emerald-900 uppercase">Dhakuakhana College Affiliate?</span>
          </label>
        </motion.div>
      )}

      <button 
        disabled={status !== 'available' || !data.occupation || !isPhoneValid || isInstitutionMissing} 
        onClick={onNext} 
        className="w-full mt-6 py-4 bg-slate-900 text-white font-black rounded-2xl uppercase text-[11px] tracking-widest hover:bg-emerald-600 disabled:opacity-20 transition-all flex items-center justify-center gap-2"
      >
        Continue <ArrowRight size={16} />
      </button>

      {/* VERIFICATION GATEWAY TOGGLE */}
      <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col items-center gap-2">
        <p className="text-[20px] font-bold text-black-400 uppercase tracking-widest">Already Have an Account?</p>
        <button 
          type="button"
          onClick={onSwitch}
          className="text-[25px] font-black text-red-400 uppercase tracking-widest hover:underline transition-all"
        >
          Verify Email & Sign In
        </button>
      </div>
    </motion.div>
  );
};

// --- STEP 2: INTERESTS ---
export const InterestsStep = ({ selected, onToggle, onNext, onBack }: any) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 flex flex-col">
    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Interests</h2>
    <div className="flex-1 overflow-y-auto pr-2 flex flex-wrap gap-2 max-h-[350px]">
      {INTEREST_TAGS.map((tag: string) => (
        <button 
          key={tag} 
          onClick={() => onToggle(tag)} 
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${selected.includes(tag) ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'}`}
        >
          {tag}
        </button>
      ))}
    </div>
    <div className="flex gap-4 pt-4 border-t border-slate-100">
      <button onClick={onBack} className="p-4 bg-slate-100 rounded-2xl text-slate-600 hover:bg-slate-200 transition-colors">
        <ArrowLeft size={20} />
      </button>
      <button 
        disabled={selected.length === 0} 
        onClick={onNext} 
        className="flex-1 py-4 bg-slate-900 text-white font-black rounded-2xl uppercase text-[11px] tracking-widest hover:bg-emerald-600 disabled:opacity-50 transition-all"
      >
        Continue
      </button>
    </div>
  </motion.div>
);

// --- STEP 3: AVATAR ---
export const AvatarStep = ({ onUpload, previewUrl, onNext, onBack }: any) => {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 text-center">
      <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Profile Photo</h2>
      
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileRef} 
        onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} 
      />

      <div 
        onClick={() => fileRef.current?.click()}
        className="w-40 h-40 mx-auto my-8 rounded-[40px] bg-slate-50 border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all group overflow-hidden relative"
      >
        {previewUrl ? (
          <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
        ) : (
          <>
            <Camera size={32} className="group-hover:scale-110 transition-transform mb-2" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Choose Image</span>
          </>
        )}
      </div>

      <div className="flex gap-4 pt-8">
        <button onClick={onBack} className="p-4 bg-slate-100 rounded-2xl text-slate-600 hover:bg-slate-200 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <button onClick={onNext} className="flex-1 py-4 bg-slate-900 text-white font-black rounded-2xl uppercase text-[11px] tracking-widest hover:bg-emerald-600 transition-all">
          {previewUrl ? "Continue" : "Skip for now"}
        </button>
      </div>
    </motion.div>
  );
};

// --- STEP 4: BIO ---
export const BioStep = ({ bio, update, onComplete, onBack, saving }: any) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Bio & Secure</h2>
    
    <div>
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Short Bio</label>
      <textarea 
        value={bio} 
        onChange={(e) => update(e.target.value.slice(0, 700))} 
        placeholder="Tell us about your journey..." 
        className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none resize-none focus:ring-2 focus:ring-emerald-500/20 font-medium transition-all" 
      />
      <p className="text-right text-[10px] font-bold text-slate-400 mt-1">{bio.length}/700</p>
    </div>

    <div className="flex gap-4 pt-4 border-t border-slate-100">
      <button onClick={onBack} className="p-4 bg-slate-100 rounded-2xl text-slate-600 hover:bg-slate-200 transition-colors">
        <ArrowLeft size={20} />
      </button>
      <button 
        onClick={onComplete} 
        disabled={saving} 
        className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-2xl uppercase text-[11px] tracking-widest shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 hover:bg-emerald-700 disabled:opacity-50 transition-all"
      >
        {saving ? "PREPARING PROFILE..." : "CONTINUE WITH GOOGLE"}
      </button>
    </div>
  </motion.div>
);