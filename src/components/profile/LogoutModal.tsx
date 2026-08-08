import { AlertCircle } from 'lucide-react';

export const LogoutModal = ({ onConfirm, onClose }: any) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/20 backdrop-blur-sm">
    <div className="bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl text-center">
      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle size={32} />
      </div>
      <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Are You Sure for Logout?</h3>
      <p className="text-slate-500 text-sm font-medium mb-8">You are about to disconnect from your profile.</p>
      <div className="space-y-3">
        <button onClick={onConfirm} className="w-full py-4 bg-red-500 text-white font-black rounded-2xl uppercase text-[11px] tracking-widest">Confirm Disconnect</button>
        <button onClick={onClose} className="w-full py-4 text-slate-400 font-black rounded-2xl uppercase text-[11px] tracking-widest">Cancel</button>
      </div>
    </div>
  </div>
);