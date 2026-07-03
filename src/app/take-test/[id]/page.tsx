'use client';

import { useEffect, useState, use } from 'react';
import { Loader2, ChevronRight, CheckCircle2, User, AlertCircle } from 'lucide-react';

interface Question {
  id: string;
  question_text: string;
  options: string[]; // Assuming you store multiple choice options as an array of strings
  correct_answer: string;
}

interface QuizDetails {
  title: string;
  id: string;
}

export default function StudentTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: quizId } = use(params);
  
  // App State
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Quiz Data State
  const [quizDetails, setQuizDetails] = useState<QuizDetails | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // Active Test State
  const [step, setStep] = useState<'intro' | 'testing' | 'completed'>('intro');
  const [studentName, setStudentName] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [finalScore, setFinalScore] = useState(0);

  // 1️⃣ Fetch the questions when the page loads
  useEffect(() => {
    async function fetchTest() {
      try {
        // You will need to create this API route next!
        const res = await fetch(`/api/take-test/${quizId}`);
        if (!res.ok) throw new Error("Could not load the test.");
        
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setQuizDetails({ title: data.title, id: quizId });
        setQuestions(data.questions);
      } catch (err: any) {
        setError(err.message || "Failed to load test data");
      } finally {
        setLoading(false);
      }
    }
    
    if (quizId) fetchTest();
  }, [quizId]);

  // 2️⃣ Handle selecting an answer
  const handleSelectOption = (questionId: string, option: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  // 3️⃣ Handle moving to the next question or submitting
  const handleNextOrSubmit = async () => {
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  if (!isLastQuestion) {
    setCurrentQuestionIndex(prev => prev + 1);
    return;
  }

  setSubmitting(true);
  
  try {
    // 1. Send the raw data to your backend
    const submitRes = await fetch('/api/submission', { // Note: Pointing to your backend route
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        testId: quizId,
        studentName: studentName,
        answers: selectedAnswers // This matches the backend expected structure
      })
    });

    if (!submitRes.ok) throw new Error("Failed to save results.");

    // 2. Get result back from backend to show the user
    const result = await submitRes.json();
    setFinalScore(result.evaluatedScore);
    setStep('completed');
  } catch (err: any) {
    setError(err.message || "Something went wrong saving your test.");
  } finally {
    setSubmitting(false);
  }
};
  // ---------------- UI RENDERING ----------------

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600 w-10 h-10" />
      </div>
    );
  }

  if (error || !quizDetails || questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-rose-100 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-black text-slate-900 mb-2">Test Unavailable</h2>
          <p className="text-sm text-slate-500 font-medium">{error || "No questions found for this test."}</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const hasAnsweredCurrent = !!selectedAnswers[currentQuestion?.id];

  return (
    <main className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        
        {/* STEP 1: Intro & Name Collection */}
        {step === 'intro' && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Testing Portal</span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{quizDetails.title}</h1>
              <p className="text-sm text-slate-500 font-medium">This test contains {questions.length} questions.</p>
            </div>

            <div className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                  Enter your full name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => setStep('testing')}
                disabled={studentName.trim().length < 2}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-black uppercase tracking-wider text-sm transition-colors flex items-center justify-center gap-2"
              >
                Begin Assessment <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Active Testing */}
        {step === 'testing' && currentQuestion && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-400 px-2">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{studentName}</span>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-8 leading-relaxed">
                {currentQuestion.question_text}
              </h2>

              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedAnswers[currentQuestion.id] === option;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(currentQuestion.id, option)}
                      className={`w-full text-left p-4 rounded-xl border-2 font-semibold transition-all ${
                        isSelected 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900' 
                          : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNextOrSubmit}
                disabled={!hasAnsweredCurrent || submitting}
                className="py-4 px-8 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-black uppercase tracking-wider text-sm transition-colors flex items-center gap-2"
              >
                {submitting ? (
                  <><Loader2 size={18} className="animate-spin" /> Processing...</>
                ) : currentQuestionIndex === questions.length - 1 ? (
                  <><CheckCircle2 size={18} /> Submit Test</>
                ) : (
                  <>Next Question <ChevronRight size={18} /></>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Completed Screen */}
        {step === 'completed' && (
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-emerald-100 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 size={40} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Assessment Complete</span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">Great job, {studentName.split(' ')[0]}!</h1>
              <p className="text-slate-500 font-medium mt-4">Your responses have been securely logged.</p>
            </div>
            
            <div className="inline-block mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Your Score</p>
              <div className="text-4xl font-black text-slate-900">
                {finalScore} <span className="text-lg text-slate-400">/ {questions.length}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}