"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LogIn, ArrowLeft, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AccountCheckStepProps {
  onBack: () => void;
}

export const AccountCheckStep = ({ onBack }: AccountCheckStepProps) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'searching' | 'found' | 'not_found'>('idle');

  const handleCheck = async () => {
    // Only search if it looks like a real email to save database "brain power"
    if (!email || !email.includes('@')) return;
    
    setStatus('searching');
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .ilike('email', email.trim()) 
        .maybeSingle();

      if (error) throw error;

      // If data exists, the user is a "Returning Legend"
      if (data && data.email) {
        setStatus('found');
      } else {
        setStatus('not_found');
      }
    } catch (err) {
      console.error("Neural Verification Failed:", err);
      setStatus('not_found');
    }
  };

  const handleQuickLogin = async () => {
    /**
     * CRITICAL LOGIC: 
     * We only clear the buffer HERE. 
     * This ensures that if the user hits "Back" before logging in, 
     * their signup progress is still safe in the browser memory.
     */
    localStorage.removeItem('synapseed_buffer');

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) console.error("Login Error:", error.message);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.95 }} 
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Link Neural Account</h2>
        <p className="text-slate-500 text-sm font-medium">Verify your email to skip the setup phase.</p>
      </div>

      <div className="relative group">
        <input 
          type="email" 
          value={email}
          // Deep UI touch: Pressing Enter triggers the check
          onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
          onChange={(e) => { 
            setEmail(e.target.value); 
            if (status !== 'idle') setStatus('idle'); 
          }}
          placeholder="Enter registered email"
          className={`w-full p-5 bg-slate-50 border-2 rounded-[24px] outline-none transition-all font-bold tracking-tight ${
            status === 'not_found' 
              ? 'border-red-200 bg-red-50 text-red-900' 
              : 'border-slate-100 focus:border-emerald-500 focus:bg-white focus:shadow-xl focus:shadow-emerald-100/50'
          }`}
        />
        <button 
          onClick={handleCheck}
          disabled={status === 'searching' || !email.includes('@')}
          className="absolute right-3 top-3 p-3 bg-slate-900 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-20 transition-all shadow-lg active:scale-95 group"
        >
          {status === 'searching' ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Search size={20} className="group-hover:rotate-12 transition-transform" />
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {status === 'not_found' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600"
          >
            <ShieldAlert size={20} className="shrink-0" />
            <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
              Neural signature not found. Please check the email or sign up.
            </p>
          </motion.div>
        )}

        {status === 'found' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <button 
              onClick={handleQuickLogin}
              className="w-full py-5 bg-emerald-600 text-white font-black rounded-[24px] uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-emerald-200 flex items-center justify-center gap-3 active:scale-95 hover:bg-emerald-700 hover:shadow-emerald-300 transition-all"
            >
              <LogIn size={18} /> Continue to Profile
            </button>
            <div className="flex items-center justify-center gap-2 text-emerald-600">
              <CheckCircle2 size={14} className="animate-bounce" />
              <span className="text-[10px] font-black uppercase tracking-widest">Account Verified</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={onBack}
        className="w-full py-2 text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mt-4 group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Setup
      </button>
    </motion.div>
  );
};