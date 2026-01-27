"use client";

import { memo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Wallet, Clock, Briefcase, CheckCircle2 } from 'lucide-react';
import { COUNTRIES, type Country } from '@/data/study-abroad';

const CountryGrid = memo(() => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto p-4"
    >
      {COUNTRIES.map((country: Country) => (
        <CountryCard key={country.id} country={country} />
      ))}
    </motion.div>
  );
});

const CountryCard = ({ country }: { country: Country }) => (
  <div className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col h-full">
    <div className="relative h-48 w-full overflow-hidden">
      <Image src={country.image} alt={country.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute bottom-4 left-4 text-white flex items-center gap-2">
        <span className="text-2xl">{country.flag}</span>
        <h3 className="text-2xl font-bold">{country.name}</h3>
      </div>
    </div>

    <div className="p-6 flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <StatBadge label="Tuition" value={country.tuition} icon={<Wallet size={14}/>} color="bg-emerald-50 text-emerald-700" />
        <StatBadge label="Living" value={country.livingCost} icon={<MapPin size={14}/>} color="bg-blue-50 text-blue-700" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <StatBadge label="Work" value={country.partTime} icon={<Briefcase size={14}/>} color="bg-purple-50 text-purple-700" />
        <StatBadge label="Visa" value={country.postStudyVisa} icon={<Clock size={14}/>} color="bg-amber-50 text-amber-700" />
      </div>

      <div className="mt-2">
        <p className="text-[10px] font-black uppercase text-gray-400 mb-2">Top Fields</p>
        <div className="flex flex-wrap gap-2">
          {country.topFields.map((field: string, i: number) => (
            <span key={i} className="px-2 py-1 rounded-md bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-600 flex items-center gap-1">
              <CheckCircle2 size={10} className="text-emerald-500" /> {field}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const StatBadge = ({ label, value, icon, color }: any) => (
  <div className={`p-3 rounded-xl ${color} flex flex-col gap-1`}>
    <div className="flex items-center gap-1.5 opacity-70">
      {icon} <span className="text-[9px] font-black uppercase">{label}</span>
    </div>
    <span className="text-xs font-bold leading-tight">{value}</span>
  </div>
);

CountryGrid.displayName = 'CountryGrid';
export default CountryGrid;