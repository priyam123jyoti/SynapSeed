//src/app/admin/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { Loader2, Lock } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if they already have a valid session cookie on mount
  useEffect(() => {
    // Quick client check or ping an auth status route if preferred, 
    // here we let the user log in if the cookie isn't driving a state change.
    setIsAuthenticated(false); 
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Authorization failed');
      }

      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setChecking(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
      </div>
    );
  }

  // If not authenticated, render the Secure Gate Screen instead of the admin pages
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
            <Lock className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">Instructor Access</h1>
          <p className="text-sm text-slate-500 mb-6">
            Enter your system passcode to manage evaluations and build assessments.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter Departmental Passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                required
              />
            </div>
            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
            <button
              type="submit"
              disabled={checking}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 disabled:bg-slate-400 flex items-center justify-center gap-2"
            >
              {checking && <Loader2 className="w-4 h-4 animate-spin" />}
              Verify Credentials
            </button>
          </form>
        </div>
      </div>
    );
  }

  // If authenticated, seamlessly pass through to the create page or any other admin sub-route
  return <>{children}</>;
}