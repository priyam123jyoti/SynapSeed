"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, LogIn, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AuthGuardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function AuthGuardModal({ isOpen, onClose, title = "MOANA AI" }: AuthGuardModalProps) {
  
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/onboarding`,
      },
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[110] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="pointer-events-auto w-full max-w-sm p-8 bg-slate-950 border-2 border-red-500/50 rounded-[2.5rem] shadow-[0_0_50px_rgba(239,68,68,0.2)] relative overflow-hidden"
            >
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="bg-red-500/10 p-4 rounded-2xl text-red-500 mb-6">
                  <ShieldAlert size={40} className="animate-pulse" />
                </div>

                <h3 className="text-white text-3xl font-black tracking-tighter mb-4 leading-tight">
                  ACCESS DENIED <br />
                  <span className="text-red-500 uppercase">{title}</span>
                </h3>

                <p className="text-slate-400 text-sm font-medium mb-8 px-4">
                  This module requires an active neural link. Please sign in to verify your identity.
                </p>

                <button
                  onClick={handleLogin}
                  className="w-full py-4 bg-white text-black text-xs font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-2 group hover:bg-red-500 hover:text-white active:scale-95 cursor-pointer shadow-xl"
                >
                  <LogIn size={16} />
                  Authorize via Google
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}