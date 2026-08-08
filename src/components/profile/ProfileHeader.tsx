import { Edit3, ShieldCheck } from 'lucide-react';

export const ProfileHeader = ({ profile, loading, onEdit }: any) => {
  const displayUsername = profile?.username || "Neural Node";
  
  // Logic to check if YOU are the viewer (Lead Developer)
  // Replace 'your-email@gmail.com' with your actual email
  const isDeveloper = profile?.email === 'your-email@gmail.com' || profile?.username === 'priyam';

  return (
    <div className="relative bg-[#fcfcfc]">
      {/* 1. Banner - Adjusted height for mobile */}
      <div className="h-48 sm:h-64 bg-slate-900 w-full relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500 via-transparent to-transparent" />
        
        {/* Edit Button */}
        <div className="max-w-5xl mx-auto px-6 pt-6 flex justify-end relative z-10">
          <button 
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-white/20 active:scale-95 shadow-xl"
          >
            <Edit3 size={14} />
            <span className="hidden xs:inline">Edit Profile</span>
          </button>
        </div>
      </div>
      
      {/* 2. Profile Info Container */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="relative flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6 -mt-12 sm:-mt-16 pb-6">
          
          {/* Avatar - Responsive sizing */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-full border-[6px] sm:border-[8px] border-[#fcfcfc] bg-emerald-500 shadow-2xl overflow-hidden flex items-center justify-center text-4xl sm:text-5xl font-black text-white ring-1 ring-slate-100">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                displayUsername.charAt(0).toUpperCase()
              )}
            </div>
            {/* Online Pulse Status */}
            <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-400 border-[3px] sm:border-4 border-[#fcfcfc] rounded-full shadow-md" />
          </div>

          {/* Text Content - Pushed down to avoid background overlap */}
          <div className="sm:pb-4 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-slate-900">
                {loading ? (
                  <div className="w-40 h-10 bg-slate-100 animate-pulse rounded-lg" />
                ) : (
                  `@${displayUsername}`
                )}
              </h1>
              
              {/* PLATFORM DEVELOPER BADGE */}
              {isDeveloper && (
                <div className="flex items-center gap-1 bg-slate-900 text-white px-2 py-1 rounded-md">
                  <ShieldCheck size={12} className="text-emerald-400" />
                  <span className="text-[8px] font-black uppercase tracking-tighter">Founder</span>
                </div>
              )}
            </div>

            {/* DYNAMIC SUBTITLE */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                {profile?.is_dhakuakhana_college_autonomous 
                  ? "Dhakuakhana College Node" 
                  : "Verified Neural Node"}
              </p>
              
              {profile?.occupation && (
                <>
                  <span className="hidden sm:inline text-slate-300">•</span>
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {profile.occupation}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Border Bottom */}
      <div className="h-[1px] w-full bg-slate-100" />
    </div>
  );
};