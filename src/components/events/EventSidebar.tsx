import { Syne } from "next/font/google";
import { cn } from "@/lib/utils";

const crazyFont = Syne({ subsets: ["latin"], weight: ["800"] });

export default function EventSidebar({ objectives }: { objectives: string[] }) {
  if (!objectives || objectives.length === 0) return null;

  return (
    <aside className="lg:col-span-4">
      <div className="bg-white rounded-2xl p-8 border border-emerald-100 shadow-sm sticky top-24">
        <h3 className={cn(crazyFont.className, "text-[10px] text-emerald-800 mb-6 uppercase tracking-[0.3em] border-b border-emerald-50 pb-4")}>
          Key Objectives
        </h3>
        <ul className="space-y-5">
          {objectives.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-600 font-bold text-[11px] uppercase tracking-wider">
              <div className="w-1.5 h-1.5 mt-1 rounded-full bg-lime-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}