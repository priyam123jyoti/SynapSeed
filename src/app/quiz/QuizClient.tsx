"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { supabase } from "@/lib/supabase";

import { SUBJECT_TOPICS } from "@/components/quiz/constants";
import TopicSelectionView from "@/components/quiz/TopicSelectionView";
import QuizEngine from "@/components/quiz/QuizEngine";
import { LoadingScreen } from "@/components/quiz/LoadingScreen";

export default function QuizClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // =========================================================
  // 1. SUBJECT FROM URL
  // =========================================================

  const subjectParam = searchParams.get("subject");

  // Keep Botany as the fallback only when no subject is supplied.
  const subjectKey =
    subjectParam && subjectParam in SUBJECT_TOPICS
      ? subjectParam
      : "botany";

  // Never default the NAME to Botany.
  // If ?name= is missing, derive it from subjectKey.
  const subjectName =
    searchParams.get("name") ||
    `${subjectKey.charAt(0).toUpperCase() + subjectKey.slice(1)} Quiz`;

  const subjectTitle = useMemo(
    () => subjectName.toUpperCase(),
    [subjectName]
  );

  // =========================================================
  // 2. TOPICS FOR CURRENT SUBJECT
  // =========================================================

  const currentTopics = useMemo(() => {
    return SUBJECT_TOPICS[
      subjectKey as keyof typeof SUBJECT_TOPICS
    ];
  }, [subjectKey]);

  // =========================================================
  // 3. STATE
  // =========================================================

  const [user, setUser] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const [loading, setLoading] = useState(false);

  const [selectedTopic, setSelectedTopic] =
    useState<string | null>(null);

  const [questions, setQuestions] = useState<any[]>([]);

  // =========================================================
  // 4. DEBUG
  // =========================================================

  useEffect(() => {
    console.log("🔥 QUIZ URL DEBUG:", {
      fullURL: window.location.href,
      subjectParam,
      nameParam: searchParams.get("name"),
      subjectKey,
      subjectName,
      subjectTitle,
      topicCount: currentTopics.length,
    });
  }, [
    subjectParam,
    subjectKey,
    subjectName,
    subjectTitle,
    currentTopics.length,
    searchParams,
  ]);

  // =========================================================
  // 5. START QUIZ
  // =========================================================

  const handleStartQuiz = useCallback(
    async (topic: string) => {
      setLoading(true);
      setSelectedTopic(topic);
      setQuestions([]);

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
            subject: subjectTitle,
            topic: topic,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);

          throw new Error(
            errorData?.error ||
              `Server error: ${res.status}`
          );
        }

        const result = await res.json();
        const data = result.questions;

        if (
          data &&
          Array.isArray(data) &&
          data.length > 0
        ) {
          setQuestions(data);
        } else {
          throw new Error(
            "Invalid question format received from AI"
          );
        }
      } catch (error) {
        console.error(
          "❌ MOANA_SYNC_FAILURE:",
          error
        );

        setSelectedTopic(null);
        setQuestions([]);

        alert(
          `KAKU could not generate the ${subjectTitle} quiz for "${topic}".`
        );
      } finally {
        setLoading(false);
      }
    },
    [
      subjectKey,
      subjectName,
      subjectTitle,
    ]
  );

  // =========================================================
  // 6. SAVE SCORE
  // =========================================================

  const saveQuizScore = useCallback(
    async (percentage: number) => {
      if (!user || !selectedTopic) return;

      const { error } = await supabase
        .from("quiz_scores")
        .insert([
          {
            user_id: user.id,
            score: percentage,
            topic: selectedTopic,
            subject: subjectTitle,
          },
        ]);

      if (error) {
        console.error(
          "❌ QUIZ SCORE SAVE ERROR:",
          error
        );
      }
    },
    [user, selectedTopic, subjectTitle]
  );

  // =========================================================
  // 7. AUTHENTICATION
  // =========================================================

  useEffect(() => {
    const validateAccess = async () => {
      const {
        data: { user: authUser },
        error,
      } = await supabase.auth.getUser();

      if (error || !authUser) {
        router.replace(
          "/?error=unauthorized"
        );
        return;
      }

      setUser(authUser);
      setIsAuthChecking(false);
    };

    validateAccess();
  }, [router]);

  // =========================================================
  // 8. AUTH LOADING
  // =========================================================

  if (isAuthChecking) {
    return (
      <LoadingScreen
        topic="Authenticating..."
      />
    );
  }

  // =========================================================
  // 9. QUIZ GENERATION LOADING
  // =========================================================

  if (loading) {
    return (
      <LoadingScreen
        topic={`${subjectTitle}: ${selectedTopic}`}
      />
    );
  }

  // =========================================================
  // 10. MAIN UI
  // =========================================================

  return (
    <main className="min-h-screen bg-[#020617] relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,#0f172a_0%,#020617_100%)] pointer-events-none" />

      <div className="relative z-10">
        {/* =====================================================
            TOPIC SELECTION
        ===================================================== */}

        {!selectedTopic ? (
          <TopicSelectionView
            subjectTitle={subjectTitle}
            topics={currentTopics}
            researcherName={
              user?.user_metadata?.full_name?.split(" ")[0] ||
              "Researcher"
            }
            onStart={handleStartQuiz}
            onBack={() =>
              router.push(
                "/moana-ai-unlimited-quiz-generator"
              )
            }
          />
        ) : (

        /* =====================================================
           QUIZ ENGINE
        ===================================================== */

          <QuizEngine
            questions={questions}
            subjectTitle={subjectTitle}
            selectedTopic={selectedTopic}

            onRestart={() =>
              handleStartQuiz(selectedTopic)
            }

            onFinishQuiz={(score) =>
              saveQuizScore(score)
            }

            onTerminate={() => {
              setSelectedTopic(null);
              setQuestions([]);

              router.push(
                "/moana-ai-unlimited-quiz-generator"
              );
            }}
          />
        )}
      </div>
    </main>
  );
}