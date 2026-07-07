'use client';

import { useEffect, useState } from 'react';
import { ShieldAlert, Loader2, Lock, EyeOff } from 'lucide-react';

interface ViewPayload {
  signedUrl: string;
  identity: string;
}

export default function SecurePaperViewerPage({ params }: { params: { paperId: string } }) {
  const [data, setData] = useState<ViewPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSecureAsset() {
      try {
        const res = await fetch(`/api/papers/${params.paperId}`);
        const json = await res.json();
        
        if (!res.ok) throw new Error(json.error || 'Failed loading asset.');
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSecureAsset();
  }, [params.paperId]);

  // Context Menu Blockers
  useEffect(() => {
    const blockContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', blockContextMenu);
    return () => document.removeEventListener('contextmenu', blockContextMenu);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white gap-2 font-bold text-xs uppercase tracking-widest">
        <Loader2 className="animate-spin text-emerald-400" size={24} /> Validating Cryptographic Keys...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-4 p-4 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shadow-lg shadow-rose-950/20">
          <Lock size={28} />
        </div>
        <div className="space-y-1">
          <h2 className="text-white font-black uppercase text-sm tracking-widest">Access Protocol Rejected</h2>
          <p className="text-xs max-w-sm leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 py-8 px-4 flex flex-col items-center justify-start select-none">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-slate-400 font-bold text-[11px] uppercase tracking-wider mb-4">
        <span className="flex items-center gap-1.5 text-emerald-400"><ShieldAlert size={14} /> Encrypted Digital Vault Stream</span>
        <span>Identity: {data?.identity}</span>
      </div>

      {/* Main Structural Vault Viewer Canvas Wrap Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl border border-slate-800 shadow-2xl overflow-hidden group select-none">
        
        {/* Anti-Drag Transparent Shell Interceptor Blocker Shield Layer */}
        <div 
          className="absolute inset-0 z-40 bg-transparent cursor-default" 
          onContextMenu={(e) => e.preventDefault()}
        />

        {/* Dynamic Forensic Identifiers Watermark Layout Array Engine */}
        <div className="absolute inset-0 z-30 pointer-events-none opacity-[0.04] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-24 gap-x-12 overflow-hidden py-12 p-2">
          {Array.from({ length: 48 }).map((_, idx) => (
            <div 
              key={idx} 
              className="text-slate-900 font-black text-xs select-none pointer-events-none transform -rotate-45 whitespace-nowrap tracking-wider text-center"
            >
              {data?.identity}
            </div>
          ))}
        </div>

        {/* Real Source Embedded Display Layer Object element rendering path */}
        {data?.signedUrl.includes('.pdf') ? (
          <iframe 
            src={`${data.signedUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
            className="w-full h-[80vh] border-0 pointer-events-none relative z-10"
          />
        ) : (
          <img 
            src={data?.signedUrl} 
            alt="Secure Question Paper Layout Stream" 
            className="w-full h-auto pointer-events-none relative z-10 filter contrast-[1.02]"
            draggable={false}
          />
        )}
      </div>

      {/* Bottom Browser Defense Enforcement Layout CSS rules overlay indicator */}
      <style jsx global>{`
        body {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
        }
        @media print {
          body { display: none !important; }
        }
      `}</style>
    </main>
  );
}