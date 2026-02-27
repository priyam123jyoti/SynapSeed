"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export const RankList = ({ others }: { others: any[] }) => {
  return (
    <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] lg:rounded-[1.5rem] p-4 lg:p-10 border border-white/30 shadow-2xl">
      <div className="flex items-center justify-between mb-8 px-4">
        <h3 className="font-black uppercase tracking-widest text-xs">Hall of Fame</h3>
        <span className="text-[10px] font-bold opacity-50 uppercase">{others.length} Contenders</span>
      </div>

      <div className="space-y-3">
        {others.map((user, index) => (
          <motion.div
            key={user.user_id}
            whileHover={{ x: 10 }}
            className="group flex items-center justify-between p-4 lg:p-6 bg-white rounded-[1.2rem] lg:rounded-[1.5rem] transition-all hover:bg-[#2D3142] hover:text-white shadow-sm"
          >
            <div className="flex items-center gap-4 lg:gap-6">
              <span className="text-xs lg:text-sm font-black opacity-30 group-hover:opacity-100">
                {(index + 4).toString().padStart(2, '0')}
              </span>
              <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-[#D4E4BC] group-hover:bg-white/20 flex items-center justify-center font-black text-[#2D3142] group-hover:text-white text-sm lg:text-lg uppercase">
                {user.full_name.charAt(0)}
              </div>
              <div>
                <h4 className="font-black text-xs lg:text-xl leading-tight">{user.full_name}</h4>
                <p className="text-[8px] lg:text-[10px] font-bold opacity-50 uppercase">{user.quizzes_played} rounds</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm lg:text-2xl font-black">{user.average_score}%</p>
                <p className="text-[7px] lg:text-[9px] font-black uppercase opacity-50">Mastery</p>
              </div>
              <ChevronRight className="opacity-0 group-hover:opacity-100 transition-all -ml-2" size={20} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};