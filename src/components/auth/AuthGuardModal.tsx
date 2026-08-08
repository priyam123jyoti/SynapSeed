"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

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
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[110] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="pointer-events-auto w-full max-w-sm p-10 bg-slate-950 border border-red-500/30 rounded-[3rem] shadow-[0_0_60px_rgba(239,68,68,0.15)] relative overflow-hidden"
            >
              <div className="flex flex-col items-center text-center">
                {/* Visual Icon */}
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-8">
                  <ShieldAlert size={42} className="animate-pulse" />
                </div>

                <h3 className="text-white text-3xl font-black tracking-tighter mb-4 leading-tight uppercase">
                  Access Denied <br />
                  <span className="text-red-500">{title}</span>
                </h3>

                <p className="text-slate-400 text-sm font-medium mb-10 px-2 leading-relaxed">
                  You are not loged in, click 'Register' to log-in or sign-up
                </p>

                {/* Single Action Button */}
                <button
                  onClick={onClose}
                  className="w-full py-4 bg-red-600 hover:bg-red-500 text-white text-[11px] font-black uppercase tracking-[0.25em] rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-red-900/20"
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