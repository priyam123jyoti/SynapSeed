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
  
  // URL Params parsing
  const subjectKey = searchParams.get('subject') || 'botany';
  const subjectName = searchParams.get('name') || 'Botany Quiz';
  const queryTopic = searchParams.get('query'); 
  
  const subjectTitle = useMemo(() => subjectName.toUpperCase(), [subjectName]);
  
  const currentTopics = useMemo(() => 
    SUBJECT_TOPICS[subjectKey as keyof typeof SUBJECT_TOPICS] || SUBJECT_TOPICS.botany, 
  [subjectKey]);

  const [user, setUser] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  // --- AUTH & INITIALIZATION ---
  useEffect(() => {
    const validateAccess = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        router.replace('/?error=unauthorized');
        return;
      }

      setUser(user);
      setIsAuthChecking(false);

      // Auto-start if query exists
      if (queryTopic && !selectedTopic) {
        handleStartQuiz(queryTopic);
      }
    };
    validateAccess();
  }, [router, queryTopic]);

  // --- SCORE SYNC TO DATABASE ---
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
    
    if (error) console.error("MOANA_DATABASE_SYNC_ERROR:", error.message);
  }, [user, selectedTopic, subjectTitle]);

  // --- QUIZ GENERATION HANDLER ---
  const handleStartQuiz = useCallback(async (topic: string) => {
    setLoading(true);
    setSelectedTopic(topic);
    setQuestions([]); // Clear previous state
    
    try {
      const data = await generateMoanaQuiz(topic, subjectTitle);
      
      // Ensure we received a valid array from Script 1
      if (data && Array.isArray(data) && data.length > 0) {
        setQuestions(data);
      } else {
        throw new Error("Invalid question format received from Neural Link");
      }
    } catch (err) {
      console.error("MOANA_SYNC_FAILURE:", err);
      setSelectedTopic(null);
    } finally {
      setLoading(false);
    }
  }, [subjectTitle]);

  if (isAuthChecking) {
    return <LoadingScreen topic="Authenticating Researcher..." />;
  }

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
            onRestart={() => handleStartQuiz(selectedTopic)}
            onFinishQuiz={(score) => saveQuizScore(score)}
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