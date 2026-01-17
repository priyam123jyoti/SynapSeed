"use client";

import React, { useState, useMemo, memo, useCallback } from 'react';
import { QuizInterface } from './QuizInterface';
import { ResultsModal } from './ResultsModal';

interface QuizEngineProps {
  questions: any[];
  subjectTitle: string;
  selectedTopic: string;
  onRestart: () => void;
  onTerminate: () => void;
}

const QuizEngine = ({ 
  questions, 
  subjectTitle, 
  onRestart, 
  onTerminate 
}: QuizEngineProps) => {
  // 1. ISOLATED STATE: These updates are now blazing fast
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>(() => 
    new Array(questions.length).fill(-1)
  );
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [isRecapMode, setIsRecapMode] = useState(false);

  // 2. MEMOIZED CALCULATION: Score only recalculates when answers change
  const scorePercentage = useMemo(() => {
    if (questions.length === 0) return 0;
    const correctCount = userAnswers.reduce((total, ans, idx) => 
      ans === questions[idx]?.correct ? total + 1 : total, 0
    );
    return Math.round((correctCount / questions.length) * 100);
  }, [userAnswers, questions]);

  // 3. STABLE HANDLERS: Prevents QuizInterface from re-rendering unnecessarily
  const handleAnswer = useCallback((answerIndex: number) => {
    if (isRecapMode) return;
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentIdx] = answerIndex;
      return newAnswers;
    });
  }, [currentIdx, isRecapMode]);

  const handleNext = useCallback(() => {
    setCurrentIdx(prev => Math.min(prev + 1, questions.length - 1));
  }, [questions.length]);

  const handlePrev = useCallback(() => {
    setCurrentIdx(prev => Math.max(prev - 1, 0));
  }, []);

  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8">
      <QuizInterface
        subjectLabel={subjectTitle} 
        question={questions[currentIdx]}
        currentIdx={currentIdx}
        totalQuestions={questions.length}
        userAnswer={userAnswers[currentIdx]}
        isRecap={isRecapMode}
        onAnswer={handleAnswer}
        onNext={handleNext}
        onPrev={handlePrev}
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
          onTerminate={onTerminate}
          onRestart={() => {
            // Reset local engine state before restarting
            setUserAnswers(new Array(questions.length).fill(-1));
            setCurrentIdx(0);
            setIsRecapMode(false);
            onRestart();
          }}
        />
      )}
    </div>
  );
};

// React.memo prevents the engine from re-rendering unless the 'questions' array actually changes
export default memo(QuizEngine);