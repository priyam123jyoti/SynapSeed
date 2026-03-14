"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { generateMoanaQuiz } from '@/services/moanaAI';

// Constants & Components
import { SUBJECT_TOPICS } from '@/components/quiz/constants'; 
import TopicSelectionView from '@/components/quiz/TopicSelectionView';
import QuizEngine from '@/components/quiz/QuizEngine';
import { LoadingScreen } from '@/components/quiz/LoadingScreen';

export default function QuizClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Dynamic URL Params
  const subjectKey = searchParams.get('subject') || 'botany';
  const subjectName = searchParams.get('name') || 'Botany Quiz';
  const queryTopic = searchParams.get('query'); // Potential direct topic start
  
  const subjectTitle = useMemo(() => subjectName.toUpperCase(), [subjectName]);
  
  const currentTopics = useMemo(() => 
    SUBJECT_TOPICS[subjectKey as keyof typeof SUBJECT_TOPICS] || SUBJECT_TOPICS.botany, 
  [subjectKey]);

  const [user, setUser] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true); // Security State
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  // --- THE SECURITY GUARD ---
  useEffect(() => {
    const validateAccess = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        // Kick out unauthorized users
        router.replace('/?error=unauthorized');
        return;
      }

      setUser(user);
      setIsAuthChecking(false);

      // If a 'query' exists in URL, start quiz for that topic automatically
      if (queryTopic && !selectedTopic) {
        handleStartQuiz(queryTopic);
      }
    };
    validateAccess();
  }, [router, queryTopic]);

  const saveQuizScore = useCallback(async (percentage: number) => {
    if (!user) return;
    const { error } = await supabase
      .from('quiz_scores')
      .insert([{ 
        user_id: user.id, 
        score: percentage, 
        topic: selectedTopic || "General", 
        subject: subjectTitle 
      }]);
    if (error) console.error("Database Sync Error:", error.message);
  }, [user, selectedTopic, subjectTitle]);

  const handleStartQuiz = useCallback(async (topic: string) => {
    setLoading(true);
    setSelectedTopic(topic);
    try {
      const data = await generateMoanaQuiz(topic, subjectTitle);
      if (data && Array.isArray(data)) {
        setQuestions(data);
      }
    } catch (err) {
      console.error(err);
      setSelectedTopic(null);
    } finally {
      setLoading(false);
    }
  }, [subjectTitle]);

  // Initial Auth Loading Screen
  if (isAuthChecking) {
    return <LoadingScreen topic="Authenticating Researcher..." />;
  }

  // Quiz Generation Loading Screen
  if (loading) {
    return <LoadingScreen topic={`${subjectTitle}: ${selectedTopic}`} />;
  }

  return (
    <main className="min-h-screen bg-[#020617] relative overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,#0f172a_0%,#020617_100%)] pointer-events-none" />
      <div className="relative z-10">
        {!selectedTopic ? (
          <TopicSelectionView
            subjectTitle={subjectTitle}
            topics={currentTopics} 
            researcherName={user?.user_metadata?.full_name?.split(' ')[0] || "Researcher"}
            onStart={handleStartQuiz}
            onBack={() => router.push('/moana-gateway')}
          />
        ) : (
          <QuizEngine 
            questions={questions}
            subjectTitle={subjectTitle}
            selectedTopic={selectedTopic}
            onRestart={() => { handleStartQuiz(selectedTopic); }}
            onFinishQuiz={(score) => { saveQuizScore(score); }}
            onTerminate={() => {
              setSelectedTopic(null);
              setQuestions([]);
              router.push('/moana-gateway');
            }}
          />
        )}
      </div>
    </main>
  );
}