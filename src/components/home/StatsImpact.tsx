export function StatsImpact() {
  const stats = [
    { label: "Research Papers", value: "500+", description: "Peer-reviewed botanical studies" },
    { label: "Active Herbarium", value: "12k+", description: "Digitized plant specimens" },
    { label: "Greenhouses", value: "03", description: "Climate-controlled environments" },
    { label: "Global Partners", value: "15+", description: "International research labs" },
  ];

  return (
    <section className="bg-emerald-900 py-16 px-6 rounded-[2.5rem] my-20">
      <div className="max-w-7xl mx-auto">
        {/* Semantic Description List for SEO */}
        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col gap-2">
              <dt className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                {stat.value}
              </dt>
              <dd className="text-emerald-300 font-bold uppercase text-[10px] tracking-[0.2em]">
                {stat.label}
              </dd>
              <dd className="text-emerald-100/50 text-[11px] leading-relaxed max-w-[150px] mx-auto">
                {stat.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}