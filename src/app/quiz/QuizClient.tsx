"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { generateMoanaQuiz } from '@/services/moanaAI';

import { SUBJECT_TOPICS } from '@/components/quiz/constants'; 
import TopicSelectionView from '@/components/quiz/TopicSelectionView';
import QuizEngine from '@/components/quiz/QuizEngine';
import { LoadingScreen } from '@/components/quiz/LoadingScreen';

export default function QuizClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const subjectKey = searchParams.get('subject') || 'botany';
  // SEO Fix: If 'name' is missing, we prettify the subjectKey (e.g., 'botany' -> 'BOTANY QUIZ')
  const subjectName = searchParams.get('name') || `${subjectKey.charAt(0).toUpperCase() + subjectKey.slice(1)} Quiz`;
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

  useEffect(() => {
    const validateAccess = async () => {
      const { data: { user: authUser }, error } = await supabase.auth.getUser();

      if (error || !authUser) {
        router.replace('/?error=unauthorized');
        return;
      }

      setUser(authUser);
      setIsAuthChecking(false);

      if (queryTopic && !selectedTopic) {
        handleStartQuiz(queryTopic);
      }
    };
    validateAccess();
  }, [router, queryTopic, selectedTopic]); // Added selectedTopic to deps for safety

  const saveQuizScore = useCallback(async (percentage: number) => {
    if (!user) return;
    await supabase
      .from('quiz_scores')
      .insert([{ 
        user_id: user.id, 
        score: percentage, 
        topic: selectedTopic || "General", 
        subject: subjectTitle 
      }]);
  }, [user, selectedTopic, subjectTitle]);

  const handleStartQuiz = useCallback(async (topic: string) => {
    setLoading(true);
    setSelectedTopic(topic);
    setQuestions([]); 
    
    try {
      const data = await generateMoanaQuiz(topic, subjectTitle);
      if (data && Array.isArray(data) && data.length > 0) {
        setQuestions(data);
      } else {
        throw new Error("Invalid question format");
      }
    } catch (err) {
      console.error("MOANA_SYNC_FAILURE:", err);
      setSelectedTopic(null);
    } finally {
      setLoading(false);
    }
  }, [subjectTitle]);

  if (isAuthChecking) return <LoadingScreen topic="Authenticating..." />;
  if (loading) return <LoadingScreen topic={`${subjectTitle}: ${selectedTopic}`} />;

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
            onBack={() => router.push('/moana-ai-unlimited-quiz-generator')}
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
              router.push('/moana-ai-unlimited-quiz-generator');
            }}
          />
        )}
      </div>
    </main>
  );
}