"use client";

import React, { useState } from 'react';
// Import your child components here
import { QuizInterface } from './QuizInterface';
import { ResultsModal } from './ResultsModal';

// This interface MUST match the props you pass in QuizClient
interface QuizEngineProps {
  questions: any[];
  subjectTitle: string;
  selectedTopic: string;
  onRestart: () => void | Promise<void>;
  onFinishQuiz: (score: number) => void | Promise<void>;
  onTerminate: () => void;
}

const QuizEngine = ({ 
  questions, 
  subjectTitle, 
  selectedTopic, 
  onRestart, 
  onFinishQuiz, 
  onTerminate 
}: QuizEngineProps) => {
    
  // Your internal state logic (currentIdx, score, etc.)
  
  return (
    <div className="quiz-engine-container">
       {/* Your Quiz Logic Rendering */}
    </div>
  );
};

// CRITICAL: Ensure you are exporting this as the default
export default QuizEngine;