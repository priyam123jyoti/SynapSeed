'use client';

import { useRouter } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '@/contexts/AuthProvider';

import AuthGuardModal from '@/components/auth/AuthGuardModal';

import TestPortal from '@/components/testHub/TestPortal';
import InstructorPanel from '@/components/testHub/InstructorPanel';
import Header from '@/components/testHub/Header';

export default function TestHubPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
      <div className="h-screen w-full bg-[#f5f4ef] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <ShieldAlert
            size={48}
            className="text-[#1a3c34] animate-pulse mb-4"
          />

          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#1a3c34]">
            Validating Core Credentials...
          </h2>

          {!loading && !user && (
            <AuthGuardModal
              isOpen={true}
              onClose={() => router.push('/')}
              title="TEST HUB ACCESS"
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f4ef] px-4 py-12">

      <Header email={user.email ?? ''} />

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">

        <TestPortal />

        <InstructorPanel />

      </div>

    </main>
  );
}