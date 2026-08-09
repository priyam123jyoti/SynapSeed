'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Loader2, CheckCircle, AlertCircle, Wallet, QrCode, Phone, Edit3, ShieldCheck, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface PayoutProfile {
  upi_id: string;
  phone_number: string;
  qr_code_url: string | null;
}

export default function PaperUploadClientPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Payout profile state
  const [payoutProfile, setPayoutProfile] = useState<PayoutProfile | null>(null);
  const [isEditingPayout, setIsEditingPayout] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [phoneNo, setPhoneNo] = useState('');

  // Form submitting state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
          setIsEditingPayout(true); // Force edit if no profile exists
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

    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append('user_id', user.id);
    formData.append('user_email', user.email || '');

    try {
      const res = await fetch('/api/papers/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server rejected submission package.');

      setSuccess(true);
      setTimeout(() => router.push('/papers/catalog'), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auth Loading View
  if (authLoading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
          <Loader2 className="animate-spin" size={20} /> Verifying uploader session...
        </div>
      </main>
    );
  }

  // Unauthorized Guard View
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
            onClick={() => router.push('/login')}
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
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Upload Previous Year Paper</h1>
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full border border-emerald-100">
              ₹3 Payout / Download
            </span>
          </div>
          <p className="text-xs text-slate-500 font-bold mt-1">
            Uploader Split: <strong className="text-slate-900">₹3.00</strong> | Fixed Paper Price: <strong className="text-slate-900">₹5.00</strong>
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl flex items-center gap-2 text-xs font-bold">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl flex items-center gap-2 text-xs font-bold">
            <CheckCircle size={16} /> Upload completed successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-slate-700">
          
          {/* SECTION 1: PAYOUT DETAILS CARD */}
          <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900">
                <Wallet size={18} className="text-emerald-600" />
                <h3 className="text-xs font-black uppercase tracking-wider">Uploader Payout Account</h3>
              </div>
              {payoutProfile && !isEditingPayout && (
                <button
                  type="button"
                  onClick={() => setIsEditingPayout(true)}
                  className="flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-bold"
                >
                  <Edit3 size={12} /> Edit Payment Info
                </button>
              )}
            </div>

            {payoutProfile && !isEditingPayout ? (
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase text-slate-400 font-bold">Saved UPI ID</p>
                  <p className="text-xs font-black text-slate-900">{payoutProfile.upi_id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase text-slate-400 font-bold">Saved Phone No.</p>
                  <p className="text-xs font-black text-slate-900">{payoutProfile.phone_number}</p>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 text-[11px] font-bold">
                  <ShieldCheck size={14} /> Payout Details Linked
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-1">
                    <Wallet size={12} /> UPI ID (For ₹3 Payout)
                  </label>
                  <input
                    type="text"
                    name="payout_upi_id"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                    placeholder="e.g., username@okaxis / upi@ybl"
                    className="p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-1">
                    <Phone size={12} /> WhatsApp / Phone Number
                  </label>
                  <input
                    type="tel"
                    name="payout_phone"
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value)}
                    required
                    placeholder="e.g., 9876543210"
                    className="p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="flex items-center gap-1">
                    <QrCode size={12} /> Payment QR Code Image {payoutProfile?.qr_code_url && '(Optional if already uploaded)'}
                  </label>
                  <input
                    type="file"
                    name="payout_qr_file"
                    accept="image/*"
                    required={!payoutProfile?.qr_code_url}
                    className="p-2.5 border border-dashed border-slate-300 rounded-xl bg-white file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400 font-semibold">
                    This info will be permanently saved to your account so you don't need to re-enter it for future uploads.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: QUESTION PAPER DETAILS */}
          <div className="flex flex-col gap-1.5">
            <label>College / Institute Title Name</label>
            <input type="text" name="college_name" required placeholder="e.g., Dhakuakhana College" className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label>Academic Program</label>
            <select name="program" required className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none bg-white">
              <option value="">Select Program</option>
              <option value="BTech">B.TECH</option>
              <option value="MTech">M.TECH</option>
              <option value="BSc">B.Sc</option>
              <option value="MSc">M.Sc</option>
              <option value="BCA">BCA</option>
              <option value="MCA">MCA</option>
              <option value="BBA">BBA</option>
              <option value="MBA">MBA</option>
              <option value="BCom">B.COM</option>
              <option value="MCom">M.COM</option>
              <option value="BA">B.A.</option>
              <option value="MA">M.A.</option>
              <option value="BEd">B.Ed</option>
              <option value="MEd">M.Ed</option>
              <option value="BPharma">B.PHARMA</option>
              <option value="MPharma">M.PHARMA</option>
              <option value="DPharma">D.PHARMA</option>
              <option value="LLB">LLB</option>
              <option value="LLM">LLM</option>
              <option value="BArch">B.ARCH</option>
              <option value="MArch">M.ARCH</option>
              <option value="MBBS">MBBS</option>
              <option value="BDS">BDS</option>
              <option value="BAMS">BAMS</option>
              <option value="BHMS">BHMS</option>
              <option value="Nursing">B.Sc NURSING</option>
              <option value="BPT">BPT</option>
              <option value="MPT">MPT</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label>Department Stream</label>
            <input type="text" name="department" required placeholder="e.g., Computer Science" className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label>Semester Lifecycle</label>
            <input type="number" name="semester" min="1" max="10" required placeholder="e.g., 3" className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label>Examination Year Conducted</label>
            <input type="number" name="year" min="2000" max="2030" defaultValue={2026} required className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label>Paper/Course Code Identification</label>
            <input type="text" name="course_code" required placeholder="e.g., CS-302" className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none" />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label>Course Title Specification</label>
            <input type="text" name="course_title" required placeholder="e.g., Object Oriented Data Structures" className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none" />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label>Exam Assessment Classification Type</label>
            <div className="flex gap-4 p-1">
              <label className="flex items-center gap-2 font-semibold"><input type="radio" name="exam_type" value="Semester End" defaultChecked /> Semester End Exam</label>
              <label className="flex items-center gap-2 font-semibold"><input type="radio" name="exam_type" value="Sessional" /> Sessional / Mid-Term Test</label>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2 mt-2">
            <label>Upload Document File Asset (PDF / JPG Layouts)</label>
            <input type="file" name="file" accept=".pdf,.png,.jpg,.jpeg" required className="p-3 border border-dashed border-slate-300 rounded-xl bg-slate-50 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white cursor-pointer" />
          </div>

          <button type="submit" disabled={loading} className="w-full md:col-span-2 flex items-center justify-center gap-2 bg-slate-900 text-white p-4 rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-all uppercase tracking-widest mt-4">
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
            {loading ? 'Publishing Paper...' : 'Publish Paper & Link Payout Account'}
          </button>
        </form>
      </div>
    </main>
  );
}