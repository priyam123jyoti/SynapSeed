'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Upload, BrainCircuit, Trash2, CheckSquare } from 'lucide-react';

interface DraftQuestion {
  id: string;
  type: 'MCQ' | 'MSQ' | 'FITB';
  question_text: string;
  options: string[] | null;
  correct_answers: string[];
}

export default function AdminCreateTestPage() {
  const router = useRouter();
  
  // Test Metadata
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Question State
  const [questions, setQuestions] = useState<DraftQuestion[]>([]);
  
  // AI Generation State
  const [aiContext, setAiContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  
  // Publishing State
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- 1. PDF Handling ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingPdf(true);
    setError(null);

    try {
      if (file.type === 'application/pdf') {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/parse-pdf', { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setAiContext(data.text);
      } else if (file.type === 'text/plain') {
        const text = await file.text();
        setAiContext(text.substring(0, 40000));
      } else {
        throw new Error('Unsupported file type. Please upload a PDF or TXT file.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsParsingPdf(false);
      // Reset input so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  // --- 2. AI Generation via Groq ---
  const handleGenerateQuestions = async () => {
    if (!aiContext.trim()) return setError('Please provide context text or upload a document first.');
    
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: aiContext })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      // Append newly generated questions to the existing list so admin can review
      setQuestions([...questions, ...data.questions]);
      setAiContext(''); // Clear context after generation
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // --- 3. Manual Question Management ---
  const handleAddManualQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `manual-${Date.now()}`,
        type: 'MCQ',
        question_text: '',
        options: ['', '', '', ''],
        correct_answers: []
      }
    ]);
  };

  const removeQuestion = (indexToRemove: number) => {
    setQuestions(questions.filter((_, idx) => idx !== indexToRemove));
  };

  // --- 4. Publishing to Supabase ---
  const handlePublishTest = async () => {
    if (!title.trim()) return setError('A mandatory Test Title is required.');
    if (questions.length === 0) return setError('You must add at least one question before publishing.');

    setIsPublishing(true);
    setError(null);

    try {
      const res = await fetch('/api/create-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, questions })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Redirect back to Admin Dashboard after successful publish
      router.push('/admin');
    } catch (err: any) {
      setError(err.message);
      setIsPublishing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create Evaluation Matrix</h1>
          
          {error && (
            <div className="bg-rose-50 text-rose-700 p-4 rounded-xl text-sm font-bold border border-rose-200">
              Error: {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Mandatory Test Name</label>
              <input 
                type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Advanced Cellular Biology Midterm"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Test Description (Optional)</label>
              <textarea 
                value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Instructions or details for the students..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 min-h-[100px]"
              />
            </div>
          </div>
        </div>

        {/* AI Generation Box */}
        <div className="bg-indigo-950 p-8 rounded-3xl shadow-lg space-y-6 text-white relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
              <BrainCircuit className="text-emerald-400" /> AI Auto-Generation Engine
            </h2>
            <p className="text-xs text-indigo-200 font-medium leading-relaxed max-w-2xl">
              Upload a document (PDF/TXT, max 20 pages/40k chars) or paste text directly. The AI will analyze the context and automatically generate MCQ, MSQ, and FITB questions with the correct answers pre-configured.
            </p>
            
            <textarea 
              value={aiContext} onChange={(e) => setAiContext(e.target.value)}
              placeholder="Paste curriculum text here or upload a document..."
              className="w-full px-4 py-3 bg-indigo-900/50 border border-indigo-800 rounded-xl text-sm font-medium text-indigo-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 min-h-[120px] placeholder:text-indigo-400/50"
            />
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="flex-1 w-full flex items-center justify-center gap-2 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs uppercase tracking-widest px-6 py-4 rounded-xl cursor-pointer transition-colors border border-indigo-700 border-dashed">
                {isParsingPdf ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {isParsingPdf ? 'Parsing Document...' : 'Upload PDF / TXT'}
                <input type="file" accept=".pdf,.txt" className="hidden" onChange={handleFileUpload} disabled={isParsingPdf || isGenerating} />
              </label>

              <button 
                onClick={handleGenerateQuestions} disabled={isGenerating || isParsingPdf || !aiContext.trim()}
                className="flex-1 w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-indigo-950 font-black text-xs uppercase tracking-widest px-6 py-4 rounded-xl transition-colors disabled:opacity-50"
              >
                {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <BrainCircuit size={16} />}
                {isGenerating ? 'Synthesizing Data...' : 'Generate Questions'}
              </button>
            </div>
          </div>
        </div>

        {/* Review & Edit Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Review & Edit Draft ({questions.length})</h2>
            <button 
              onClick={handleAddManualQuestion}
              className="text-xs font-bold text-slate-900 bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 transition-colors"
            >
              <Plus size={14} /> Add Manual Question
            </button>
          </div>

          {questions.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400 font-bold text-sm">
              No questions generated yet. Use the AI engine above or add manually.
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((q, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative group">
                  <button onClick={() => removeQuestion(idx)} className="absolute top-6 right-6 text-slate-300 hover:text-rose-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                  
                  <div className="pr-12 space-y-4">
                    <div className="flex gap-4">
                      <select 
                        value={q.type}
                        onChange={(e) => {
                          const newType = e.target.value as 'MCQ' | 'MSQ' | 'FITB';
                          const updated = [...questions];
                          updated[idx].type = newType;
                          if (newType === 'FITB') updated[idx].options = null;
                          if (newType !== 'FITB' && !updated[idx].options) updated[idx].options = ['', '', '', ''];
                          setQuestions(updated);
                        }}
                        className="text-xs font-black uppercase tracking-wider bg-slate-100 border border-slate-200 px-3 py-2 rounded-lg text-slate-700 outline-none"
                      >
                        <option value="MCQ">MCQ (Single Choice)</option>
                        <option value="MSQ">MSQ (Multiple Choice)</option>
                        <option value="FITB">FITB (Fill in Blank)</option>
                      </select>
                    </div>

                    <input 
                      type="text" value={q.question_text}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[idx].question_text = e.target.value;
                        setQuestions(updated);
                      }}
                      placeholder="Enter question text here..."
                      className="w-full text-lg font-bold text-slate-900 outline-none placeholder:text-slate-300"
                    />

                    {q.type !== 'FITB' && q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {q.options.map((opt, oIdx) => (
                          <input 
                            key={oIdx} type="text" value={opt}
                            onChange={(e) => {
                              const updated = [...questions];
                              updated[idx].options![oIdx] = e.target.value;
                              setQuestions(updated);
                            }}
                            placeholder={`Option ${oIdx + 1}`}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-slate-900"
                          />
                        ))}
                      </div>
                    )}

                    <div className="pt-4 border-t border-slate-100">
                      <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 block">Target Correct Answer(s)</label>
                      <input 
                        type="text" value={q.correct_answers.join(', ')}
                        onChange={(e) => {
                          const updated = [...questions];
                          // Split by comma for MSQ/FITB multiple valid variants
                          updated[idx].correct_answers = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          setQuestions(updated);
                        }}
                        placeholder={q.type === 'FITB' ? "Enter correct term (comma separate for multiple valid spellings)" : "Enter EXACT text of correct option(s), comma separated"}
                        className="w-full px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-bold text-emerald-900 outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-emerald-300"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button 
          onClick={handlePublishTest} disabled={isPublishing || questions.length === 0}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm uppercase tracking-widest px-6 py-5 rounded-2xl shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8"
        >
          {isPublishing ? <Loader2 size={20} className="animate-spin" /> : <CheckSquare size={20} />}
          {isPublishing ? 'Committing to Database...' : 'Publish Official Test Configuration'}
        </button>

      </div>
    </main>
  );
}