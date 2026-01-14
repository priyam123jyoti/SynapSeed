"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { startJarvisChat } from '@/services/moanaAI';

import { ChatHeader } from '@/components/chat/ChatHeader';
import { MessageList } from '@/components/chat/MessageList';
import { ChatInput } from '@/components/chat/ChatInput';

function AIHubContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const modeId = searchParams.get('mode') || 'careers';

  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [jarvis, setJarvis] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const instance = startJarvisChat(modeId);
    setJarvis(instance);
    setMessages([{ role: 'model', text: instance.introMessage }]);
  }, [modeId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    if (isLoading || !jarvis) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'model' ? 'assistant' : 'user',
        content: m.text
      }));
      const response = await jarvis.sendMessage(text, history);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "🚨 PROTOCOL ERROR: Neural link failed." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col font-mono relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05)_0%,transparent_70%)] pointer-events-none" />

      <ChatHeader modeId={modeId} onExit={() => router.push('/gateway')} />

      <MessageList messages={messages} isLoading={isLoading} scrollRef={scrollRef} />

      <ChatInput onSend={handleSend} isLoading={isLoading} />

      <p className="text-center text-[10px] text-slate-600 mb-2 tracking-widest uppercase">
        Neural Link v2.0 by Priyam
      </p>
    </div>
  );
}

export default function AIHub() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-pulse text-sky-400 font-mono">INITIALIZING NEURAL LINK...</div>
      </div>
    }>
      <AIHubContent />
    </Suspense>
  );
}