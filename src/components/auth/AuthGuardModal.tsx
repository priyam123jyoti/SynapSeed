"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2, X } from 'lucide-react';

interface AuthGuardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function AuthGuardModal({ isOpen, onClose, title = "MOANA AI" }: AuthGuardModalProps) {
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
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[110] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="pointer-events-auto w-full max-w-sm p-8 bg-slate-950 border-2 border-red-500/50 rounded-[2.5rem] shadow-[0_0_50px_rgba(239,68,68,0.2)] relative overflow-hidden"
            >
              {/* Decorative Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/20 blur-[80px] rounded-full" />
              
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

                <div className="flex items-center gap-2 mb-2">
                   <div className="h-1 w-8 bg-red-500 rounded-full" />
                   <span className="text-red-500 text-[10px] font-black uppercase tracking-[0.3em]">Security Alert</span>
                   <div className="h-1 w-8 bg-red-500 rounded-full" />
                </div>

                <h3 className="text-white text-3xl font-black tracking-tighter mb-4 leading-tight">
                  LOGIN TO USE <br />
                  <span className="text-red-500 uppercase">{title}</span>
                </h3>

                <p className="text-slate-400 text-sm font-medium mb-8 px-4">
                  This research module requires an active neural link. Please sign in with your Google account to proceed.
                </p>

                <button
                  onClick={onClose}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-red-900/40 active:scale-95 cursor-pointer"
                >
                  <CheckCircle2 size={16} />
                  Acknowledge
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}