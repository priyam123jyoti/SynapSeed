import { User, Briefcase, GraduationCap } from 'lucide-react';

export const ProfileIdentity = ({ profile, loading }: { profile: any; loading: boolean }) => (
  <section className="bg-white p-8 border border-slate-200 shadow-sm transition-all hover:border-emerald-500">
    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-6 flex items-center gap-2">
      <User size={14} strokeWidth={3} /> Neural Identity
    </h2>
    {loading ? (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-slate-100 w-3/4" />
        <div className="h-4 bg-slate-100 w-1/2" />
      </div>
    ) : (
      <div className="space-y-6">
        {profile?.bio && <p className="text-slate-800 text-lg font-medium leading-tight border-l-4 border-emerald-500 pl-4 italic">"{profile.bio}"</p>}
        <div className="flex flex-wrap gap-2">
          {profile?.occupation && (
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider">
              <Briefcase size={12} /> {profile.occupation}
            </div>
          )}
          {profile?.institution && (
            <div className="flex items-center gap-2 px-3 py-1 border border-slate-900 text-slate-900 text-[10px] font-bold uppercase tracking-wider">
              <GraduationCap size={12} /> {profile.institution}
            </div>
          )}
        </div>
        <div className="pt-6 border-t border-slate-100">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">Expertise Matrix</p>
          <div className="flex flex-wrap gap-1">
            {profile?.interests?.map((tag: string) => (
              <span key={tag} className="px-2 py-1 border border-slate-200 text-slate-600 text-[10px] font-bold hover:bg-emerald-50 hover:border-emerald-200 transition-colors cursor-default">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    )}
  </section>
);