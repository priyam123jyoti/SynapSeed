import { Loader2, Globe, Trash2, Image as ImageIcon } from "lucide-react";

export function LiveDatabase({ events, fetching, onDelete }: any) {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
      <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-slate-300">
        <Globe className="text-emerald-400" size={16} /> Live Database
      </h3>
      
      {fetching ? (
        <div className="flex justify-center py-8"><Loader2 className="animate-spin text-slate-600" /></div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {events.length === 0 && <p className="text-xs text-slate-500 text-center py-4">No events found.</p>}
          {events.map((ev: any) => (
            <div key={ev.id} className="group bg-white/5 border border-white/10 p-3 rounded-xl flex items-center justify-between hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-slate-800 overflow-hidden relative shrink-0">
                   {ev.thumbnail ? <img src={ev.thumbnail} className="object-cover w-full h-full" alt="" /> : <ImageIcon className="m-auto mt-2 text-slate-600" size={16} />}
                </div>
                <div className="overflow-hidden">
                  <p className="text-[11px] font-bold leading-tight truncate w-32">{ev.title}</p>
                  <p className="text-[9px] text-emerald-400 font-mono uppercase">{ev.date_short}</p>
                </div>
              </div>
              <button onClick={() => onDelete(ev.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}