"use client";

import React from 'react';
import { X, Zap, Share2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const NodeFocusModal = ({ node, onClose }: any) => {
  if (!node) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-200"
        >
          {/* Accent Header */}
          <div 
            className="h-2 w-full" 
            style={{ backgroundColor: node.color || '#38bdf8' }} 
          />

          <div className="p-8 sm:p-12">
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Zap size={12} className="text-amber-500 fill-amber-500" />
                  Node Intelligence
                </div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none">
                  {node.fullData?.topic}
                </h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
              >
                <X size={24} />
              </button>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                {node.fullData?.description}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap gap-4">
               <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
                 <Download size={14} /> Export Insight
               </button>
               <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                 <Share2 size={14} /> Share Node
               </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};