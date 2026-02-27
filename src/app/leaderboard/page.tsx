"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, Trophy } from 'lucide-react';
import Link from 'next/link'; // Import Link
import { Podium } from '@/components/leaderboard/Podium';
import { RankList } from '@/components/leaderboard/RankList';

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

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#D4E4BC]">
      <div className="w-12 h-12 border-4 border-[#2D3142] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#D4E4BC] font-sans text-[#2D3142] flex flex-col">
      {/* GLOBAL HEADER */}
      <nav className="p-6 lg:px-12 flex items-center justify-between flex-none">
        <div className="flex items-center gap-4">
          {/* LINK TO HOME PAGE */}
          <Link 
            href="/" 
            className="p-2 hover:bg-black/5 rounded-full transition-all flex items-center justify-center"
            aria-label="Back to Home"
          >
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-sm lg:text-xl font-black uppercase tracking-[0.3em]">Standings</h1>
        </div>
        
        <div className="bg-white/50 px-4 py-2 rounded-full flex items-center gap-2 border border-white/20">
          <Trophy size={16} className="text-amber-500" />
          <span className="text-[10px] lg:text-xs font-black uppercase tracking-widest">Season 01</span>
        </div>
      </nav>

      {/* RECTANGLE HERO & LIST LAYOUT */}
      <main className="max-w-[1400px] mx-auto w-full px-4 lg:px-12 pb-20 flex-1">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start h-full">
          
          {/* PODIUM: Rectangles are visible on all devices */}
          <div className="w-full lg:sticky lg:top-24 lg:w-[45%]">
            <div className="mb-8 lg:mb-12">
              <h2 className="text-4xl lg:text-7xl font-black uppercase leading-none italic opacity-10">The Best</h2>
              <h2 className="text-2xl lg:text-4xl font-black uppercase -mt-4 lg:-mt-8">Scholars</h2>
              <div className="h-1.5 w-20 bg-[#2D3142] mt-4" />
            </div>
            
            <Podium topThree={leaders.slice(0, 3)} />
          </div>

          {/* LIST: Scrolls naturally */}
          <div className="w-full lg:w-[55%]">
            <RankList others={leaders.slice(3, 50)} />
          </div>

        </div>
      </main>
    </div>
  );
}