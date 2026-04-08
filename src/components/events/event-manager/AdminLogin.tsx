import { Lock } from "lucide-react";

export function AdminLogin({ passcode, setPasscode, onLogin }: any) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 px-4">
      <form onSubmit={onLogin} className="bg-white p-8 rounded-2xl shadow-xl border border-emerald-100 max-w-sm w-full">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-6 mx-auto text-emerald-600">
          <Lock size={24} />
        </div>
        <h1 className="text-center font-black text-emerald-900 uppercase tracking-widest mb-2">Botany Admin</h1>
        <input 
          type="password" placeholder="Passcode" 
          className="w-full p-3 border border-slate-200 rounded-lg mb-4 text-center focus:ring-2 focus:ring-emerald-500 outline-none"
          value={passcode} onChange={(e) => setPasscode(e.target.value)}
        />
        <button className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition-all">Access Dashboard</button>
      </form>
    </div>
  );
}