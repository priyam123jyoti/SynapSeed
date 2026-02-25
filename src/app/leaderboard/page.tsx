"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Star } from 'lucide-react';

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      // We fetch directly from the 'global_leaderboard' view we created in SQL
      const { data, error } = await supabase
        .from('global_leaderboard')
        .select('*')
        .limit(20); // Get top 20 scholars

      if (error) {
        console.error("Fetch error:", error.message);
      } else if (data) {
        setLeaders(data);
      }
      setLoading(false);
    }

    fetchLeaderboard();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-black text-gray-400 uppercase tracking-widest text-[10px]">Syncing Global Rankings...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-24 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="inline-flex p-4 bg-amber-50 rounded-3xl text-amber-500 mb-6"
          >
            <Trophy size={40} />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-4">
            GLOBAL <span className="text-emerald-500">LEADERBOARD</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-[10px]">
            The elite circle of scientific mastery
          </p>
        </div>

        {/* Empty State */}
        {!loading && leaders.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
            <Star className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-400 font-bold italic">No rankings available yet. Be the first to join!</p>
          </div>
        )}

        {/* Leaderboard List */}
        <div className="space-y-4">
          {leaders.map((user, index) => (
            <motion.div 
              key={user.user_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-6 rounded-[2.5rem] flex items-center justify-between border transition-all ${
                index === 0 
                ? 'bg-gray-900 text-white shadow-2xl scale-[1.02] border-gray-900' 
                : 'bg-white border-gray-100 hover:border-emerald-200 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-6">
                {/* Rank indicator */}
                <div className="w-10 flex justify-center">
                  {index === 0 && <Crown className="text-amber-400" size={28} />}
                  {index === 1 && <Medal className="text-gray-400" size={24} />}
                  {index === 2 && <Medal className="text-orange-400" size={24} />}
                  {index > 2 && <span className="text-gray-300 font-black text-lg">#{index + 1}</span>}
                </div>

                {/* User Details */}
                <div>
                  <h3 className="font-black text-lg tracking-tight leading-none mb-1">
                    {user.full_name}
                  </h3>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${index === 0 ? 'text-emerald-400/60' : 'text-gray-400'}`}>
                    {user.quizzes_played} Research Rounds
                  </p>
                </div>
              </div>

              {/* Score Display */}
              <div className="text-right">
                <div className={`text-3xl font-black leading-none ${index === 0 ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  {user.average_score}%
                </div>
                <div className="text-[10px] font-black uppercase opacity-40 mt-1 tracking-tighter">Avg Mastery</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}