import React from 'react'
import { Download, BookOpen, Crown } from 'lucide-react'

// Defining a clear interface for the user prop
interface RightPanelProps {
  user?: any; // Marked as optional since we might bypass auth
}

export default function RightPanel({ user }: RightPanelProps) {
  return (
    <div className="h-full">
      {/* Container: Deep Midnight Green with subtle border glow */}
      <div className="flex-1 h-full bg-[#050a0a] p-8 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-emerald-500/10 flex flex-col justify-between relative overflow-hidden rounded-[1rem]">
        
        {/* Subtle Background Glow Decoration */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 blur-[80px]" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-[1px] w-8 bg-emerald-500/50" />
            <h2 className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em]">
              Specimen Analysis
            </h2>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tighter leading-tight mb-4">
            Chloroplast <span className="text-emerald-500/80 underline decoration-emerald-500/20 underline-offset-8">Ultra</span> Structure
          </h1>
          
          <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-2xl mb-6">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <BookOpen size={16} className="text-emerald-400" />
            </div>
            <p className="text-[11px] text-emerald-100/70 leading-relaxed font-medium italic">
              Use annotations to explore the Thylakoid Lumen and Stroma architecture.
            </p>
          </div>
        </div>

        <div className="space-y-6 relative z-10">
          {/* Pro Tip with Premium Badge */}
          <div className="bg-slate-900/50 backdrop-blur-md p-5 rounded-[2rem] border border-white/5 group hover:border-emerald-500/30 transition-all duration-500">
            <div className="flex items-center gap-2 mb-2">
              <Crown size={12} className="text-amber-400" />
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">GATE/NET Essential</p>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Focus on <span className="text-white font-bold underline decoration-emerald-500">Photophosphorylation</span> sites within the Granum for Part B questions.
            </p>
          </div>

          {/* Premium Action Button */}
          <button className="group relative w-full overflow-hidden rounded-2xl transition-all active:scale-95 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 group-hover:from-emerald-500 group-hover:to-teal-400 transition-all" />
              <div className="relative py-4 flex items-center justify-center gap-3">
                <Download size={18} className="text-emerald-950 group-hover:animate-bounce" />
                <span className="text-emerald-950 font-black text-xs tracking-widest">
                  DOWNLOAD MODULE
                </span>
              </div>
          </button>
        </div>
      </div>
    </div>
  )
}