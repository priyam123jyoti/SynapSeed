// src/app/results/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface SubmissionQuestion {
  id: string;
  question_text: string;
  type: string;
  options: string[] | null;
  correct_answers: string[];
}

interface SubmissionData {
  id: string;
  score: number;
  total_questions: number;
  student_answers: Record<string, string[]>;
  test: {
    title: string;
    description: string;
    questions: SubmissionQuestion[];
  };
}

export default function ResultDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [submission, setSubmission] =
    useState<SubmissionData | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchResult() {
      try {
        const res = await fetch(`/api/results/${id}`);

        if (!res.ok) {
          throw new Error('Failed to load result');
        }

        const data = await res.json();

        setSubmission(data.submission);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading Result...
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Result not found.
      </div>
    );
  }

  const percentage =
    (
      (submission.score /
        (submission.total_questions * 2)) *
      100
    ).toFixed(0);

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">

      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>
              <h1 className="text-3xl font-black text-slate-900">
                {submission.test.title}
              </h1>

              <p className="text-slate-500 mt-2">
                {submission.test.description}
              </p>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl px-6 py-4 text-center min-w-[160px]">

              <div className="text-xs uppercase tracking-widest font-bold text-indigo-500 mb-1">
                Final Score
              </div>

              <div className="text-4xl font-black text-indigo-700">
                {percentage}%
              </div>

              <div className="text-sm text-slate-500 mt-1">
                {submission.score} /{' '}
                {submission.total_questions * 2}
              </div>

            </div>

          </div>

        </div>

        {/* Question Review */}
        <div className="space-y-6">

          {submission.test.questions.map(
            (question, index) => {
              const studentAnswer =
                submission.student_answers[
                  question.id
                ] || [];

              const correctAnswers =
                question.correct_answers || [];

              const isCorrect =
                studentAnswer.length ===
                  correctAnswers.length &&
                studentAnswer.every((ans) =>
                  correctAnswers.includes(ans)
                );

              return (
                <div
                  key={question.id}
                  className={`rounded-3xl border p-6 bg-white

                    ${
                      isCorrect
                        ? 'border-emerald-200'
                        : 'border-rose-200'
                    }
                  `}
                >

                  {/* Question Header */}
                  <div className="flex items-start justify-between gap-4 mb-5">

                    <h2 className="text-lg font-bold text-slate-900">
                      {index + 1}.{' '}
                      {question.question_text}
                    </h2>

                    <div
                      className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider

                        ${
                          isCorrect
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }
                      `}
                    >
                      {isCorrect
                        ? 'Correct'
                        : 'Wrong'}
                    </div>

                  </div>

                  {/* Options */}
                  {question.options && (
                    <div className="space-y-3 mb-6">

                      {question.options.map((option) => {
                        const selected =
                          studentAnswer.includes(
                            option
                          );

                        const correct =
                          correctAnswers.includes(
                            option
                          );

                        return (
                          <div
                            key={option}
                            className={`border rounded-2xl p-4 text-sm font-medium

                              ${
                                correct
                                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                                  : selected
                                  ? 'border-rose-300 bg-rose-50 text-rose-700'
                                  : 'border-slate-200 bg-white text-slate-700'
                              }
                            `}
                          >
                            {option}
                          </div>
                        );
                      })}

                    </div>
                  )}

                  {/* FITB */}
                  {question.type === 'FITB' && (
                    <div className="space-y-4 mb-6">

                      <div className="bg-slate-100 rounded-2xl p-4">
                        <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">
                          Your Answer
                        </div>

                        <div className="font-semibold text-slate-900">
                          {studentAnswer[0] || 'No Answer'}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Correct Answer */}
                  <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">

                    <div className="text-xs uppercase tracking-widest text-indigo-500 font-bold mb-2">
                      Correct Answer
                    </div>

                    <div className="font-semibold text-indigo-900">
                      {correctAnswers.join(', ')}
                    </div>

                  </div>

                </div>
              );
            }
          )}

        </div>

        {/* Footer */}
        <div className="mt-10 flex justify-center">

          <button
            onClick={() =>
              router.push('/test-hub')
            }
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-black transition"
          >
            Back To Test Hub
          </button>

        </div>

      </div>

    </main>
  );
}