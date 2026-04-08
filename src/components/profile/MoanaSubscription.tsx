import { Crown, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const MoanaSubscription = () => {
  const features = [
    "Unlimited Neural Mind Maps",
    "Unlimited Adaptive Quizzes",
    "Exclusive Access to M3.0 Pro Model",
    "Priority Neural Processing"
  ];

  return (
    <section className="relative group p-[2px] rounded-[34px] overflow-hidden">
      {/* MOVING BORDER LIGHT EFFECT */}
      <div className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,#10b981_0%,#34d399_25%,#059669_50%,#34d399_75%,#10b981_100%)] opacity-100 group-hover:duration-500" />

      {/* INNER CONTENT BOX */}
      <div className="relative bg-[#f0fdf4] rounded-[32px] p-8 md:p-10 flex flex-col gap-8">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] shrink-0">
              <Crown size={40} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-2xl font-black text-emerald-950 uppercase tracking-tighter">MoanaAI Premium</h3>
                <span className="bg-emerald-200 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">M3.0 PRO</span>
              </div>
              <p className="text-emerald-700/70 text-sm font-bold uppercase tracking-widest">Unleash the full potential of your mind</p>
            </div>
          </div>
          
          <div className="text-left md:text-right">
            <div className="text-3xl font-black text-emerald-950 tracking-tighter">$12.99<span className="text-sm text-emerald-700/50">/mo</span></div>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Cancel anytime</p>
          </div>
        </div>

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-y border-emerald-100 py-8">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <span className="text-sm font-bold text-emerald-900/80">{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-emerald-800/60 font-medium max-w-md">
            The M3.0 Pro version utilizes advanced generative algorithms to map complex concepts 4x faster than the base model.
          </p>
          <button className="w-full md:w-auto bg-emerald-950 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-800 transition-all hover:shadow-2xl hover:shadow-emerald-200 active:scale-95">
            Upgrade Node <ArrowUpRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};