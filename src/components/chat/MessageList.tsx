"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export const MessageList = ({ messages, isLoading, scrollRef }: MessageListProps) => (
  <main 
    ref={scrollRef} 
    className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar z-10 scroll-smooth"
  >
    <AnimatePresence initial={false}>
      {messages.map((msg, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2 }}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border shadow-[0_0_10px_rgba(14,165,233,0.2)] ${
              msg.role === 'user' 
                ? 'bg-sky-900/30 border-sky-500 text-sky-400' 
                : 'bg-blue-900/30 border-blue-500 text-blue-400'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user' 
                ? 'bg-sky-600/20 border border-sky-500/30 text-sky-50' 
                : 'bg-slate-800/50 border border-slate-700 text-slate-100 shadow-inner'
            }`}>
              {msg.text}
            </div>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
    
    {isLoading && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-3"
      >
        <div className="w-8 h-8 rounded-full bg-blue-900/30 border border-blue-500 flex items-center justify-center text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
          <Bot size={16} />
        </div>
        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl flex items-center gap-3">
          <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
          <span className="text-[10px] tracking-widest text-slate-400 uppercase font-bold">
            Processing Neural Link...
          </span>
        </div>
      </motion.div>
    )}
  </main>
);