'use client';

import { useState } from 'react';
import { Wallet, Loader2 } from 'lucide-react';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function WalletTopUp({ userEmail }: { userEmail: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(50);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) throw new Error('Razorpay SDK failed to load.');

      const orderRes = await fetch('/api/user/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: topUpAmount }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Paper Marketplace',
        description: 'Wallet Top-up',
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/user/razorpay-verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amountAdded: topUpAmount,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              alert('Payment successful! Your wallet has been credited.');
              window.location.reload(); // Refresh to catch updated DB balance
            } else {
              alert(`Verification failed: ${verifyData.error}`);
            }
          } catch (err) {
            alert('An error occurred during verification.');
          }
        },
        prefill: { email: userEmail },
        theme: { color: '#0f172a' },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center max-w-sm w-full mx-auto text-white shadow-xl">
      <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-4">
        <Wallet size={24} />
      </div>
      <h2 className="font-bold text-lg mb-2">Add Funds to Wallet</h2>
      <p className="text-xs text-slate-400 mb-6 text-center">Select an amount to top up your marketplace balance securely.</p>
      
      <div className="flex w-full gap-2 mb-6">
        {[20, 50, 100].map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => setTopUpAmount(amount)}
            className={`flex-1 py-2 rounded-lg border font-bold text-sm transition-all ${
              topUpAmount === amount
                ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                : 'border-slate-700 text-slate-300 hover:border-slate-500'
            }`}
          >
            ₹{amount}
          </button>
        ))}
      </div>

      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full bg-white text-slate-950 font-black py-3 rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isLoading && <Loader2 className="animate-spin" size={18} />}
        {isLoading ? 'Processing...' : `Pay ₹${topUpAmount} securely`}
      </button>
    </div>
  );
}