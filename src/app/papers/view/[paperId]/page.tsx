'use client';

import { useEffect, useState } from 'react';
import { ShieldAlert, Loader2, Lock } from 'lucide-react';

export default function SecurePaperViewerPage({
  params,
}: {
  params: { paperId: string };
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAccess() {
      try {
        const res = await fetch(`/api/papers/${params.paperId}`, {
          method: 'HEAD',
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Unable to verify access.');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, [params.paperId]);

  useEffect(() => {
    const blockContextMenu = (e: MouseEvent) => e.preventDefault();

    const blockShortcuts = (e: KeyboardEvent) => {
      if (
        ((e.ctrlKey || e.metaKey) &&
          ['p', 's', 'u'].includes(e.key.toLowerCase())) ||
        ((e.ctrlKey || e.metaKey) &&
          e.shiftKey &&
          ['i', 'j', 'c'].includes(e.key.toLowerCase())) ||
        e.key === 'F12'
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', blockContextMenu);
    document.addEventListener('keydown', blockShortcuts);

    return () => {
      document.removeEventListener('contextmenu', blockContextMenu);
      document.removeEventListener('keydown', blockShortcuts);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-white">
          <Loader2 className="animate-spin text-emerald-400" size={30} />
          <span className="text-xs font-bold uppercase tracking-widest">
            Validating Access...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <Lock className="text-red-500" />
          </div>

          <h2 className="text-white font-bold text-xl mb-2">
            Access Denied
          </h2>

          <p className="text-slate-400">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6">

      <div className="max-w-6xl mx-auto mb-4">

        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 flex items-center gap-3">

          <ShieldAlert
            className="text-emerald-400"
            size={18}
          />

          <span className="text-slate-300 font-semibold">
            Protected Viewer
          </span>

        </div>

      </div>

      <div className="max-w-6xl mx-auto rounded-xl overflow-hidden border border-slate-800 bg-white h-[85vh]">

        <iframe
          src={`/api/papers/${params.paperId}`}
          className="w-full h-full border-0"
          title="Secure Paper Viewer"
        />

      </div>

      <style jsx global>{`
        body {
          user-select: none;
          -webkit-user-select: none;
        }

        @media print {
          body {
            display: none !important;
          }
        }
      `}</style>

    </main>
  );
}