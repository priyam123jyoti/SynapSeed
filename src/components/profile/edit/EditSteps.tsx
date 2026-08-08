"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  Camera, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Phone
} from 'lucide-react';
import { INTEREST_TAGS } from '@/lib/contants'; 

// --- HELPERS: COUNTRY DATA ---
const COUNTRIES = [
  { name: "Afghanistan", code: "+93", iso: "AF", length: 9, startsWith: [7] },
  { name: "Albania", code: "+355", iso: "AL", length: 9, startsWith: [6] },
  { name: "Algeria", code: "+213", iso: "DZ", length: 9, startsWith: [5, 6, 7] },
  { name: "Andorra", code: "+376", iso: "AD", length: 6, startsWith: [] },
  { name: "Angola", code: "+244", iso: "AO", length: 9, startsWith: [9] },
  { name: "Argentina", code: "+54", iso: "AR", length: 10, startsWith: [9] },
  { name: "Armenia", code: "+374", iso: "AM", length: 8, startsWith: [] },
  { name: "Australia", code: "+61", iso: "AU", length: 9, startsWith: [4] },
  { name: "Austria", code: "+43", iso: "AT", length: 10, startsWith: [6] },
  { name: "Azerbaijan", code: "+994", iso: "AZ", length: 9, startsWith: [5, 7] },
  { name: "Bahamas", code: "+1", iso: "BS", length: 10, startsWith: [] },
  { name: "Bahrain", code: "+973", iso: "BH", length: 8, startsWith: [3] },
  { name: "Bangladesh", code: "+880", iso: "BD", length: 10, startsWith: [1] },
  { name: "Barbados", code: "+1", iso: "BB", length: 10, startsWith: [] },
  { name: "Belarus", code: "+375", iso: "BY", length: 9, startsWith: [2, 3, 4] },
  { name: "Belgium", code: "+32", iso: "BE", length: 9, startsWith: [4] },
  { name: "Belize", code: "+501", iso: "BZ", length: 7, startsWith: [6] },
  { name: "Benin", code: "+229", iso: "BJ", length: 8, startsWith: [] },
  { name: "Bhutan", code: "+975", iso: "BT", length: 8, startsWith: [1, 7] },
  { name: "Bolivia", code: "+591", iso: "BO", length: 8, startsWith: [6, 7] },
  { name: "Bosnia and Herzegovina", code: "+387", iso: "BA", length: 8, startsWith: [6] },
  { name: "Botswana", code: "+267", iso: "BW", length: 8, startsWith: [7] },
  { name: "Brazil", code: "+55", iso: "BR", length: 11, startsWith: [9] },
  { name: "Brunei", code: "+673", iso: "BN", length: 7, startsWith: [7, 8] },
  { name: "Bulgaria", code: "+359", iso: "BG", length: 9, startsWith: [8, 9] },
  { name: "Burkina Faso", code: "+226", iso: "BF", length: 8, startsWith: [] },
  { name: "Cambodia", code: "+855", iso: "KH", length: 9, startsWith: [1, 6, 7, 8, 9] },
  { name: "Cameroon", code: "+237", iso: "CM", length: 9, startsWith: [6] },
  { name: "Canada", code: "+1", iso: "CA", length: 10, startsWith: [] },
  { name: "Chile", code: "+56", iso: "CL", length: 9, startsWith: [9] },
  { name: "China", code: "+86", iso: "CN", length: 11, startsWith: [1] },
  { name: "Colombia", code: "+57", iso: "CO", length: 10, startsWith: [3] },
  { name: "Costa Rica", code: "+506", iso: "CR", length: 8, startsWith: [5, 6, 7, 8] },
  { name: "Croatia", code: "+385", iso: "HR", length: 9, startsWith: [9] },
  { name: "Cuba", code: "+53", iso: "CU", length: 8, startsWith: [5] },
  { name: "Cyprus", code: "+357", iso: "CY", length: 8, startsWith: [9] },
  { name: "Czech Republic", code: "+420", iso: "CZ", length: 9, startsWith: [] },
  { name: "Denmark", code: "+45", iso: "DK", length: 8, startsWith: [2, 3, 4, 5, 6, 7, 8, 9] },
  { name: "Dominican Republic", code: "+1", iso: "DO", length: 10, startsWith: [] },
  { name: "Ecuador", code: "+593", iso: "EC", length: 9, startsWith: [9] },
  { name: "Egypt", code: "+20", iso: "EG", length: 10, startsWith: [1] },
  { name: "Estonia", code: "+372", iso: "EE", length: 8, startsWith: [5, 8] },
  { name: "Ethiopia", code: "+251", iso: "ET", length: 9, startsWith: [9] },
  { name: "Fiji", code: "+679", iso: "FJ", length: 7, startsWith: [7, 8, 9] },
  { name: "Finland", code: "+358", iso: "FI", length: 9, startsWith: [4, 5] },
  { name: "France", code: "+33", iso: "FR", length: 9, startsWith: [6, 7] },
  { name: "Georgia", code: "+995", iso: "GE", length: 9, startsWith: [5, 7] },
  { name: "Germany", code: "+49", iso: "DE", length: 11, startsWith: [1] },
  { name: "Ghana", code: "+233", iso: "GH", length: 9, startsWith: [2, 5] },
  { name: "Greece", code: "+30", iso: "GR", length: 10, startsWith: [6] },
  { name: "Guatemala", code: "+502", iso: "GT", length: 8, startsWith: [3, 4, 5] },
  { name: "Guyana", code: "+592", iso: "GY", length: 7, startsWith: [6] },
  { name: "Haiti", code: "+509", iso: "HT", length: 8, startsWith: [3, 4] },
  { name: "Honduras", code: "+504", iso: "HN", length: 8, startsWith: [3, 7, 8, 9] },
  { name: "Hong Kong", code: "+852", iso: "HK", length: 8, startsWith: [4, 5, 6, 7, 8, 9] },
  { name: "Hungary", code: "+36", iso: "HU", length: 9, startsWith: [2, 3, 7] },
  { name: "Iceland", code: "+354", iso: "IS", length: 7, startsWith: [6, 7, 8] },
  { name: "India", code: "+91", iso: "IN", length: 10, startsWith: [6, 7, 8, 9] },
  { name: "Indonesia", code: "+62", iso: "ID", length: 11, startsWith: [8] },
  { name: "Iran", code: "+98", iso: "IR", length: 10, startsWith: [9] },
  { name: "Iraq", code: "+964", iso: "IQ", length: 10, startsWith: [7] },
  { name: "Ireland", code: "+353", iso: "IE", length: 9, startsWith: [8] },
  { name: "Israel", code: "+972", iso: "IL", length: 9, startsWith: [5] },
  { name: "Italy", code: "+39", iso: "IT", length: 10, startsWith: [3] },
  { name: "Jamaica", code: "+1", iso: "JM", length: 10, startsWith: [] },
  { name: "Japan", code: "+81", iso: "JP", length: 10, startsWith: [7, 8, 9] },
  { name: "Jordan", code: "+962", iso: "JO", length: 9, startsWith: [7] },
  { name: "Kazakhstan", code: "+7", iso: "KZ", length: 10, startsWith: [7] },
  { name: "Kenya", code: "+254", iso: "KE", length: 9, startsWith: [7, 1] },
  { name: "Kuwait", code: "+965", iso: "KW", length: 8, startsWith: [5, 6, 9] },
  { name: "Kyrgyzstan", code: "+996", iso: "KG", length: 9, startsWith: [5, 7] },
  { name: "Laos", code: "+856", iso: "LA", length: 10, startsWith: [2] },
  { name: "Latvia", code: "+371", iso: "LV", length: 8, startsWith: [2] },
  { name: "Lebanon", code: "+961", iso: "LB", length: 8, startsWith: [3, 7, 8] },
  { name: "Libya", code: "+218", iso: "LY", length: 9, startsWith: [9] },
  { name: "Lithuania", code: "+370", iso: "LT", length: 8, startsWith: [6] },
  { name: "Luxembourg", code: "+352", iso: "LU", length: 9, startsWith: [6] },
  { name: "Malaysia", code: "+60", iso: "MY", length: 10, startsWith: [1] },
  { name: "Maldives", code: "+960", iso: "MV", length: 7, startsWith: [7, 9] },
  { name: "Malta", code: "+356", iso: "MT", length: 8, startsWith: [7, 9] },
  { name: "Mexico", code: "+52", iso: "MX", length: 10, startsWith: [] },
  { name: "Moldova", code: "+373", iso: "MD", length: 8, startsWith: [6, 7] },
  { name: "Monaco", code: "+377", iso: "MC", length: 8, startsWith: [6] },
  { name: "Mongolia", code: "+976", iso: "MN", length: 8, startsWith: [8, 9] },
  { name: "Montenegro", code: "+382", iso: "ME", length: 8, startsWith: [6] },
  { name: "Morocco", code: "+212", iso: "MA", length: 9, startsWith: [6, 7] },
  { name: "Nepal", code: "+977", iso: "NP", length: 10, startsWith: [9] },
  { name: "Netherlands", code: "+31", iso: "NL", length: 9, startsWith: [6] },
  { name: "New Zealand", code: "+64", iso: "NZ", length: 9, startsWith: [2] },
  { name: "Nigeria", code: "+234", iso: "NG", length: 10, startsWith: [7, 8, 9] },
  { name: "Norway", code: "+47", iso: "NO", length: 8, startsWith: [4, 9] },
  { name: "Oman", code: "+968", iso: "OM", length: 8, startsWith: [9, 7] },
  { name: "Pakistan", code: "+92", iso: "PK", length: 10, startsWith: [3] },
  { name: "Panama", code: "+507", iso: "PA", length: 8, startsWith: [6] },
  { name: "Paraguay", code: "+595", iso: "PY", length: 9, startsWith: [9] },
  { name: "Peru", code: "+51", iso: "PE", length: 9, startsWith: [9] },
  { name: "Philippines", code: "+63", iso: "PH", length: 10, startsWith: [9] },
  { name: "Poland", code: "+48", iso: "PL", length: 9, startsWith: [4, 5, 6, 7, 8] },
  { name: "Portugal", code: "+351", iso: "PT", length: 9, startsWith: [9] },
  { name: "Qatar", code: "+974", iso: "QA", length: 8, startsWith: [3, 5, 6, 7] }
].sort((a, b) => a.name.localeCompare(b.name));

// --- STEP 1: IDENTITY & SECURITY ---
export const IdentityStep = ({ data, update, status, onNext }: any) => {
  const [phoneValidity, setPhoneValidity] = useState(false);
  const [phoneMsg, setPhoneMsg] = useState({ text: 'Required for account security', isError: false });

  const isInstitutionMissing = ['Student', 'Teacher'].includes(data.occupation) && !data.institution.trim();
  
  // Validation Logic
  const isNextDisabled = 
    status === 'taken' || 
    status === 'checking' || 
    data.username.length < 3 || 
    !data.occupation ||
    !phoneValidity ||
    isInstitutionMissing;

  const handlePhoneChange = (val: string, country: any) => {
    const cleanNum = val.replace(/\D/g, '');
    const fullNum = `${country.code}${cleanNum}`;
    
    // Internal Validation
    if (!cleanNum) {
      setPhoneValidity(false);
      setPhoneMsg({ text: 'Phone number is required', isError: false });
    } else if (country.iso === 'IN' && (cleanNum.length !== 10 || !country.startsWith.includes(parseInt(cleanNum[0])))) {
      setPhoneValidity(false);
      setPhoneMsg({ text: 'Invalid Indian number format', isError: true });
    } else if (cleanNum.length < 7) {
      setPhoneValidity(false);
      setPhoneMsg({ text: 'Number too short', isError: true });
    } else {
      setPhoneValidity(true);
      setPhoneMsg({ text: `Verified ${country.name} format`, isError: false });
    }

    update({ phone: fullNum });
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Identity</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Establish your neural credentials</p>
      </div>
      
      {/* 1. USERNAME */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Username</label>
        <div className="relative">
          <input 
            type="text" 
            value={data.username} 
            onChange={(e) => update({ username: e.target.value.toLowerCase().replace(/\s+/g, '') })} 
            placeholder="alias_node" 
            className={`w-full p-4 pr-12 bg-slate-50 border rounded-2xl outline-none font-bold text-slate-700 transition-all ${status === 'taken' ? 'border-red-200' : 'focus:border-slate-900'}`}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {status === 'checking' && <Loader2 className="animate-spin text-slate-300" size={18} />}
            {status === 'available' && <CheckCircle2 className="text-emerald-500" size={18} />}
            {status === 'taken' && <XCircle className="text-red-500" size={18} />}
          </div>
        </div>
      </div>

      {/* 2. PHONE NUMBER (INTEGRATED) */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Contact</label>
        <div className="flex gap-2">
          <select 
            className="p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-xs font-black w-24"
            onChange={(e) => handlePhoneChange(data.phone.split(e.target.value)[1] || '', COUNTRIES[parseInt(e.target.value)])}
          >
            {COUNTRIES.map((c, i) => (
              <option key={c.iso} value={i}>{c.iso} {c.code}</option>
            ))}
          </select>
          <input 
            type="tel" 
            placeholder="00000 00000"
            onChange={(e) => {
                const country = COUNTRIES.find(c => data.phone.startsWith(c.code)) || COUNTRIES[0];
                handlePhoneChange(e.target.value, country);
            }}
            className={`flex-1 p-4 bg-slate-50 border rounded-2xl outline-none font-bold transition-all ${phoneMsg.isError ? 'border-red-200' : 'focus:border-slate-900'}`}
          />
        </div>
        <p className={`text-[9px] font-black uppercase tracking-tighter ${phoneMsg.isError ? 'text-red-500' : 'text-slate-400'}`}>
          {phoneMsg.text}
        </p>
      </div>

      {/* 3. OCCUPATION & INSTITUTION */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Role</label>
          <select 
            value={data.occupation} 
            onChange={(e) => update({ occupation: e.target.value })} 
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-700"
          >
            <option value="" disabled>Select Role...</option>
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
            <option value="Developer">Developer</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {['Student', 'Teacher'].includes(data.occupation) && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
            <input 
              type="text" 
              value={data.institution} 
              onChange={(e) => update({ institution: e.target.value })} 
              placeholder="Institution Name" 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium" 
            />
            <label className="flex items-center gap-3 p-4 bg-emerald-50/30 border border-emerald-100 rounded-2xl cursor-pointer">
              <input 
                type="checkbox" 
                checked={data.isDhakuakhana}
                onChange={(e) => update({ isDhakuakhana: e.target.checked })}
                className="w-5 h-5 accent-emerald-600"
              />
              <span className="text-[10px] font-black uppercase text-emerald-800">Dhakuakhana College Node</span>
            </label>
          </motion.div>
        )}
      </div>

      <button 
        disabled={isNextDisabled} 
        onClick={onNext} 
        className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl uppercase text-[11px] tracking-widest hover:bg-emerald-600 disabled:opacity-20 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200"
      >
        Synchronize Data <ArrowRight size={16} />
      </button>
    </motion.div>
  );
};

// --- STEP 2: INTERESTS ---
export const InterestsStep = ({ selected, onToggle, onNext, onBack }: any) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 flex flex-col h-full">
    <div className="space-y-2">
      <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Interests</h2>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tag your technical specializations</p>
    </div>
    <div className="flex-1 overflow-y-auto flex flex-wrap gap-2 py-4 custom-scrollbar">
      {INTEREST_TAGS.map((tag: string) => (
        <button 
          key={tag} 
          onClick={() => onToggle(tag)} 
          className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${selected.includes(tag) ? 'bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-100' : 'bg-white text-slate-400 border-slate-200 hover:border-emerald-400'}`}
        >
          {tag}
        </button>
      ))}
    </div>
    <div className="flex gap-4 pt-4 border-t border-slate-100">
      <button onClick={onBack} className="p-4 bg-slate-100 text-slate-400 rounded-2xl hover:bg-slate-200"><ArrowLeft size={20} /></button>
      <button onClick={onNext} className="flex-1 py-4 bg-slate-900 text-white font-black rounded-2xl uppercase text-[11px] tracking-widest">Continue</button>
    </div>
  </motion.div>
);

// --- STEP 3: AVATAR ---
export const AvatarStep = ({ onUpload, previewUrl, onNext, onBack }: any) => {
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 text-center">
      <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Visual ID</h2>
      <div onClick={() => fileRef.current?.click()} className="w-48 h-48 mx-auto rounded-full bg-slate-50 border-4 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all relative group overflow-hidden shadow-inner">
        {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" /> : <Camera size={40} className="text-slate-300" />}
        <input type="file" hidden ref={fileRef} onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
      </div>
      <div className="flex gap-4">
        <button onClick={onBack} className="p-4 bg-slate-100 text-slate-400 rounded-2xl"><ArrowLeft size={20} /></button>
        <button onClick={onNext} className="flex-1 py-4 bg-slate-900 text-white font-black rounded-2xl uppercase text-[11px] tracking-widest">Confirm ID</button>
      </div>
    </motion.div>
  );
};

// --- STEP 4: BIO ---
export const BioStep = ({ bio, update, onComplete, onBack, saving }: any) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Bio Archive</h2>
    <textarea 
      value={bio} 
      onChange={(e) => update(e.target.value.slice(0, 150))} 
      className="w-full h-40 p-6 bg-slate-50 border border-slate-200 rounded-[30px] outline-none font-medium text-slate-700 focus:ring-4 focus:ring-emerald-500/5 transition-all" 
      placeholder="Briefly state your mission..."
    />
    <div className="flex gap-4">
      <button onClick={onBack} className="p-4 bg-slate-100 text-slate-400 rounded-2xl"><ArrowLeft size={20} /></button>
      <button onClick={onComplete} disabled={saving} className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-2xl uppercase text-[11px] tracking-widest shadow-xl shadow-emerald-100">
        {saving ? "Finalizing Link..." : "Initialize Profile"}
      </button>
    </div>
  </motion.div>
);