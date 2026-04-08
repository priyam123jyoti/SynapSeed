"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthProvider';
import { AnimatePresence, motion } from 'framer-motion';

// Sub-components
import { IdentityStep, InterestsStep, AvatarStep, BioStep } from './onboarding/OnboardingSteps';

export default function OnboardingWizard() {
  const { user }: any = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  const [formData, setFormData] = useState({
    username: '',
    occupation: '',
    institution: '',
    isDhakuakhana: false,
    phone: '',
    interests: [] as string[],
    bio: ''
  });

  const updateForm = (fields: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  // Auth/Onboarding Check
  useEffect(() => {
    const checkAccess = async () => {
      if (!user) return;
      const { data } = await supabase.from('profiles').select('has_onboarded').eq('id', user.id).single();
      if (data?.has_onboarded) router.push('/profile');
      else setLoading(false);
    };
    checkAccess();
  }, [user, router]);

  // Username Check
  useEffect(() => {
    if (formData.username.length < 3) return setUsernameStatus('idle');
    const timer = setTimeout(async () => {
      setUsernameStatus('checking');
      const { data } = await supabase.from('profiles').select('username').eq('username', formData.username.toLowerCase()).single();
      setUsernameStatus(data ? 'taken' : 'available');
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.username]);

  const handleComplete = async () => {
    setSaving(true);
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      username: formData.username.toLowerCase(),
      occupation: formData.occupation,
      institution: formData.institution,
      is_dhakuakhana: formData.isDhakuakhana,
      interests: formData.interests,
      bio: formData.bio,
      has_onboarded: true,
      updated_at: new Date()
    });
    
    if (!error) router.push('/profile');
    else { alert("Sync Error"); setSaving(false); }
  };

  if (loading) return <div className="text-emerald-800 font-bold animate-pulse font-mono">LINKING NEURAL INTERFACE...</div>;

  return (
    <div className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 min-h-[600px] flex flex-col relative">
      <div className="h-2 w-full bg-slate-100 absolute top-0 left-0">
        <motion.div className="h-full bg-emerald-500" animate={{ width: `${(step / 4) * 100}%` }} />
      </div>

      <div className="p-10 flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {step === 1 && <IdentityStep data={formData} update={updateForm} status={usernameStatus} onNext={() => setStep(2)} />}
          {step === 2 && (
            <InterestsStep 
              selected={formData.interests} 
              onToggle={(tag: string) => updateForm({ interests: formData.interests.includes(tag) ? formData.interests.filter(t => t !== tag) : [...formData.interests, tag] })} 
              onNext={() => setStep(3)} 
              onBack={() => setStep(1)} 
            />
          )}
          {step === 3 && <AvatarStep onNext={() => setStep(4)} onBack={() => setStep(2)} />}
          {step === 4 && <BioStep bio={formData.bio} update={(val: string) => updateForm({ bio: val })} onComplete={handleComplete} onBack={() => setStep(3)} saving={saving} />}
        </AnimatePresence>
      </div>
    </div>
  );
}