'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Sparkles, Trash2, FileText, CheckCircle, AlertCircle, Save } from 'lucide-react';
import { Question } from '@/types';

export default function AdminTestCreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [aiContext, setAiContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Staging state before committing transaction logs to Supabase
  const [stagedQuestions, setStagedQuestions] = useState<Partial<Question>[]>([]);

  // Local creation handler for manual overrides or generation insertions
  const addBlankQuestion = (type: 'MCQ' | 'MSQ' | 'FITB') => {
    const newQuestion: Partial<Question> = {
      id: crypto.randomUUID(),
      type,
      question_text: '',
      options: type === 'FITB' ? null : ['', '', '', ''],
      correct_answers: []
    };
    setStagedQuestions([...stagedQuestions, newQuestion]);
  };

  const handleAiGeneration = async () => {
    if (!aiContext || aiContext.length > 40000) {
      setError('Context structure payload out of limits. Maximum bounds 40k chars.');
      return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch('/app/api/questions', {
        method: 'POST',
        body: JSON.stringify({ context: aiContext })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation breakdown.');
      setStagedQuestions([...stagedQuestions, ...data.questions]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveAndPublishTest = async () => {
    if (!title.trim()) {
      setError('A valid distinct assessment title heading definition string is mandatory.');
      return;
    }
    setIsPublishing(true);
    setError(null);
    try {
      const res = await fetch('/app/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, questions: stagedQuestions })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Persistence failure.');
      router.push('/admin/test');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Setup Assessment Parameters</h1>
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl flex items-center gap-2 text-sm font-semibold">
              <AlertCircle size={18} /> {error}
            </div>
          )}
          <div className="grid grid-cols-1 gap-4">
            <input 
              type="text" placeholder="Enter Test Title Name..." value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
            />
            <textarea 
              placeholder="Provide Test Context Instructions (Optional)..." value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm h-20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 font-black text-sm uppercase tracking-wider">
              <Sparkles size={18} /> AI Core Provisioning Generator
            </div>
            <textarea 
              value={aiContext} onChange={(e) => setAiContext(e.target.value)} maxLength={40000}
              placeholder="Paste instructional document context raw character maps here (Max 40,000 strings)..."
              className="w-full h-64 p-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <div className="text-right text-[10px] text-slate-400 font-bold">{aiContext.length}/40000 characters used</div>
            <button 
              onClick={handleAiGeneration} disabled={isGenerating || !aiContext.trim()}
              className="w-full bg-slate-900 text-white font-black py-3 px-4 rounded-xl text-xs uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition-all"
            >
              {isGenerating ? 'Processing System Parsing...' : 'Trigger AI Engine Generation'}
            </button>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-md font-black text-slate-900 uppercase tracking-wider">Staging Matrix Verification Engine</h2>
              <div className="flex gap-2">
                <button onClick={() => addBlankQuestion('MCQ')} className="p-2 text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100">+ MCQ</button>
                <button onClick={() => addBlankQuestion('MSQ')} className="p-2 text-xs font-black bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100">+ MSQ</button>
                <button onClick={() => addBlankQuestion('FITB')} className="p-2 text-xs font-black bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100">+ Blank</button>
              </div>
            </div>

            {stagedQuestions.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-xs font-bold text-slate-400">
                Staging environment empty. Compile test objects manually or execute the AI generation parser engine.
              </div>
            ) : (
              stagedQuestions.map((q, idx) => (
                <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded text-slate-600">Question {idx + 1} ({q.type})</span>
                    <button onClick={() => setStagedQuestions(stagedQuestions.filter(item => item.id !== q.id))} className="text-rose-500 hover:text-rose-700"><Trash2 size={16} /></button>
                  </div>
                  <input 
                    type="text" placeholder="Formulate question query context..." value={q.question_text}
                    onChange={(e) => {
                      const updated = [...stagedQuestions];
                      updated[idx].question_text = e.target.value;
                      setStagedQuestions(updated);
                    }}
                    className="w-full p-2 border-b border-slate-200 font-bold focus:outline-none focus:border-slate-900 text-sm"
                  />
                  {q.type !== 'FITB' && q.options && (
                    <div className="grid grid-cols-2 gap-3">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2 border border-slate-100 rounded-xl p-2 bg-slate-50/50">
                          <input 
                            type={q.type === 'MCQ' ? 'radio' : 'checkbox'}
                            checked={q.correct_answers?.includes(opt) && opt !== ''}
                            name={`correct-${q.id}`}
                            onChange={() => {
                              const updated = [...stagedQuestions];
                              let currentAnswers = updated[idx].correct_answers || [];
                              if (q.type === 'MCQ') {
                                currentAnswers = [opt];
                              } else {
                                currentAnswers = currentAnswers.includes(opt) ? currentAnswers.filter(a => a !== opt) : [...currentAnswers, opt];
                              }
                              updated[idx].correct_answers = currentAnswers;
                              setStagedQuestions(updated);
                            }}
                          />
                          <input 
                            type="text" value={opt} placeholder={`Option ${oIdx + 1}`}
                            onChange={(e) => {
                              const updated = [...stagedQuestions];
                              if (updated[idx].options) {
                                updated[idx].options![oIdx] = e.target.value;
                                setStagedQuestions(updated);
                              }
                            }}
                            className="bg-transparent text-xs w-full focus:outline-none font-medium"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {q.type === 'FITB' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 block">Accepted Target Evaluation Keywords</label>
                      <input 
                        type="text" placeholder="Provide correct words array mapping split by commas..."
                        value={q.correct_answers?.join(', ') || ''}
                        onChange={(e) => {
                          const updated = [...stagedQuestions];
                          updated[idx].correct_answers = e.target.value.split(',').map(s => s.trim());
                          setStagedQuestions(updated);
                        }}
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none font-semibold text-emerald-700"
                      />
                    </div>
                  )}
                </div>
              ))
            )}
            
            {stagedQuestions.length > 0 && (
              <button 
                onClick={saveAndPublishTest} disabled={isPublishing}
                className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-100"
              >
                <Save size={16} /> {isPublishing ? 'Executing Global Commit Write Operations...' : 'Commit and Publish Test Object'}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}