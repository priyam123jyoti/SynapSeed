import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const researchAreas = [
  {
    title: "Plant Taxonomy",
    slug: "plant-taxonomy",
    image: "https://images.unsplash.com/photo-1501004318641-72e5453f444c?auto=format&fit=crop&q=80&w=800",
    desc: "Classification and identification of global flora."
  },
  {
    title: "Molecular Biology",
    slug: "molecular-biology",
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800",
    desc: "Studying plant life at the cellular and genetic level."
  },
  {
    title: "Ethnobotany",
    slug: "ethnobotany",
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=800",
    desc: "The relationship between people and plants."
  }
];

export default function ResearchMosaic() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-xl">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-4">Expertise</h2>
          <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter leading-none">
            Advancing the Frontiers of <br /> <span className="text-slate-400">Botanical Knowledge.</span>
          </h3>
        </div>
        <Link href="/research" className="text-xs font-bold uppercase tracking-widest border-b-2 border-emerald-500 pb-1 hover:text-emerald-600 transition-all">
          View All Research
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {researchAreas.map((area, i) => (
          <Link key={i} href={`/research/${area.slug}`} className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-slate-200">
            {/* Image with Blur Effect */}
            <Image 
              src={area.image} 
              alt={area.title}
              fill
              className="object-cover blur-[2px] group-hover:blur-0 transition-all duration-700 scale-110 group-hover:scale-100"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent p-8 flex flex-col justify-end">
              <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  {area.title} <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-slate-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {area.desc}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}