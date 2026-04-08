import React from 'react';

export default function ImpactStats() {
  const stats = [
    { label: "Research History", value: "50+", sub: "Years of Excellence" },
    { label: "Alumni Network", value: "1,200+", sub: "Graduated Botanists" },
    { label: "Facilities", value: "03", sub: "Climate Greenhouses" },
    { label: "Collaboration", value: "15+", sub: "Global Partners" },
  ];

  return (
    <section className="py-12 md:py-20 border-y border-slate-100 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6">
        {/* SEO Item 4: Semantic Description List */}
        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              {/* dt: The Term (The Number) */}
              <dt className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter group-hover:text-emerald-600 transition-colors duration-300">
                {stat.value}
              </dt>
              {/* dd: The Description */}
              <dd className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                {stat.label}
              </dd>
              <dd className="text-slate-400 text-xs font-medium mt-1">
                {stat.sub}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}