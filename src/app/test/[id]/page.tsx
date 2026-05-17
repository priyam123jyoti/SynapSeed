'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, AlertCircle, HelpCircle, Loader2, Award } from 'lucide-react';

interface Question {
  id: string;
  type: 'MCQ' | 'MSQ' | 'FITB';
  questionText: string;
  options: string[];
  correctAnswers: string[];
}

interface QuizData {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export default function StudentQuizView({ params }: { params: Promise<{ id: string }> }) {
  const { id: quizId } = use(params);
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const { data, error } = await supabase
          .from('quizzes')
          .select('*')
          .eq('id', quizId)
          .single();

        if (error) throw error;
        setQuiz(data);
      } catch (err) {
        console.error('Error streaming question papers:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, [quizId]);

  // Handle choice configurations safely based on individual matrix constraints
  const handleAnswerInput = (questionId: string, value: string, type: 'MCQ' | 'MSQ' | 'FITB') => {
    if (submitted) return; // Disable changes after grading selection

    const currentSelection = answers[questionId] || [];

    if (type === 'MCQ') {
      setAnswers({ ...answers, [questionId]: [value] });
    } else if (type === 'MSQ') {
      const updated = currentSelection.includes(value)
        ? currentSelection.filter((item: string) => item !== value)
        : [...currentSelection, value];
      setAnswers({ ...answers, [questionId]: updated });
    } else {
      // Direct text string tracking for Fill in the Blanks evaluation
      setAnswers({ ...answers, [questionId]: value.trim() });
    }
  };

  const evaluateQuizPaper = async () => {
    if (!quiz) return;
    let score = 0;

    quiz.questions.forEach((q) => {
      const studentAns = answers[q.id];
      if (!studentAns) return;

      if (q.type === 'FITB') {
        // Multi-keyword check for case-insensitive verification string phrases
        const isCorrectFITB = q.correctAnswers.some(
          (correctStr) => correctStr.toLowerCase() === studentAns.toLowerCase()
        );
        if (isCorrectFITB) score++;
      } else {
        // Standard array sorting evaluations for MCQ and multiple selection options arrays
        const matchCount = q.correctAnswers.filter((ans) => studentAns.includes(ans)).length;
        if (matchCount === q.correctAnswers.length && studentAns.length === q.correctAnswers.length) {
          score++;
        }
      }
    });

    setFinalScore(score);
    setSubmitted(true);

    // Save calculation payloads dynamically to Supabase
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('quiz_submissions').insert([
        {
          quiz_id: quizId,
          student_id: user?.id || null,
          student_name: user?.user_metadata?.full_name || 'Anonymous Student',
          score: score,
          total_questions: quiz.questions.length,
        }
      ]);
    } catch (err) {
      console.error('Failed logging grade matrix:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600 w-10 h-10" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <AlertCircle className="text-rose-500 w-12 h-12 mb-2" />
        <h3 className="font-bold text-slate-800">Assessment Missing</h3>
        <p className="text-xs text-slate-400">The code link is corrupt or has been deleted by administration.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/60 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Banner Headers */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl -z-10"></div>
          <span className="text-[9px] bg-emerald-600 text-white font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">
            Examination Node
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-4 tracking-tight leading-tight">{quiz.title}</h1>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">{quiz.description}</p>
        </div>

        {/* Dynamic Question Render Node */}
        <div className="space-y-6">
          {quiz.questions.map((q, idx) => {
            const studentAns = answers[q.id] || [];
            return (
              <div key={q.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Question {idx + 1}</span>
                  <span className="text-[9px] font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-500 tracking-wider uppercase">{q.type}</span>
                </div>
                <h3 className="text-base font-bold text-slate-800 leading-snug">{q.questionText}</h3>

                {/* Form Processing Select Elements Based on Question Style Options */}
                {q.type === 'FITB' ? (
                  <input
                    type="text"
                    disabled={submitted}
                    placeholder="Type your answer here..."
                    onChange={(e) => handleAnswerInput(q.id, e.target.value, 'FITB')}
                    className="w-full max-w-md px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-emerald-500 text-sm"
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-3 pt-2">
                    {q.options.map((option, optIdx) => {
                      if (!option) return null;
                      const isSelected = studentAns.includes(option);
                      
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={submitted}
                          onClick={() => handleAnswerInput(q.id, option, q.type)}
                          className={`w-full text-left p-4 rounded-2xl text-sm font-semibold transition-all flex items-center justify-between border ${
                            isSelected
                              ? 'bg-emerald-50/80 text-emerald-900 border-emerald-500 shadow-sm shadow-emerald-50'
                              : 'bg-slate-50/50 hover:bg-slate-50 text-slate-600 border-slate-100'
                          }`}
                        >
                          <span>{option}</span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                            isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Dynamic Action Trigger Blocks or Result Showcase Matrix Cards */}
        {!submitted ? (
          <button
            onClick={evaluateQuizPaper}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-100 transition-all active:scale-[0.98]"
          >
            Submit Paper Matrix
          </button>
        ) : (
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex items-center justify-between animate-in zoom-in-95 duration-500">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400">
                <Award size={28} />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight">Evaluation Sheet Logged</h3>
                <p className="text-xs text-slate-400 mt-0.5">Your evaluation scoring vector has been saved directly into database records.</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-emerald-400">{finalScore}</span>
              <span className="text-xs text-slate-500 block font-bold uppercase tracking-wider">/ {quiz.questions.length} Correct</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}