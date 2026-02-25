"use client";

import React, { useState, useEffect, Suspense, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { generateMoanaQuiz } from '@/services/moanaAI';

// Constants & Types
import { SUBJECT_TOPICS } from '@/components/quiz/constants'; 

// Components
import TopicSelectionView from '@/components/quiz/TopicSelectionView';
import QuizEngine from '@/components/quiz/QuizEngine';
import { LoadingScreen } from '@/components/quiz/LoadingScreen';

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const subjectKey = searchParams.get('subject') || 'botany';
  const subjectName = searchParams.get('name') || 'Botany Quiz';
  const autoQuery = searchParams.get('query'); 
  
  const subjectTitle = useMemo(() => subjectName.toUpperCase(), [subjectName]);
  
  const currentTopics = useMemo(() => 
    SUBJECT_TOPICS[subjectKey as keyof typeof SUBJECT_TOPICS] || SUBJECT_TOPICS.botany, 
  [subjectKey]);

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

  // --- NEW: SAVE SCORE TO DATABASE ---
  const saveQuizScore = useCallback(async (percentage: number) => {
    if (!user) {
      console.warn("User not logged in, score not saved to leaderboard.");
      return;
    }

    const { error } = await supabase
      .from('quiz_scores') // Matches the table we created in SQL
      .insert([
        { 
          user_id: user.id, 
          score: percentage, 
          topic: selectedTopic || autoQuery || "General", 
          subject: subjectTitle 
        }
      ]);

    if (error) {
      console.error("Failed to sync mastery level:", error.message);
    } else {
      console.log("Mastery level synced to Global Leaderboard!");
    }
  }, [user, selectedTopic, autoQuery, subjectTitle]);

  const researcherName = useMemo(() => 
    user?.user_metadata?.full_name?.split(' ')[0] || "Researcher", 
  [user]);

  const startQuiz = useCallback(async (topic: string) => {
    setLoading(true);
    setSelectedTopic(topic);
    try {
      const data = await generateMoanaQuiz(topic, subjectTitle);
      if (data && Array.isArray(data) && data.length > 0) {
        setQuestions(data);
      } else {
        throw new Error("Neural Link Failed: Data Corrupted");
      }
    } catch (err) {
      console.error(err);
      alert(`NEURAL LINK ERROR: Unable to generate questions for ${topic}.`);
      setSelectedTopic(null);
    } finally {
      setLoading(false);
    }
  }, [subjectTitle]);

  useEffect(() => {
    if (autoQuery && !selectedTopic && !loading && questions.length === 0) {
      startQuiz(autoQuery);
      const newPath = `/quiz?subject=${subjectKey}&name=${subjectName}`;
      window.history.replaceState(null, '', newPath);
    }
  }, [autoQuery, startQuiz, selectedTopic, loading, questions.length, subjectKey, subjectName]);

  if (loading) return <LoadingScreen topic={`${subjectTitle}: ${selectedTopic || autoQuery}`} />;

  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,#0f172a_0%,#020617_100%)] pointer-events-none" />

      {!selectedTopic ? (
        <TopicSelectionView
          subjectTitle={subjectTitle}
          topics={currentTopics} 
          researcherName={researcherName}
          onStart={startQuiz}
          onBack={() => router.push('/')}
        />
      ) : (
        <QuizEngine 
          questions={questions}
          subjectTitle={subjectTitle}
          selectedTopic={selectedTopic}
          onRestart={() => startQuiz(selectedTopic)}
          onFinishQuiz={saveQuizScore} // Passing the save function here
          onTerminate={() => {
            setSelectedTopic(null);
            setQuestions([]);
          }}
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