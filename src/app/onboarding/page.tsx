"use client";

import OnboardingWizard from '@/components/auth/OnboardingWizard';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <OnboardingWizard />
    </div>
  );
}