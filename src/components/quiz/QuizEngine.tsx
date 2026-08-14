"use client";

import React, {
  useState,
  useMemo,
  memo,
  useCallback,
} from "react";

import { QuizInterface } from "./QuizInterface";
import { ResultsModal } from "./ResultsModal";

interface QuizEngineProps {
  questions: any[];
  subjectTitle: string;
  selectedTopic: string;
  onRestart: () => void | Promise<void>;
  onTerminate: () => void;
  onFinishQuiz?: (score: number) => void | Promise<void>;
}

const QuizEngine = ({
  questions,
  subjectTitle,
  selectedTopic,
  onRestart,
  onTerminate,
  onFinishQuiz,
}: QuizEngineProps) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  const [userAnswers, setUserAnswers] = useState<number[]>(() =>
    new Array(questions.length).fill(-1)
  );

  const [showResultsModal, setShowResultsModal] = useState(false);
  const [isRecapMode, setIsRecapMode] = useState(false);

  // ---------------------------------------------------------
  // CALCULATE SCORE
  // ---------------------------------------------------------

  const scorePercentage = useMemo(() => {
    if (questions.length === 0) return 0;

    const correctCount = userAnswers.reduce(
      (total, ans, idx) =>
        ans === questions[idx]?.correct ? total + 1 : total,
      0
    );

    return Math.round((correctCount / questions.length) * 100);
  }, [userAnswers, questions]);

  // ---------------------------------------------------------
  // ANSWER HANDLER
  // ---------------------------------------------------------

  const handleAnswer = useCallback(
    (answerIndex: number) => {
      if (isRecapMode) return;

      setUserAnswers((prev) => {
        const newAnswers = [...prev];
        newAnswers[currentIdx] = answerIndex;
        return newAnswers;
      });
    },
    [currentIdx, isRecapMode]
  );

  // ---------------------------------------------------------
  // NEXT QUESTION
  // ---------------------------------------------------------

  const handleNext = useCallback(() => {
    setCurrentIdx((prev) =>
      Math.min(prev + 1, questions.length - 1)
    );
  }, [questions.length]);

  // ---------------------------------------------------------
  // PREVIOUS QUESTION
  // ---------------------------------------------------------

  const handlePrev = useCallback(() => {
    setCurrentIdx((prev) => Math.max(prev - 1, 0));
  }, []);

  // ---------------------------------------------------------
  // FINISH QUIZ
  // ---------------------------------------------------------

  const handleFinish = useCallback(() => {
    if (onFinishQuiz) {
      onFinishQuiz(scorePercentage);
    }

    setShowResultsModal(true);
  }, [onFinishQuiz, scorePercentage]);

  // ---------------------------------------------------------
  // SAFETY CHECK
  // ---------------------------------------------------------

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white">
        <p className="text-sm text-emerald-400 font-mono uppercase tracking-widest">
          No quiz data available.
        </p>
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8">
      {/* =====================================================
          QUIZ INTERFACE
      ===================================================== */}

      <QuizInterface
        selectedTopic={selectedTopic}
        question={questions[currentIdx]}
        currentIdx={currentIdx}
        totalQuestions={questions.length}
        userAnswer={userAnswers[currentIdx]}
        isRecap={isRecapMode}
        onAnswer={handleAnswer}
        onNext={handleNext}
        onPrev={handlePrev}
        onFinish={handleFinish}
      />

      {/* =====================================================
          RESULTS MODAL
      ===================================================== */}

      {showResultsModal && (
        <ResultsModal
          score={scorePercentage}

          onReview={() => {
            setIsRecapMode(true);
            setShowResultsModal(false);
            setCurrentIdx(0);
          }}

          onTerminate={onTerminate}

          onRestart={() => {
            // Reset current quiz state
            setUserAnswers(
              new Array(questions.length).fill(-1)
            );

            setCurrentIdx(0);
            setIsRecapMode(false);
            setShowResultsModal(false);

            // Generate a fresh quiz
            onRestart();
          }}
        />
      )}
    </div>
  );
};

export default memo(QuizEngine);