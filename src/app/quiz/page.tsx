"use client";

import React, { useState, useEffect, Suspense, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { generateMoanaQuiz } from '@/services/moanaAI';

// Constants & Types
import { SUBJECT_TOPICS } from '@/components/quiz/constants'; 

// Components (We will create/refactor these in Phase 2)
import TopicSelectionView from '@/components/quiz/TopicSelectionView';
import QuizEngine from '@/components/quiz/QuizEngine';
import { LoadingScreen } from '@/components/quiz/LoadingScreen';

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 1. MEMOIZED URL PARAMS: Prevents recalculating strings on every render
  const subjectKey = searchParams.get('subject') || 'botany';
  const subjectName = searchParams.get('name') || 'Botany Quiz';
  const subjectTitle = useMemo(() => subjectName.toUpperCase(), [subjectName]);
  
  const currentTopics = useMemo(() => 
    SUBJECT_TOPICS[subjectKey as keyof typeof SUBJECT_TOPICS] || SUBJECT_TOPICS.botany, 
  [subjectKey]);

  // 2. AUTH STATE
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);

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

  // 3. STABLE QUIZ GENERATION: Wrapped in useCallback to prevent child re-renders
  const startQuiz = useCallback(async (topic: string) => {
    setLoading(true);
    setSelectedTopic(topic);
    try {
      const data = await generateMoanaQuiz(topic, subjectTitle);
      if (data && Array.isArray(data) && data.length > 0) {
        setQuestions(data);
      } else {
        throw new Error("Empty Data");
      }
    } catch (err) {
      console.error(err);
      alert(`NEURAL LINK ERROR: Check connection.`);
      setSelectedTopic(null);
    } finally {
      setLoading(false);
    }
  }, [subjectTitle]);

  // 4. VIEW ROUTER LOGIC
  if (loading) return <LoadingScreen topic={`${subjectTitle}: ${selectedTopic}`} />;

  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden">
      {/* Static Background Layer - Never re-renders */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,#0f172a_0%,#020617_100%)] pointer-events-none" />

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
          onTerminate={() => router.push('/moana-gateway')}
        />
      )}
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<LoadingScreen topic="Initializing Neural Link..." />}>
      <QuizContent />
    </Suspense>
  );
}