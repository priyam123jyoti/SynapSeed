// src/components/profile/ProfileIdentity.tsx
import { Briefcase, GraduationCap } from 'lucide-react';

export const ProfileIdentity = ({ profile, loading }: any) => (
  <section className="space-y-8">
    {/* Bio Section */}
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">About Me</label>
      <p className="text-xl font-medium text-slate-800 leading-snug">
        {loading ? "Decrypting neural data..." : (profile?.bio || "No bio set for this by the user.")}
      </p>
    </div>

    {/* Roles Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-4">
        <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><Briefcase size={18} /></div>
        <div>
          <p className="text-[9px] font-black uppercase text-slate-400">Occupation</p>
          <p className="font-bold text-slate-900">{profile?.occupation || "Unassigned"}</p>
        </div>
      </div>
      <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-4">
        <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><GraduationCap size={18} /></div>
        <div>
          <p className="text-[9px] font-black uppercase text-slate-400">Institution</p>
          <p className="font-bold text-slate-900">{profile?.institution || "Independent"}</p>
        </div>
      </div>
    </div>

    {/* Expertise Matrix (Tags) */}
    <div className="space-y-3">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Interests</label>
      <div className="flex flex-wrap gap-2">
        {profile?.interests?.length > 0 ? (
          profile.interests.map((tag: string) => (
            <span key={tag} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-[11px] font-black uppercase tracking-tight rounded-xl">
              {tag}
            </span>
          ))
        ) : (
          <p className="text-xs text-slate-300 font-bold uppercase">No interests set by the user.</p>
        )}
      </div>
    </div>
  </section>
);