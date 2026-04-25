"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, Trophy } from 'lucide-react';
import Link from 'next/link';
import { Podium } from '@/components/leaderboard/Podium';
import { RankList } from '@/components/leaderboard/RankList';
import Navbar from '@/components/layout/Navbar';

export default function LeaderboardPage() { 
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);  

  useEffect(() => { 
    async function fetchLeaderboard() {
      const { data } = await supabase
        .from('global_leaderboard')
        .select('*')
        .order('average_score', { ascending: false });
      if (data) setLeaders(data);
      setLoading(false);
    }
    fetchLeaderboard();
  }, []);

  // SEO JSON-LD: This helps Google understand the "List" nature of your page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": leaders.slice(0, 10).map((leader, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": leader.full_name || "Scholar",
      "description": `Top Scholar with average score of ${leader.average_score}%`
    }))
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#D4E4BC]" aria-busy="true">
      <div className="w-12 h-12 border-4 border-[#2D3142] border-t-transparent rounded-full animate-spin" />
      <span className="sr-only">Loading Leaderboard Rankings...</span>
    </div>
  );

  return (
    <>
      {/* 1. SEO Structured Data Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar/>
      
      <div className="min-h-screen bg-[#D4E4BC] font-sans text-[#2D3142] flex flex-col">
        {/* SEO Hidden H1: Every page needs exactly one H1 for Google */}
        <h1 className="sr-only">Global Scholar Leaderboard - Department of Botany, Dhakuakhana College</h1>

        <main className="max-w-[1400px] mx-auto w-full px-4 lg:px-12 pb-20 flex-1">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start h-full">
            
            {/* PODIUM Section: Semantic 'aside' for supplementary but important info */}
            <aside className="w-full lg:sticky lg:top-24 lg:w-[45%]" aria-labelledby="podium-title">
              <div className="mb-8 lg:mb-12">
                <p id="podium-title" className="text-4xl lg:text-7xl font-black uppercase leading-none italic opacity-10">The Best</p>
                <h2 className="text-2xl lg:text-4xl font-black uppercase -mt-4 lg:-mt-8">Top Scholars</h2>
                <div className="h-1.5 w-20 bg-[#2D3142] mt-4" aria-hidden="true" />
              </div>
              
              <Podium topThree={leaders.slice(0, 3)} />
            </aside>

            {/* RANK LIST Section: Semantic 'section' for primary content */}
            <section className="w-full lg:w-[55%]" aria-label="Global Rankings List">
              <h2 className="sr-only">Full Ranking List</h2>
              <RankList others={leaders.slice(3, 50)} />
            </section>

          </div>
        </main>

        {/* Local SEO Footer reinforcement */}
        <footer className="py-6 text-center text-[10px] opacity-40 uppercase tracking-[0.2em]">
          Academic Merit Records • Dhakuakhana College Botany Dept
        </footer>
      </div>
    </>
  );
}