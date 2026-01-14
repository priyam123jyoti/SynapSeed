"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { generateMoanaQuiz } from '@/services/moanaAI';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// Keeping your specific component imports
import { SUBJECT_TOPICS } from '@/components/quiz/constants'; 
import { TopicSelection } from '@/components/quiz/TopicSelection';
import { QuizInterface } from '@/components/quiz/QuizInterface';
import { ResultsModal } from '@/components/quiz/ResultsModal';
import { LoadingScreen } from '@/components/quiz/LoadingScreen';

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // --- DYNAMIC SUBJECT LOGIC (Next.js Style) ---
  // In Next.js, we get these from the URL: /quiz?subject=physics
  const subjectKey = searchParams.get('subject') || 'botany';
  const subjectTitle = (subjectKey.charAt(0).toUpperCase() + subjectKey.slice(1) + " Quiz").toUpperCase();
  const currentTopics = SUBJECT_TOPICS[subjectKey as keyof typeof SUBJECT_TOPICS] || SUBJECT_TOPICS.botany;

  // --- STATE MANAGEMENT ---
  const [user, setUser] = useState<User | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [isRecapMode, setIsRecapMode] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const researcherName = user?.user_metadata?.full_name?.split(' ')[0] || "Researcher";

  // --- CORE LOGIC (Conceptually identical to your Vite version) ---
  const startQuiz = async (topic: string) => {
    setLoading(true);
    setSelectedTopic(topic);
    try {
      const data = await generateMoanaQuiz(topic, subjectTitle);
      if (data && data.length > 0) {
        setQuestions(data);
        setCurrentIdx(0);
        setUserAnswers(new Array(data.length).fill(-1));
        setIsRecapMode(false);
        setShowResultsModal(false);
      }
    } catch (err) {
      console.error(err);
      alert(`🚨 NEURAL LINK ERROR: Could not sync ${subjectTitle} data.`);
      setSelectedTopic(null);
    } finally {
      setLoading(false);
    }
  };

  const scorePercentage = Math.round(
    (userAnswers.reduce((score, ans, idx) =>
      ans === questions[idx]?.correct ? score + 1 : score, 0
    ) / (questions.length || 1)) * 100
  );

  if (loading) return <LoadingScreen topic={`${subjectTitle}: ${selectedTopic}`} />;

  if (!selectedTopic) {
    return (
      <div className="min-h-screen bg-[#020617]">
        <div className="absolute top-6 right-6 z-50 text-emerald-500/50 font-mono text-[10px] uppercase tracking-widest">
          Sector: {subjectTitle} | Op: {researcherName}
        </div>
        <TopicSelection
          subjectTitle={subjectTitle}
          topics={currentTopics} 
          onStart={startQuiz}
          onBack={() => router.push('/moana-gateway')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <QuizInterface
        subjectLabel={subjectTitle} 
        question={questions[currentIdx]}
        currentIdx={currentIdx}
        totalQuestions={questions.length}
        userAnswer={userAnswers[currentIdx]}
        isRecap={isRecapMode}
        onAnswer={(i) => {
          if (isRecapMode) return;
          const updatedAnswers = [...userAnswers];
          updatedAnswers[currentIdx] = i;
          setUserAnswers(updatedAnswers);
        }}
        onNext={() => setCurrentIdx(prev => Math.min(prev + 1, questions.length - 1))}
        onPrev={() => setCurrentIdx(prev => Math.max(prev - 1, 0))}
        onFinish={() => setShowResultsModal(true)}
      />

      {showResultsModal && (
        <ResultsModal
          score={scorePercentage}
          onReview={() => {
            setIsRecapMode(true);
            setShowResultsModal(false);
            setCurrentIdx(0);
          }}
          onTerminate={() => router.push('/moana-gateway')}
          onRestart={() => startQuiz(selectedTopic)}
        />
      )}
    </div>
  );
}

// Next.js 15 requires useSearchParams to be inside a Suspense boundary
export default function QuizPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617]" />}>
      <QuizContent />
    </Suspense>
  );
}