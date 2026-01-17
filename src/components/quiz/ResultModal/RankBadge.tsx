"use client";
import React, { memo } from 'react';
import { Sparkles } from 'lucide-react';

export const RankBadge = memo(({ title, color, bg }: { title: string; color: string; bg: string }) => (
  <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full ${bg} ${color} mb-8 border border-current/20`}>
    <Sparkles size={14} className="animate-pulse" />
    <span className="text-[10px] font-black tracking-[0.2em] uppercase">{title}</span>
  </div>
));