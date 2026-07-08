import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import WalletTopUp from '@/components/Wallet/WalletTopUp';

export default async function WalletPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Guard access: Kick unauthenticated users out to sign-in page
  if (!user) {
    redirect('/login');
  }

  // Grab the live wallet data directly from our database configuration
  const { data: profile } = await supabase
    .from('profiles')
    .select('wallet_balance')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 gap-8">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-black text-white tracking-tight uppercase text-sm tracking-widest text-slate-400">Account Balance Ledger</h1>
        <p className="text-3xl font-black text-emerald-400">
          ₹{Number(profile?.wallet_balance || 0).toFixed(2)}
        </p>
      </div>

      {/* Render the Payment handler box component */}
      <WalletTopUp userEmail={user.email || ''} />
    </div>
  );
}