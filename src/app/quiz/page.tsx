import { Suspense } from 'react';
import QuizClient from './QuizClient';
import { LoadingScreen } from '@/components/quiz/LoadingScreen';

export default function QuizPage() {
  return (
    <Suspense fallback={<LoadingScreen topic="Initializing Neural Link..." />}>
      <QuizClient />
    </Suspense>
  );
}