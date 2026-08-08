"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthProvider';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';

import { IdentityStep, InterestsStep, AvatarStep, BioStep } from '@/components/profile/edit/EditSteps';

export default function EditProfilePage() {
  const { user }: any = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState('');

  const [formData, setFormData] = useState({
    username: '', 
    occupation: '', 
    institution: '', 
    isDhakuakhana: false, // React Name
    phone: '', 
    interests: [] as string[], 
    bio: ''
  });

  // 1. Fetch current data with correct Mapping
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      // Using maybeSingle() to avoid crashes if profile isn't found
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      
      if (data) {
        setFormData({
          username: data.username,
          occupation: data.occupation || '',
          institution: data.institution || '',
          // BRIDGE: Mapping DB name to React name
          isDhakuakhana: data.is_dhakuakhana_college_autonomous || false, 
          phone: data.phone || '',
          interests: data.interests || [],
          bio: data.bio || ''
        });
        setCurrentUsername(data.username);
        setPreviewUrl(data.avatar_url);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const updateForm = (fields: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  // 2. Final Sync Function
  const handleUpdate = async () => {
    if (saving) return;
    setSaving(true);
    
    try {
      let finalAvatarUrl = previewUrl;

      // Only upload if a NEW file was picked (prevents corrupting existing URL)
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, avatarFile);
        
        if (!uploadError) {
          const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
          finalAvatarUrl = data.publicUrl;
        }
      }

      // Update Database with correct column names
      const { error: dbError } = await supabase.from('profiles').update({
        username: formData.username.toLowerCase(),
        phone: formData.phone,
        occupation: formData.occupation,
        institution: formData.institution,
        // BRIDGE: Mapping React name back to DB name
        is_dhakuakhana_college_autonomous: formData.isDhakuakhana, 
        interests: formData.interests,
        bio: formData.bio,
        avatar_url: finalAvatarUrl,
        updated_at: new Date()
      }).eq('id', user.id);

      if (dbError) throw dbError;
      router.push('/profile');
    } catch (err) {
      console.error("Neural Link Update Failed:", err);
      alert("Update failed. Please check your connection.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-emerald-500" size={32} />
      <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Accessing Neural Data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 min-h-[600px] flex flex-col relative">
        <div className="h-2 w-full bg-slate-100 absolute top-0 left-0">
          <motion.div 
            className="h-full bg-emerald-500" 
            initial={{ width: 0 }}
            animate={{ width: `${(step / 4) * 100}%` }} 
          />
        </div>

        <button onClick={() => router.back()} className="absolute top-8 left-8 p-3 bg-white shadow-sm border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-all active:scale-90 z-10">
          <ArrowLeft size={18} />
        </button>

        <div className="p-10 flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {step === 1 && <IdentityStep data={formData} update={updateForm} status={usernameStatus} onNext={() => setStep(2)} />}
            {step === 2 && <InterestsStep selected={formData.interests} onToggle={(tag: string) => updateForm({ interests: formData.interests.includes(tag) ? formData.interests.filter((t: string) => t !== tag) : [...formData.interests, tag] })} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
            {step === 3 && <AvatarStep previewUrl={previewUrl} onUpload={(file: File) => { setAvatarFile(file); setPreviewUrl(URL.createObjectURL(file)); }} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
            {step === 4 && <BioStep bio={formData.bio} update={(val: string) => updateForm({ bio: val })} onComplete={handleUpdate} onBack={() => setStep(3)} saving={saving} isEdit={true} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}