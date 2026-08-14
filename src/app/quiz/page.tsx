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
  // 1. DYNAMIC SUBJECT LOGIC
  // ---------------------------------------------------------

  const subjectKey = searchParams.get("subject") || "botany";

  // IMPORTANT:
  // Never default the display name to "Botany Quiz".
  // Derive it from subjectKey when name is missing.
  const subjectName =
    searchParams.get("name") ||
    `${subjectKey.charAt(0).toUpperCase() + subjectKey.slice(1)} Quiz`;

  const subjectTitle = useMemo(
    () => subjectName.toUpperCase(),
    [subjectName]
  );

  // Get topics belonging to the selected subject.
  // Only fall back to Botany if an invalid subjectKey is supplied.
  const currentTopics = useMemo(() => {
    return (
      SUBJECT_TOPICS[
        subjectKey as keyof typeof SUBJECT_TOPICS
      ] || SUBJECT_TOPICS.botany
    );
  }, [subjectKey]);

  // ---------------------------------------------------------
  // DEBUGGING
  // ---------------------------------------------------------

  console.log("🔥 QUIZ URL DEBUG:", {
    fullURL: window.location.href,
    subjectParam: searchParams.get("subject"),
    nameParam: searchParams.get("name"),
    subjectKey,
    subjectName,
    subjectTitle,
    topicCount: currentTopics.length,
  });

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
  // 3. AUTH
  // ---------------------------------------------------------

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    fetchUser();
  }, []);

  const researcherName =
    user?.user_metadata?.full_name?.split(" ")[0] || "Researcher";

  // ---------------------------------------------------------
  // 4. START QUIZ
  // ---------------------------------------------------------

  const startQuiz = async (topic: string) => {
    setLoading(true);
    setSelectedTopic(topic);

    console.log("🚀 QUIZ REQUEST:", {
      subjectKey,
      subjectName,
      subjectTitle,
      topic,
    });

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
        `🚨 NEURAL LINK ERROR: KAKU could not sync ${subjectTitle} data.`
      );

      setSelectedTopic(null);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // 5. SCORE
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
  // 6. LOADING
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
  // 8. QUIZ INTERFACE
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