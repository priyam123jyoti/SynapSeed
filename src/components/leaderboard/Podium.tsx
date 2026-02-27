"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Sparkles, Target } from 'lucide-react';

export const Podium = ({ topThree }: { topThree: any[] }) => {
  const data = [
    { rank: 2, user: topThree[1], color: "bg-[#8E443D]", crownColor: "text-slate-300", h: "h-40 lg:h-64", order: "order-1" },
    { rank: 1, user: topThree[0], color: "bg-[#4F6D7A]", crownColor: "text-amber-400", h: "h-60 lg:h-96", order: "order-2", win: true },
    { rank: 3, user: topThree[2], color: "bg-[#CD7F32]", crownColor: "text-[#CD7F32]", h: "h-32 lg:h-48", order: "order-3" },
  ];

  return (
    <div className="flex items-end justify-center gap-3 lg:gap-6 pt-10">
      {data.map((item) => {
        if (!item.user) return null;
        return (
          <div key={item.user.user_id} className={`flex flex-col items-center flex-1 ${item.order}`}>
            
            {/* Crown & Info */}
            <div className="text-center mb-4">
              {item.win && (
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }} 
                  className="relative"
                >
                   <Sparkles className="text-amber-400 absolute -top-8 -left-4 opacity-50" size={40} />
                </motion.div>
              )}
              
              <Crown 
                className={`${item.crownColor} ${item.win ? 'scale-125' : ''} mx-auto mb-2`} 
                fill="currentColor" 
                size={item.win ? 32 : 24} 
              />
              
              <h3 className="text-[10px] lg:text-sm font-black uppercase truncate max-w-[80px] lg:max-w-full leading-tight">
                {item.user.full_name}
              </h3>
              
              <div className="flex flex-col items-center mt-1">
                <p className="text-xs lg:text-2xl font-black leading-none">
                  {item.user.average_score}%
                </p>
                <p className="text-[7px] lg:text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1 mt-1 tracking-tighter">
                  <Target size={8} className="lg:w-3 lg:h-3" />
                  {item.user.quizzes_played} Rounds
                </p>
              </div>
            </div>

            {/* BAR: Fixed Rectangles */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              className={`${item.color} ${item.h} w-full text-center justify-center items-center rounded-[3px] shadow-2xl flex pt-4 lg:pt-8`}
            >
              <span className="text-2xl lg:text-6xl font-black text-white/20 italic select-none">
                {item.rank}
              </span>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};