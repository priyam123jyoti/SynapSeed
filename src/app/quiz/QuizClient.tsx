"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { generateMoanaQuiz } from '@/services/moanaAI';

// Constants & Types
import { SUBJECT_TOPICS } from '@/components/quiz/constants'; 

// Components
import TopicSelectionView from '@/components/quiz/TopicSelectionView';
import QuizEngine from '@/components/quiz/QuizEngine';
import { LoadingScreen } from '@/components/quiz/LoadingScreen';

export default function QuizClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 1. MEMOIZED URL PARAMS
  const subjectKey = searchParams.get('subject') || 'botany';
  const subjectName = searchParams.get('name') || 'Botany Quiz';
  const subjectTitle = useMemo(() => subjectName.toUpperCase(), [subjectName]);
  
  const currentTopics = useMemo(() => 
    SUBJECT_TOPICS[subjectKey as keyof typeof SUBJECT_TOPICS] || SUBJECT_TOPICS.botany, 
  [subjectKey]);

  // 2. STATE MANAGEMENT
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  // 3. AUTHENTICATION FETCH
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const researcherName = useMemo(() => 
    user?.user_metadata?.full_name?.split(' ')[0] || "Researcher", 
  [user]);

  // 4. QUIZ GENERATION & SEO URL UPDATE
  const startQuiz = useCallback(async (topic: string) => {
    setLoading(true);
    setSelectedTopic(topic);

    // SEO BOOST: Update the browser URL without refreshing the page. 
    // This allows students to bookmark specific topic results.
    const params = new URLSearchParams(window.location.search);
    params.set('topic', topic.toLowerCase().replace(/\s+/g, '-'));
    window.history.pushState(null, '', `?${params.toString()}`);

    try {
      const data = await generateMoanaQuiz(topic, subjectTitle);
      if (data && Array.isArray(data) && data.length > 0) {
        setQuestions(data);
      } else {
        throw new Error("NEURAL_DATA_VOID");
      }
    } catch (err) {
      console.error("Moana AI Error:", err);
      alert(`NEURAL LINK ERROR: Unable to generate questions for ${topic}. Check connection.`);
      setSelectedTopic(null);
    } finally {
      setLoading(false);
    }
  }, [subjectTitle]);

  // 5. VIEW ROUTER
  if (loading) return <LoadingScreen topic={`${subjectTitle}: ${selectedTopic}`} />;

  return (
    <main className="min-h-screen bg-[#020617] relative overflow-hidden">
      {/* SEMANTIC SEO: Hidden H1 for crawler context */}
      <h1 className="sr-only">
        {subjectTitle} Interactive Practice Lab | Powered by Moana AI
      </h1>

      {/* Static Background Layer */}
      <div 
        className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,#0f172a_0%,#020617_100%)] pointer-events-none" 
        aria-hidden="true"
      />

      <div className="relative z-10">
        {!selectedTopic ? (
          <TopicSelectionView
            subjectTitle={subjectTitle}
            topics={currentTopics} 
            researcherName={researcherName}
            onStart={startQuiz}
            onBack={() => router.push('/moana-gateway')}
          />
        ) : (
          <QuizEngine 
            questions={questions}
            subjectTitle={subjectTitle}
            selectedTopic={selectedTopic}
            onRestart={() => startQuiz(selectedTopic)}
            onTerminate={() => {
              // Clear topic from URL when terminating
              router.push('/moana-gateway');
            }}
          />
        )}
      </div>

      {/* SEO FOOTER: Contextual Internal Links */}
      {!selectedTopic && (
        <footer className="relative z-20 pb-10 text-center opacity-50 hover:opacity-100 transition-opacity">
          <p className="text-emerald-500/50 font-mono text-[10px] tracking-[0.3em] mb-4">
            SY_SEED // AUTHORIZED_ACCESS_ONLY
          </p>
          <div className="flex justify-center gap-8">
            <button 
              onClick={() => router.push('/synapstore')}
              className="text-white font-mono text-[9px] hover:text-emerald-400 transition-colors"
            >
              [ ACCESS_SYNAPSTORE_HARDWARE ]
            </button>
            <button 
              onClick={() => router.push('/about')}
              className="text-white font-mono text-[9px] hover:text-emerald-400 transition-colors"
            >
              [ DEVELOPER_PRIYAMJYOTI_DIHINGIA ]
            </button>
          </div>
        </footer>
      )}
    </main>
  );
}