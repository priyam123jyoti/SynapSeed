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
  
  // 1. EXTRACT URL PARAMETERS
  const subjectKey = searchParams.get('subject') || 'botany';
  const subjectName = searchParams.get('name') || 'Botany Quiz';
  const autoQuery = searchParams.get('query'); // The "Auto-Start" trigger
  
  const subjectTitle = useMemo(() => subjectName.toUpperCase(), [subjectName]);
  
  // Map the topics based on the subject in the URL
  const currentTopics = useMemo(() => 
    SUBJECT_TOPICS[subjectKey as keyof typeof SUBJECT_TOPICS] || SUBJECT_TOPICS.botany, 
  [subjectKey]);

  // 2. STATE MANAGEMENT
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  // Fetch User Profile on Mount
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

  // 3. STABLE QUIZ GENERATION FUNCTION
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

  // 4. THE INTERACTIVITY BRIDGE (Auto-Start + URL Cleanup)
  useEffect(() => {
    if (autoQuery && !selectedTopic && !loading && questions.length === 0) {
      // Trigger the AI generation
      startQuiz(autoQuery);

      /**
       * CRITICAL UI FIX: 
       * We clear the 'query' from the URL bar immediately after starting.
       * This prevents the useEffect from re-triggering when the user 
       * clicks 'Abort' or finishes the quiz.
       */
      const newPath = `/quiz?subject=${subjectKey}&name=${subjectName}`;
      window.history.replaceState(null, '', newPath);
    }
  }, [autoQuery, startQuiz, selectedTopic, loading, questions.length, subjectKey, subjectName]);

  // 5. RENDER LOGIC
  if (loading) return <LoadingScreen topic={`${subjectTitle}: ${selectedTopic || autoQuery}`} />;

  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden">
      {/* Background Neural Layer */}
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
          onTerminate={() => {
            // Because the URL query was cleaned by the useEffect above,
            // this will now correctly return to TopicSelectionView.
            setSelectedTopic(null);
            setQuestions([]);
          }}
        />
      )}
    </div>
  );
}

// Wrap in Suspense for Next.js 14+ SearchParams requirement
export default function QuizPage() {
  return (
    <Suspense fallback={<LoadingScreen topic="Initializing Neural Link..." />}>
      <QuizContent />
    </Suspense>
  );
}