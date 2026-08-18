"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

import { SUBJECT_TOPICS } from "@/components/quiz/constants";
import { TopicSelection } from "@/components/quiz/TopicSelection";
import { QuizInterface } from "@/components/quiz/QuizInterface";
import { ResultsModal } from "@/components/quiz/ResultsModal";
import { LoadingScreen } from "@/components/quiz/LoadingScreen";

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ---------------------------------------------------------
  // 1. DYNAMIC SUBJECT LOGIC & CASE NORMALIZATION
  // ---------------------------------------------------------

  // Normalize subject parameter to lowercase to match object keys reliably
  const rawSubject = searchParams.get("subject") || "botany";
  const subjectKey = rawSubject.toLowerCase();

  // Derive display name from subjectKey when name parameter is omitted
  const subjectName =
    searchParams.get("name") ||
    `${subjectKey.charAt(0).toUpperCase() + subjectKey.slice(1)} Quiz`;

  const subjectTitle = useMemo(
    () => subjectName.toUpperCase(),
    [subjectName]
  );

  // Retrieve topics matching subjectKey, defaulting to botany if key is missing
  const currentTopics = useMemo(() => {
    return (
      SUBJECT_TOPICS[subjectKey as keyof typeof SUBJECT_TOPICS] ||
      SUBJECT_TOPICS.botany
    );
  }, [subjectKey]);

  // ---------------------------------------------------------
  // 2. STATE
  // ---------------------------------------------------------

  const [user, setUser] = useState<User | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [isRecapMode, setIsRecapMode] = useState(false);

  // ---------------------------------------------------------
  // 3. AUTH & CLIENT GUARD
  // ---------------------------------------------------------

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.replace("/?error=unauthorized");
        return;
      }

      setUser(user);
    };

    fetchUser();
  }, [router]);

  // Reset quiz state whenever subject route param updates dynamically
  useEffect(() => {
    setSelectedTopic(null);
    setQuestions([]);
    setCurrentIdx(0);
    setUserAnswers([]);
    setShowResultsModal(false);
    setIsRecapMode(false);
  }, [subjectKey]);

  const researcherName =
    user?.user_metadata?.full_name?.split(" ")[0] || "Researcher";

  // ---------------------------------------------------------
  // 4. START QUIZ
  // ---------------------------------------------------------

  const startQuiz = async (topic: string) => {
    setLoading(true);
    setSelectedTopic(topic);

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          subject: subjectTitle,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const result = await res.json();
      const data = result.questions;

      if (data && Array.isArray(data) && data.length > 0) {
        setQuestions(data);
        setCurrentIdx(0);
        setUserAnswers(new Array(data.length).fill(-1));
        setIsRecapMode(false);
        setShowResultsModal(false);
      } else {
        throw new Error("Invalid data format received from AI");
      }
    } catch (err) {
      console.error("❌ QUIZ GENERATION ERROR:", err);
      alert(
        `🚨 NEURAL LINK ERROR: Could not sync ${subjectTitle} data.`
      );
      setSelectedTopic(null);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // 5. SCORE CALCULATION
  // ---------------------------------------------------------

  const scorePercentage =
    questions.length > 0
      ? Math.round(
          (userAnswers.reduce(
            (score, ans, idx) =>
              ans === questions[idx]?.correct ? score + 1 : score,
            0
          ) /
            questions.length) *
            100
        )
      : 0;

  // ---------------------------------------------------------
  // 6. LOADING SCREEN
  // ---------------------------------------------------------

  if (loading) {
    return (
      <LoadingScreen
        topic={`${subjectTitle}: ${selectedTopic}`}
      />
    );
  }

  // ---------------------------------------------------------
  // 7. TOPIC SELECTION
  // ---------------------------------------------------------

  if (!selectedTopic) {
    return (
      <div className="min-h-screen bg-[#020617]">
        <div className="absolute top-6 right-6 z-50 text-emerald-500/50 font-mono text-[10px] uppercase tracking-widest hidden md:block">
          Sector: {subjectTitle} | Op: {researcherName}
        </div>

        <TopicSelection
          subjectTitle={subjectTitle}
          topics={currentTopics}
          onStart={startQuiz}
          onBack={() => router.push("/moana-gateway")}
        />
      </div>
    );
  }

  // ---------------------------------------------------------
  // 8. QUIZ INTERFACE & RESULTS
  // ---------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <QuizInterface
        selectedTopic={selectedTopic}
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
        onNext={() =>
          setCurrentIdx((prev) =>
            Math.min(prev + 1, questions.length - 1)
          )
        }
        onPrev={() =>
          setCurrentIdx((prev) =>
            Math.max(prev - 1, 0)
          )
        }
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
          onTerminate={() => {
            router.push("/moana-gateway");
          }}
          onRestart={() => {
            if (selectedTopic) {
              startQuiz(selectedTopic);
            }
          }}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------
// PAGE WRAPPER
// ---------------------------------------------------------

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      }
    >
      <QuizContent />
    </Suspense>
  );
}