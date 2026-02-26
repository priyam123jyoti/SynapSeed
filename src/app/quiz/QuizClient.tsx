"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { generateMoanaQuiz } from '@/services/moanaAI';

// Components
import TopicSelectionView from '@/components/quiz/TopicSelectionView';
import QuizEngine from '@/components/quiz/QuizEngine';
import { LoadingScreen } from '@/components/quiz/LoadingScreen';
import { SUBJECT_TOPICS } from '@/components/quiz/constants'; 

export default function QuizClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const subjectKey = searchParams.get('subject') || 'botany';
  const subjectName = searchParams.get('name') || 'Botany Quiz';
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

  const saveQuizScore = useCallback(async (percentage: number) => {
    if (!user) return;
    const { error } = await supabase
      .from('quiz_scores')
      .insert([
        { 
          user_id: user.id, 
          score: percentage, 
          topic: selectedTopic || "General", 
          subject: subjectTitle 
        }
      ]);

    if (error) console.error("Database Sync Error:", error.message);
    else console.log("Mastery Level Synced!");
  }, [user, selectedTopic, subjectTitle]);

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
        throw new Error("NEURAL_DATA_VOID");
      }
    } catch (err) {
      console.error(err);
      setSelectedTopic(null);
    } finally {
      setLoading(false);
    }
  }, [subjectTitle]);

  if (loading) return <LoadingScreen topic={`${subjectTitle}: ${selectedTopic}`} />;

  return (
    <main className="min-h-screen bg-[#020617] relative overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,#0f172a_0%,#020617_100%)] pointer-events-none" />
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
            onFinishQuiz={saveQuizScore}
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