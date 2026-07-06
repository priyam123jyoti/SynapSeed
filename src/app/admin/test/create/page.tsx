'use client';

import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Trash2, Loader2, Upload, AlertCircle, Save, BrainCircuit, FileText } from 'lucide-react';

interface Question {
  id: string;
  type: 'MCQ' | 'MSQ';
  question_text: string;
  options: string[];
  correct_answers: string[];
}

export default function AdminTestCreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // AI & PDF State
  const [aiContext, setAiContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  
  // Staging & Publishing State
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stagedQuestions, setStagedQuestions] = useState<Question[]>([]);

  // --- 1. PDF Handling ---
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
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
        
        if (!res.ok) throw new Error(data.error || 'Failed to parse PDF');
        setAiContext(String(data.text || '').substring(0, 40000));
      } else if (file.type === 'text/plain') {
        const text = await file.text();
        setAiContext(text.substring(0, 40000));
      } else {
        throw new Error('Unsupported file type. Please upload a PDF or TXT file.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while parsing the document.');
    } finally {
      setIsParsingPdf(false);
      e.target.value = '';
    }
  };

  // --- 2. AI Generation ---
  const handleAiGeneration = async () => {
    if (!aiContext || aiContext.length > 40000) {
      setError('Context structure payload out of limits. Maximum bounds 40k chars.');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: aiContext })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation breakdown.');
      
      if (data.questions && Array.isArray(data.questions)) {
        const validatedQuestions: Question[] = [];
        
        data.questions.forEach((incomingQuestion: unknown) => {
          if (incomingQuestion && typeof incomingQuestion === 'object') {
            const candidate = incomingQuestion as Record<string, unknown>;
            
            const hasValidType = candidate.type === 'MCQ' || candidate.type === 'MSQ';
            const hasValidOptions = Array.isArray(candidate.options) && candidate.options.length === 4;
            const hasValidAnswers = Array.isArray(candidate.correct_answers) && candidate.correct_answers.length > 0;
            
            if (hasValidType && hasValidOptions && hasValidAnswers) {
              validatedQuestions.push({
                id: typeof candidate.id === 'string' && candidate.id ? candidate.id : crypto.randomUUID(),
                type: candidate.type as 'MCQ' | 'MSQ',
                question_text: typeof candidate.question_text === 'string' ? candidate.question_text : '',
                options: (candidate.options as unknown[]).map(opt => String(opt)),
                correct_answers: (candidate.correct_answers as unknown[]).map(ans => String(ans)),
              });
            }
          }
        });

        if (validatedQuestions.length > 0) {
          setStagedQuestions((prev) => [...prev, ...validatedQuestions]);
          setAiContext('');
        } else {
          setError('AI generation returned questions, but none passed validation rules.');
        }
      } else {
        throw new Error('Invalid questions format returned from the generation engine.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during AI generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  // --- 3. Manual Overrides ---
  const addBlankQuestion = (type: 'MCQ' | 'MSQ') => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      type,
      question_text: '',
      options: ['', '', '', ''],
      correct_answers: [],
    };

    setStagedQuestions((prev) => [...prev, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    setStagedQuestions((prev) => prev.filter((item) => item.id !== id));
  };

  // --- 4. Database Commit ---
  const saveAndPublishTest = async () => {
    if (!title.trim()) {
      setError('A valid distinct assessment title is mandatory.');
      return;
    }
    if (stagedQuestions.length === 0) {
      setError('You must add at least one question before publishing.');
      return;
    }

    setIsPublishing(true);
    setError(null);
    
    try {
      const res = await fetch('/api/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, questions: stagedQuestions })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Persistence failure.');
      
      router.push('/admin/test');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during transaction commit.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Test Setup Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">
              Setup Assessment Parameters
            </h1>
            
            <Link 
              href="/admin/test" 
              className="flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
            >
              <FileText size={14} /> View All Tests
            </Link>
          </div>
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl flex items-center gap-2 text-sm font-semibold">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            <input 
              type="text" 
              placeholder="Enter Test Title Name..." 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
            />
            <textarea 
              placeholder="Provide Test Context Instructions (Optional)..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm h-20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* AI Generator Column */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 font-black text-sm uppercase tracking-wider">
              <Sparkles size={18} /> AI Core Provisioning Generator
            </div>
            
            <p className="text-xs text-slate-500 font-medium">Upload a PDF/TXT or paste context manually (Max 20 pages / 40k chars).</p>
            
            <label className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-widest px-4 py-4 rounded-xl cursor-pointer transition-colors border border-slate-200 border-dashed">
              {isParsingPdf ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {isParsingPdf ? 'Extracting PDF Text...' : 'Upload PDF / TXT Document'}
              <input type="file" accept=".pdf,.txt" className="hidden" onChange={handleFileUpload} disabled={isParsingPdf || isGenerating} />
            </label>

            <textarea 
              value={aiContext} 
              onChange={(e) => setAiContext(e.target.value)} 
              maxLength={40000}
              placeholder="...or paste raw character strings here."
              className="w-full h-48 p-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            
            <div className="text-right text-[10px] text-slate-400 font-bold">
              {aiContext.length}/40000 characters used
            </div>
            
            <button 
              onClick={handleAiGeneration} 
              disabled={isGenerating || isParsingPdf || !aiContext.trim()}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-black py-3 px-4 rounded-xl text-xs uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition-all"
            >
              {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <BrainCircuit size={16} />}
              {isGenerating ? 'Synthesizing...' : 'Trigger AI Generation'}
            </button>
          </div>

          {/* Staging Matrix Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-md font-black text-slate-900 uppercase tracking-wider">Staging Matrix ({stagedQuestions.length})</h2>
              <div className="flex gap-2">
                <button type="button" onClick={() => addBlankQuestion('MCQ')} className="p-2 text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100">+ MCQ</button>
                <button type="button" onClick={() => addBlankQuestion('MSQ')} className="p-2 text-xs font-black bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100">+ MSQ</button>
              </div>
            </div>

            {stagedQuestions.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-xs font-bold text-slate-400">
                Staging environment empty. Compile test objects manually or execute the AI generation parser engine.
              </div>
            ) : (
              <div className="space-y-4">
                {stagedQuestions.map((q, idx) => (
                  <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded text-slate-600">
                        Question {idx + 1} ({q.type})
                      </span>
                      <button type="button" onClick={() => removeQuestion(q.id)} className="text-rose-500 hover:text-rose-700">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <input 
                      type="text" 
                      placeholder="Formulate question query context..." 
                      value={q.question_text}
                      onChange={(e) => {
                        const nextText = e.target.value;
                        setStagedQuestions((prev) => 
                          prev.map((item) => item.id === q.id ? { ...item, question_text: nextText } : item)
                        );
                      }}
                      className="w-full p-2 border-b border-slate-200 font-bold focus:outline-none focus:border-slate-900 text-sm"
                    />
                    
                    {q.options && (
                      <div className="grid grid-cols-2 gap-3">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-2 border border-slate-100 rounded-xl p-2 bg-slate-50/50">
                            <input 
                              type={q.type === 'MCQ' ? 'radio' : 'checkbox'}
                              checked={q.correct_answers.includes(opt) && opt !== ''}
                              name={`correct-${q.id}`}
                              onChange={() => {
                                setStagedQuestions((prev) => 
                                  prev.map((item) => {
                                    if (item.id !== q.id) return item;
                                    
                                    const currentAnswers = item.correct_answers;
                                    let nextAnswers: string[];
                                    
                                    if (item.type === 'MCQ') {
                                      nextAnswers = [opt];
                                    } else {
                                      nextAnswers = currentAnswers.includes(opt)
                                        ? currentAnswers.filter((a) => a !== opt)
                                        : [...currentAnswers, opt];
                                    }
                                    
                                    return { ...item, correct_answers: nextAnswers };
                                  })
                                );
                              }}
                            />
                            <input 
                              type="text" 
                              value={opt} 
                              placeholder={`Option ${oIdx + 1}`}
                              onChange={(e) => {
                                const nextValue = e.target.value;
                                setStagedQuestions((prev) => 
                                  prev.map((item) => {
                                    if (item.id !== q.id) return item;
                                    
                                    const oldOptionValue = item.options[oIdx];
                                    const nextOptions = item.options.map((optionText, index) => 
                                      index === oIdx ? nextValue : optionText
                                    );
                                    
                                    const nextCorrectAnswers = item.correct_answers.map((answerText) => 
                                      answerText === oldOptionValue ? nextValue : answerText
                                    );
                                    
                                    return {
                                      ...item,
                                      options: nextOptions,
                                      correct_answers: nextCorrectAnswers
                                    };
                                  })
                                );
                              }}
                              className="bg-transparent text-xs w-full focus:outline-none font-medium"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {stagedQuestions.length > 0 && (
              <button 
                onClick={saveAndPublishTest} 
                disabled={isPublishing}
                className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-100 mt-4"
              >
                {isPublishing ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {isPublishing ? 'Executing Global Commit Write Operations...' : 'Commit and Publish Test Object'}
              </button>
            )}
            
          </div>
        </div>
      </div>
    </main>
  );
}