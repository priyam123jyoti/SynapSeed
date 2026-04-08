"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthProvider';
import { AnimatePresence, motion } from 'framer-motion';

// Component Imports
import { IdentityStep, InterestsStep, AvatarStep, BioStep } from './onboarding/OnboardingSteps';
import { AccountCheckStep } from './AccountCheckStep';

export default function OnboardingWizard() {
  const { user }: any = useAuth();
  const router = useRouter();
  
  const [view, setView] = useState<'signup' | 'login'>('signup');
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '', 
    occupation: '', 
    institution: '', 
    isDhakuakhana: false, 
    phone: '', 
    interests: [] as string[], 
    bio: ''
  });

  const handleSwitchToLogin = () => {
    localStorage.removeItem('synapseed_buffer');
    setView('login');
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (user) {
      const checkUser = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('has_onboarded')
          .eq('id', user.id)
          .maybeSingle();
        
        if (data?.has_onboarded) router.push('/profile');
      };
      checkUser();
    }
  }, [user, router]);

  useEffect(() => {
    if (formData.username.length < 3) { 
      setUsernameStatus('idle'); 
      return; 
    }

    const timer = setTimeout(async () => {
      setUsernameStatus('checking');
      const { data } = await supabase.from('profiles')
        .select('username')
        .eq('username', formData.username.toLowerCase())
        .maybeSingle();
      
      setUsernameStatus(data ? 'taken' : 'available');
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username]);

  const handleFinalConnect = async () => {
    if (saving) return;
    setSaving(true);
    
    try {
      const getCompressedBase64 = (file: File): Promise<string> => new Promise((res, rej) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target?.result as string;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX = 400; // Slightly smaller for better storage reliability
            let width = img.width;
            let height = img.height;

            if (width > height && width > MAX) {
              height *= MAX / width;
              width = MAX;
            } else if (height > MAX) {
              width *= MAX / height;
              height = MAX;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            res(canvas.toDataURL('image/jpeg', 0.6)); 
          };
        };
        reader.onerror = e => rej(e);
      });

      let base64Avatar = avatarFile ? await getCompressedBase64(avatarFile) : null;
      
      // MAPPING FIX: Preparing the exact keys for the database
      const payload = JSON.stringify({ 
        username: formData.username.toLowerCase(),
        occupation: formData.occupation,
        institution: formData.institution,
        phone: formData.phone,
        interests: formData.interests,
        bio: formData.bio,
        // Map the boolean correctly here
        is_dhakuakhana_college_autonomous: formData.isDhakuakhana, 
        avatarBase64: base64Avatar,
        timestamp: Date.now() 
      });

      localStorage.setItem('synapseed_buffer', payload);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
          redirectTo: `${window.location.origin}/auth/callback` 
        },
      });
      
      if (error) throw error;
    } catch (err) {
      setSaving(false);
      console.error("Auth Preparation Error:", err);
      alert("Neural sync interrupted. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 min-h-[600px] flex flex-col relative">
      {view === 'signup' && (
        <div className="h-2 w-full bg-slate-100 absolute top-0 left-0 z-50">
          <motion.div 
            className="h-full bg-emerald-500" 
            initial={{ width: 0 }}
            animate={{ width: `${(step / 4) * 100}%` }} 
            transition={{ duration: 0.5, ease: "circOut" }} 
          />
        </div>
      )}

      <div className="p-10 flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {view === 'login' ? (
            <AccountCheckStep 
              key="login-view" 
              onBack={() => setView('signup')} 
            />
          ) : (
            <motion.div 
              key="signup-view"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              {step === 1 && (
                <IdentityStep 
                  data={formData} 
                  update={(fields: any) => setFormData(prev => ({ ...prev, ...fields }))} 
                  status={usernameStatus} 
                  onNext={() => setStep(2)} 
                  onSwitch={handleSwitchToLogin}
                />
              )}

              {step === 2 && (
                <InterestsStep 
                  selected={formData.interests} 
                  onToggle={(tag: string) => setFormData(prev => ({
                    ...prev, 
                    interests: prev.interests.includes(tag) 
                      ? prev.interests.filter(t => t !== tag) 
                      : [...prev.interests, tag]
                  }))} 
                  onNext={() => setStep(3)} 
                  onBack={() => setStep(1)} 
                />
              )}

              {step === 3 && (
                <AvatarStep 
                  previewUrl={previewUrl} 
                  onUpload={(file: File) => {
                    if (previewUrl) URL.revokeObjectURL(previewUrl); 
                    setAvatarFile(file); 
                    setPreviewUrl(URL.createObjectURL(file));
                  }} 
                  onNext={() => setStep(4)} 
                  onBack={() => setStep(2)} 
                />
              )}

              {step === 4 && (
                <BioStep 
                  bio={formData.bio} 
                  update={(val: string) => setFormData(prev => ({ ...prev, bio: val }))} 
                  onComplete={handleFinalConnect} 
                  onBack={() => setStep(3)} 
                  saving={saving}
                  onSwitch={handleSwitchToLogin}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}