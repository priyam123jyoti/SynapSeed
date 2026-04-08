import Image from "next/image";
import Link from "next/link"; // 1. Import the Link component
import { FacultyMember } from "@/lib/faculty";

export default function FacultyCard({ member }: { member: FacultyMember }) {
  return (
    // 2. Wrap everything in a Link pointing to the slug
    <Link href={`/faculty/${member.slug}`} className="block group">
      <article className="relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col items-center text-center p-6 min-h-[350px]">
        
        {/* HOD Badge */}
        {member.isHod && (
          <span className="absolute top-4 right-4 bg-emerald-100 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest z-10">
            HOD
          </span>
        )}

        {/* Image Container */}
        <div className="relative w-32 h-32 mb-6 rounded-full overflow-hidden border-4 border-slate-50 group-hover:border-emerald-200 transition-colors duration-300">
          <Image
            src={member.imageUrl}
            alt={member.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Info */}
        <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
          {member.name}
        </h3>
        <p className="text-emerald-600 font-medium text-xs uppercase tracking-[0.2em] mb-4">
          {member.designation}
        </p>
        
        <div className="mt-auto w-full pt-4 border-t border-slate-100">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Qualifications</p>
          <p className="text-slate-700 text-sm font-semibold">
            {member.qualifications}
          </p>
        </div>

        {/* Subtle "View Profile" hint that appears on hover */}
        <div className="mt-4 text-emerald-500 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          View Full Profile <span>→</span>
        </div>
        
      </article>
    </Link>
  );
}