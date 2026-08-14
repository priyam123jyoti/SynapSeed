'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Loader2, CheckCircle, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PayoutDetailsCard, PayoutProfile } from '@/components/upload/PayoutDetailsCard';
import { PaperDetailsForm } from '@/components/upload/PaperDetailsForm';

export default function PaperUploadClientPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Payout profile state
  const [payoutProfile, setPayoutProfile] = useState<PayoutProfile | null>(null);
  const [isEditingPayout, setIsEditingPayout] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [phoneNo, setPhoneNo] = useState('');

  // Form submit state
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 1. Fetch user & saved payment profile on mount
  useEffect(() => {
    const initAuthAndProfile = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) {
          setUser(null);
          setAuthLoading(false);
          return;
        }

        setUser(currentUser);

        // Fetch existing uploader payout details
        const { data: profile } = await supabase
          .from('uploader_profiles')
          .select('upi_id, phone_number, qr_code_url')
          .eq('id', currentUser.id)
          .single();

        if (profile) {
          setPayoutProfile(profile);
          setUpiId(profile.upi_id || '');
          setPhoneNo(profile.phone_number || '');
        } else {
          setIsEditingPayout(true);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setAuthLoading(false);
      }
    };

    initAuthAndProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const thumbnailFile = formData.get('thumbnail_file') as File | null;
    const pdfFile = formData.get('file') as File | null;

    // --- POPUP ALERT VALIDATION FOR THUMBNAIL (Max 1MB) ---
    if (thumbnailFile && thumbnailFile.size > 0) {
      const maxThumbnailSize = 1 * 1024 * 1024; // 1 MB
      if (thumbnailFile.size > maxThumbnailSize) {
        alert('Thumbnail photo size should be less than 1 MB.');
        return;
      }
    }

    // --- POPUP ALERT VALIDATION FOR PDF FILE (PDF ONLY & Max 2MB) ---
    if (pdfFile && pdfFile.size > 0) {
      const isPdf = pdfFile.type === 'application/pdf' || pdfFile.name.toLowerCase().endsWith('.pdf');
      if (!isPdf) {
        alert('Only PDF files are allowed for the question paper.');
        return;
      }

      const maxPdfSize = 2 * 1024 * 1024; // 2 MB
      if (pdfFile.size > maxPdfSize) {
        alert('PDF size should be less than 2 MB.');
        return;
      }
    }

    setLoading(true);
    formData.append('user_id', user.id);
    formData.append('user_email', user.email || '');

    try {
      const res = await fetch('/api/papers/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Server rejected submission package.');
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push('/papers/catalog'), 2000);
    } catch (err: any) {
      alert(err.message || 'An unexpected error occurred during upload.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
          <Loader2 className="animate-spin" size={20} /> Verifying uploader session...
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-8 text-center space-y-4">
          <div className="w-12 h-12 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-500">
            <Lock size={24} />
          </div>
          <h2 className="text-lg font-black uppercase text-slate-900">Authentication Required</h2>
          <p className="text-xs font-semibold text-slate-500">
            You must be logged in to upload question papers and receive your ₹3 per download sale split.
          </p>
          <button
            onClick={() => router.push('/onboarding')}
            className="w-full bg-slate-900 text-white p-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-all"
          >
            Log In To Continue
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl p-8 space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">
              Upload Previous Year Paper
            </h1>
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full border border-emerald-100">
              ₹3 Payout / Download
            </span>
          </div>
          <p className="text-xs text-slate-500 font-bold mt-1">
            Uploader Split: <strong className="text-slate-900">₹3.00</strong> | Fixed Paper Price: <strong className="text-slate-900">₹5.00</strong> | Platform Fee: <strong className="text-slate-900">₹2.00</strong> 
          </p>
        </div>

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl flex items-center gap-2 text-xs font-bold">
            <CheckCircle size={16} /> Upload completed successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-slate-700">
          {/* SECTION 1: PAYOUT DETAILS */}
          <PayoutDetailsCard
            payoutProfile={payoutProfile}
            isEditingPayout={isEditingPayout}
            setIsEditingPayout={setIsEditingPayout}
            upiId={upiId}
            setUpiId={setUpiId}
            phoneNo={phoneNo}
            setPhoneNo={setPhoneNo}
          />

          {/* SECTION 2: PAPER & COURSE DETAILS FORM */}
          <PaperDetailsForm />

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full md:col-span-2 flex items-center justify-center gap-2 bg-slate-900 text-white p-4 rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-all uppercase tracking-widest mt-4 cursor-pointer"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
            {loading ? 'Publishing Paper...' : 'Publish Paper & Link Payout Account'}
          </button>
        </form>
      </div>
    </main>
  );
}