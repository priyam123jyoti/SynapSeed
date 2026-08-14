'use client';

import { use, useEffect, useState } from 'react';
import { 
  Phone, 
  Copy, 
  Check, 
  ShieldCheck, 
  Lock, 
  Loader2, 
  Building2, 
  User, 
  CreditCard 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const ADMIN_EMAIL = 'dihingiapriyamjyoti@gmail.com';

interface PaymentDetails {
  id: string;
  course_title: string;
  course_code: string;
  college_name: string;
  uploader_email?: string;
  uploader_id?: string;
  upi_id?: string;
  phone_number?: string;
}

export default function PaperPaymentInfoPage({
  params,
}: {
  params: Promise<{ paperId: string }>;
}) {
  const resolvedParams = use(params);
  const paperId = resolvedParams?.paperId;

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [paper, setPaper] = useState<PaymentDetails | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // 1. Verify Admin Session
        const { data: { user } } = await supabase.auth.getUser();
        const userEmail = user?.email?.toLowerCase().trim();

        if (!userEmail || userEmail !== ADMIN_EMAIL.toLowerCase()) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        setIsAdmin(true);

        if (!paperId || paperId === 'undefined') {
          setError('Invalid Paper ID.');
          setLoading(false);
          return;
        }

        // 2. Fetch base Paper Details (safely avoiding non-existent columns on 'papers')
        const { data: paperData, error: fetchErr } = await supabase
          .from('papers')
          .select('id, course_title, course_code, college_name, uploader_email, uploader_id')
          .eq('id', paperId)
          .maybeSingle();

        if (fetchErr || !paperData) {
          setError(fetchErr?.message || 'Paper record not found.');
          setLoading(false);
          return;
        }

        let upi_id: string | undefined;
        let phone_number: string | undefined;

        // 3. Fetch payment details from uploader_profiles table
        if (paperData.uploader_id) {
          const { data: uploaderProfile } = await supabase
            .from('uploader_profiles')
            .select('upi_id, phone_number')
            .eq('id', paperData.uploader_id)
            .maybeSingle();

          if (uploaderProfile) {
            upi_id = uploaderProfile.upi_id;
            phone_number = uploaderProfile.phone_number;
          }
        }

        setPaper({
          ...paperData,
          upi_id,
          phone_number,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load payment info.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [paperId]);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="animate-spin text-amber-400" size={32} />
        <span className="text-xs font-bold uppercase tracking-widest">
          Authenticating Admin & Fetching Payment Details...
        </span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
            <Lock size={28} />
          </div>
          <h2 className="text-white font-black text-xl uppercase tracking-tight">
            Restricted Access
          </h2>
          <p className="text-slate-400 text-xs font-semibold">
            This window contains confidential uploader payment information and is only accessible by the platform administrator.
          </p>
        </div>
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center space-y-3">
          <p className="text-red-400 text-xs font-bold uppercase tracking-wider">
            {error || 'Unable to retrieve paper details.'}
          </p>
        </div>
      </div>
    );
  }

  const upiId = paper.upi_id || 'Not Provided';
  const phoneNumber = paper.phone_number || 'Not Provided';
  const uploaderEmail = paper.uploader_email || 'Hidden / System Upload';

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12 flex items-center justify-center">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Admin Badge Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-amber-400">
            <ShieldCheck size={20} />
            <span className="text-xs font-black uppercase tracking-widest">
              Admin Payment Vault
            </span>
          </div>
          <span className="text-[10px] bg-amber-400/10 text-amber-400 border border-amber-400/30 px-2.5 py-1 rounded-full font-bold uppercase">
            Confidential
          </span>
        </div>

        {/* Paper Overview */}
        <div className="space-y-1 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <h3 className="font-black text-sm uppercase text-slate-100 tracking-tight">
            {paper.course_title}
          </h3>
          <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
            <Building2 size={13} className="text-slate-500" /> {paper.college_name} ({paper.course_code})
          </p>
          <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 pt-1">
            <User size={13} strokeWidth={2} className="text-slate-500" /> Uploader: {uploaderEmail}
          </p>
        </div>

        {/* UPI & Phone Credentials */}
        <div className="space-y-3">
          {/* UPI ID */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
            <div className="space-y-0.5 overflow-hidden">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <CreditCard size={12} className="text-amber-400" /> UPI ID
              </span>
              <p className="text-sm font-mono font-bold text-slate-100 truncate pt-0.5">
                {upiId}
              </p>
            </div>
            {upiId !== 'Not Provided' && (
              <button
                onClick={() => handleCopy(upiId, 'upi')}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                title="Copy UPI ID"
              >
                {copiedField === 'upi' ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
            )}
          </div>

          {/* Phone Number */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
            <div className="space-y-0.5 overflow-hidden">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <Phone size={12} className="text-amber-400" /> Mobile / WhatsApp Number
              </span>
              <p className="text-sm font-mono font-bold text-slate-100 truncate pt-0.5">
                {phoneNumber}
              </p>
            </div>
            {phoneNumber !== 'Not Provided' && (
              <button
                onClick={() => handleCopy(phoneNumber, 'phone')}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                title="Copy Phone Number"
              >
                {copiedField === 'phone' ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}