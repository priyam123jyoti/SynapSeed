'use client';

import { useState, useEffect, useCallback, useMemo, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Sparkles, 
  Trash2, 
  Loader2, 
  Upload, 
  AlertCircle, 
  Save, 
  BrainCircuit, 
  FileText, 
  X, 
  BarChart,
  CheckCircle2,
  Settings2,
  AlertTriangle
} from 'lucide-react';

// --- Types & Interfaces ---

interface Question {
  id: string;
  type: 'MCQ' | 'MSQ';
  question_text: string;
  options: string[];
  correct_answers: string[];
}

interface GenerationStats {
  requested: number;
  generated: number;
  totalInStaging: number;
  successRate: number;
}

interface DraftState {
  title: string;
  description: string;
  aiContext: string;
  desiredQuestionCount: number;
  stagedQuestions: Question[];
}

const DRAFT_KEY = 'test_create_draft_v1';
const MAX_CONTEXT_LENGTH = 40000;
const CHUNK_SIZE = 8000; // Optimal character size per chunk

export default function AdminTestCreatePage() {
  const router = useRouter();
  
  // --- Form State ---
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // --- AI & Context State ---
  const [aiContext, setAiContext] = useState('');
  const [desiredQuestionCount, setDesiredQuestionCount] = useState(15);
  const [isGenerating, setIsGenerating] = useState(false);
  const [chunkProgress, setChunkProgress] = useState<{ current: number; total: number } | null>(null);
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [stats, setStats] = useState<GenerationStats | null>(null);
  
  // --- Staging & Publishing State ---
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stagedQuestions, setStagedQuestions] = useState<Question[]>([]);
  
  // --- Initialization & Local Storage Draft ---
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        const parsed: DraftState = JSON.parse(savedDraft);
        setTitle(parsed.title || '');
        setDescription(parsed.description || '');
        setAiContext(parsed.aiContext || '');
        setDesiredQuestionCount(
          Math.min(30, Math.max(1, parsed.desiredQuestionCount || 15))
        );
        setStagedQuestions(parsed.stagedQuestions || []);
      }
    } catch (e) {
      console.error('Failed to restore draft:', e);
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const draft: DraftState = { title, description, aiContext, desiredQuestionCount, stagedQuestions };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [title, description, aiContext, desiredQuestionCount, stagedQuestions, isMounted]);

  // --- Unsaved Changes Protection ---
  useEffect(() => {
    if (!isMounted) return;
    const hasChanges = title || description || aiContext || stagedQuestions.length > 0;
    if (!hasChanges) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [title, description, aiContext, stagedQuestions.length, isMounted]);

  // --- Helper: Question Validation ---
  const validateQuestion = useCallback((q: Question): string[] => {
    const errors: string[] = [];
    if (!q.question_text.trim()) errors.push('Question text cannot be empty.');
    if (q.options.length !== 4) errors.push('Must have exactly 4 options.');
    
    const filledOptions = q.options.filter(opt => opt.trim() !== '');
    if (filledOptions.length !== 4) errors.push('All 4 options must be filled.');
    
    const uniqueOptions = new Set(q.options.map(o => o.trim().toLowerCase()));
    if (uniqueOptions.size !== q.options.length) errors.push('Duplicate options detected.');
    
    if (q.type === 'MCQ' && q.correct_answers.length !== 1) {
      errors.push('MCQ must have exactly 1 correct answer.');
    }
    if (q.type === 'MSQ' && q.correct_answers.length < 1) {
      errors.push('MSQ must have at least 1 correct answer.');
    }
    
    const invalidAnswers = q.correct_answers.some(ans => !q.options.includes(ans));
    if (invalidAnswers) {
      errors.push('Correct answers must strictly match option values.');
    }
    
    return errors;
  }, []);

  const questionsValidity = useMemo(() => {
    const validityMap = new Map<string, string[]>();
    stagedQuestions.forEach(q => validityMap.set(q.id, validateQuestion(q)));
    return validityMap;
  }, [stagedQuestions, validateQuestion]);

  const hasGlobalErrors = Array.from(questionsValidity.values()).some(errs => errs.length > 0);

  // --- 1. Smart PDF Recommendation ---
  const recommendCount = useCallback((textLength: number): number => {
    if (textLength <= 2000) return 5;
    if (textLength <= 5000) return 10;
    if (textLength <= 10000) return 15;
    if (textLength <= 20000) return 20;
    return 30;
  }, []);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingPdf(true);
    setError(null);

    try {
      let extractedText = '';
      if (file.type === 'application/pdf') {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/parse-pdf', { method: 'POST', body: formData });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || 'Failed to parse PDF');
        extractedText = String(data.text || '').substring(0, MAX_CONTEXT_LENGTH);
      } else if (file.type === 'text/plain') {
        const text = await file.text();
        extractedText = text.substring(0, MAX_CONTEXT_LENGTH);
      } else {
        throw new Error('Unsupported file type. Please upload a PDF or TXT file.');
      }
      
      setAiContext(extractedText);
      setDesiredQuestionCount(recommendCount(extractedText.length));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while parsing the document.');
    } finally {
      setIsParsingPdf(false);
      e.target.value = '';
    }
  };

  // --- Helper: Split Text into Natural Chunks ---
  const splitTextIntoChunks = (text: string, maxChars: number = CHUNK_SIZE): string[] => {
    if (text.length <= maxChars) return [text];
    
    const paragraphs = text.split(/\n+/);
    const chunks: string[] = [];
    let currentChunk = '';

    for (const paragraph of paragraphs) {
      if ((currentChunk + '\n\n' + paragraph).length > maxChars && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = paragraph;
      } else {
        currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
      }
    }
    
    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }
    
    // Fallback: If a single paragraph is larger than maxChars, force-split by character limit
    return chunks.flatMap(chunk => {
      if (chunk.length <= maxChars) return [chunk];
      const subChunks: string[] = [];
      for (let i = 0; i < chunk.length; i += maxChars) {
        subChunks.push(chunk.substring(i, i + maxChars));
      }
      return subChunks;
    });
  };

  // --- 2. AI Generation (Multi-Chunk Pipeline) ---
  const handleAiGeneration = async () => {
    if (!aiContext || aiContext.length > MAX_CONTEXT_LENGTH) {
      setError(`Context structure payload out of limits. Maximum bounds ${MAX_CONTEXT_LENGTH} chars.`);
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    setStats(null);
    
    try {
      // Step 1: Split into chunks
      const chunks = splitTextIntoChunks(aiContext, CHUNK_SIZE);
      const totalChars = aiContext.length;
      setChunkProgress({ current: 1, total: chunks.length });

      let allRawQuestions: unknown[] = [];
      let remainingQuestionsTarget = desiredQuestionCount;

      // Step 2 & 3: Generate questions per chunk sequentially
      for (let i = 0; i < chunks.length; i++) {
        setChunkProgress({ current: i + 1, total: chunks.length });
        const chunkText = chunks[i];

        // Calculate proportional question target for this chunk
        const isLastChunk = i === chunks.length - 1;
        const chunkTarget = isLastChunk 
          ? remainingQuestionsTarget 
          : Math.max(1, Math.round(desiredQuestionCount * (chunkText.length / totalChars)));
        
        remainingQuestionsTarget = Math.max(0, remainingQuestionsTarget - chunkTarget);

        const res = await fetch('/api/generate-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ context: chunkText, count: chunkTarget })
        });
        
        const data = await res.json();
        if (!res.ok) {
          throw new Error(`Chunk ${i + 1}/${chunks.length} failed: ${data.error || 'Generation breakdown.'}`);
        }

        if (data.questions && Array.isArray(data.questions)) {
          allRawQuestions = [...allRawQuestions, ...data.questions];
        }
      }

      // Step 4: Validate merged questions
      const validatedQuestions: Question[] = [];
      allRawQuestions.forEach((incomingQuestion: unknown) => {
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

      // Step 5: Remove duplicates across new chunks AND existing staging
      const existingTexts = new Set(stagedQuestions.map(q => q.question_text.toLowerCase().trim()));
      const seenInBatch = new Set<string>();
      
      const uniqueNewQuestions = validatedQuestions.filter(q => {
        const normalizedText = q.question_text.toLowerCase().trim();
        if (existingTexts.has(normalizedText) || seenInBatch.has(normalizedText)) {
          return false;
        }
        seenInBatch.add(normalizedText);
        return true;
      });

      // Step 6: Return & update state
      if (uniqueNewQuestions.length > 0) {
        setStagedQuestions(prev => [...prev, ...uniqueNewQuestions]);
      } else if (validatedQuestions.length > 0) {
        setError('AI generated questions, but they were all duplicates of what is already staged.');
      } else {
        setError('AI generation completed, but no questions passed structural validation rules.');
      }

      setStats({
        requested: desiredQuestionCount,
        generated: uniqueNewQuestions.length,
        totalInStaging: stagedQuestions.length + uniqueNewQuestions.length,
        successRate: Math.round((uniqueNewQuestions.length / desiredQuestionCount) * 100)
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during AI generation.');
    } finally {
      setIsGenerating(false);
      setChunkProgress(null);
    }
  };

  // --- 3. Manual Overrides ---
  const addBlankQuestion = useCallback((type: 'MCQ' | 'MSQ') => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      type,
      question_text: '',
      options: ['', '', '', ''],
      correct_answers: [],
    };
    setStagedQuestions((prev) => [...prev, newQuestion]);
  }, []);

  const removeQuestion = useCallback((id: string) => {
    setStagedQuestions((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuestionState = useCallback((id: string, updater: (q: Question) => Question) => {
    setStagedQuestions((prev) => prev.map((q) => (q.id === id ? updater(q) : q)));
  }, []);

  const handleDesiredCountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10) || 1;
    setDesiredQuestionCount(Math.min(30, Math.max(1, val)));
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
    if (hasGlobalErrors) {
      setError('Please resolve all highlighted question errors before publishing.');
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
      
      localStorage.removeItem(DRAFT_KEY);
      router.push('/admin/test');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during transaction commit.');
    } finally {
      setIsPublishing(false);
    }
  };

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Test Setup Header */}
        <header className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Settings2 className="text-emerald-600" size={24} />
              Setup Assessment Parameters
            </h1>
            
            <Link 
              href="/admin/test" 
              className="flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
              aria-label="View All Tests"
            >
              <FileText size={14} /> View All Tests
            </Link>
          </div>
          
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-start gap-3 text-sm font-semibold relative animate-in fade-in zoom-in duration-200 shadow-sm">
              <AlertCircle size={18} className="mt-0.5 shrink-0" /> 
              <span className="flex-1">{error}</span>
              <button 
                onClick={() => setError(null)} 
                className="text-rose-400 hover:text-rose-600 focus:outline-none rounded-md focus:ring-2 focus:ring-rose-500"
                aria-label="Dismiss error"
              >
                <X size={18} />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            <input 
              type="text" 
              placeholder="Enter Test Title Name..." 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold bg-slate-50/50 hover:bg-slate-50 transition-colors"
              aria-label="Test Title"
            />
            <textarea 
              placeholder="Provide Test Context Instructions (Optional)..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm h-20 bg-slate-50/50 hover:bg-slate-50 transition-colors resize-y"
              aria-label="Test Description"
            />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* AI Generator Column */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 sticky top-6">
              <div className="flex items-center gap-2 text-emerald-600 font-black text-sm uppercase tracking-wider">
                <Sparkles size={18} /> AI Core Provisioning Generator
              </div>
              
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Upload a document to auto-calculate the ideal question count, or manually configure limits. Max 40,000 chars.
              </p>
              
              <label 
                className={`w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-widest px-4 py-4 rounded-xl cursor-pointer transition-colors border-2 border-slate-200 border-dashed focus-within:ring-2 focus-within:ring-emerald-500 ${isParsingPdf || isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isParsingPdf ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {isParsingPdf ? 'Extracting Text...' : 'Upload PDF / TXT'}
                <input 
                  type="file" 
                  accept=".pdf,.txt" 
                  className="hidden" 
                  onChange={handleFileUpload} 
                  disabled={isParsingPdf || isGenerating} 
                  aria-label="Upload document"
                />
              </label>

              <textarea 
                value={aiContext} 
                onChange={(e) => setAiContext(e.target.value)} 
                maxLength={MAX_CONTEXT_LENGTH}
                placeholder="...or paste raw context here."
                disabled={isGenerating || isParsingPdf}
                className="w-full h-48 p-4 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-y bg-slate-50/50 disabled:opacity-50"
                aria-label="AI Context"
              />
              
              <div className="text-right text-[10px] text-slate-400 font-bold -mt-2">
                {aiContext.length.toLocaleString()} / {MAX_CONTEXT_LENGTH.toLocaleString()} chars
              </div>

              {/* Target Questions Control */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <label htmlFor="questionCount">Target Questions</label>
                  <input 
                    id="questionCount"
                    type="number" 
                    min={1} 
                    max={30} 
                    value={desiredQuestionCount} 
                    onChange={handleDesiredCountChange}
                    disabled={isGenerating || isParsingPdf}
                    className="w-16 px-2 py-1 text-center border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <input 
                  type="range" 
                  min={1} 
                  max={30} 
                  value={desiredQuestionCount} 
                  onChange={handleDesiredCountChange}
                  disabled={isGenerating || isParsingPdf}
                  className="w-full accent-emerald-600 disabled:opacity-50 cursor-pointer"
                  aria-label="Adjust question count slider"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>1</span>
                  <span>Max 30</span>
                </div>
              </div>
              
              <button 
                onClick={handleAiGeneration} 
                disabled={isGenerating || isParsingPdf || !aiContext.trim()}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-black py-4 px-4 rounded-xl text-xs uppercase tracking-widest hover:bg-slate-800 focus:ring-4 focus:ring-slate-200 disabled:opacity-50 disabled:hover:bg-slate-900 transition-all active:scale-[0.98]"
                aria-label="Generate questions"
              >
                {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <BrainCircuit size={16} />}
                {isGenerating && chunkProgress 
                  ? `Chunk ${chunkProgress.current} of ${chunkProgress.total}...` 
                  : isGenerating 
                  ? `Generating ${desiredQuestionCount} Questions...` 
                  : `Generate ~${desiredQuestionCount} Questions`}
              </button>
            </div>
          </aside>

          {/* Staging Matrix Column */}
          <section className="lg:col-span-2 space-y-6">
            
            {/* Stats Card */}
            {stats && (
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-6 items-center justify-between animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-slate-700 font-black text-xs uppercase tracking-widest">
                  <BarChart size={16} className="text-blue-500" /> Generation Stats
                </div>
                <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
                  <div className="flex flex-col"><span className="text-[10px] text-slate-400 uppercase font-bold">Requested</span> {stats.requested}</div>
                  <div className="flex flex-col"><span className="text-[10px] text-slate-400 uppercase font-bold">Generated</span> <span className="text-emerald-600 font-bold">{stats.generated}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-slate-400 uppercase font-bold">Total Staged</span> {stats.totalInStaging}</div>
                  <div className="flex flex-col"><span className="text-[10px] text-slate-400 uppercase font-bold">Success</span> {stats.successRate}%</div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-md font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                Staging Matrix 
                <span className="bg-slate-200 text-slate-700 py-0.5 px-2 rounded-full text-xs">
                  {stagedQuestions.length}
                </span>
              </h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  type="button" 
                  onClick={() => addBlankQuestion('MCQ')} 
                  disabled={isGenerating || isPublishing}
                  className="flex-1 sm:flex-none py-2 px-3 text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 focus:ring-2 focus:ring-blue-400 disabled:opacity-50 transition-colors"
                >
                  + MCQ
                </button>
                <button 
                  type="button" 
                  onClick={() => addBlankQuestion('MSQ')} 
                  disabled={isGenerating || isPublishing}
                  className="flex-1 sm:flex-none py-2 px-3 text-xs font-black bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100 focus:ring-2 focus:ring-purple-400 disabled:opacity-50 transition-colors"
                >
                  + MSQ
                </button>
              </div>
            </div>

            {stagedQuestions.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-8 sm:p-16 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                  <BrainCircuit className="text-slate-300" size={40} />
                </div>
                <div className="space-y-2 max-w-sm">
                  <h3 className="text-slate-700 font-black text-lg">No Questions Yet</h3>
                  <p className="text-sm text-slate-500 font-medium">
                    <span className="text-emerald-600 font-bold">Upload a document</span>, 
                    <span className="text-blue-600 font-bold"> create questions manually</span>, or 
                    <span className="text-purple-600 font-bold"> generate using AI</span> to build your assessment.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {stagedQuestions.map((q, idx) => {
                  const qErrors = questionsValidity.get(q.id) || [];
                  const isInvalid = qErrors.length > 0;

                  return (
                    <div 
                      key={q.id} 
                      className={`bg-white border rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 transition-colors ${isInvalid ? 'border-rose-300 bg-rose-50/10' : 'border-slate-200'}`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded text-slate-600">
                            Q{idx + 1} ({q.type})
                          </span>
                          {isInvalid ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                              <AlertTriangle size={12} /> Invalid
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                              <CheckCircle2 size={12} /> Valid
                            </span>
                          )}
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeQuestion(q.id)} 
                          disabled={isGenerating || isPublishing}
                          className="text-slate-400 hover:text-rose-600 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 rounded p-1"
                          aria-label={`Remove question ${idx + 1}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      
                      <input 
                        type="text" 
                        placeholder="Formulate question query context..." 
                        value={q.question_text}
                        disabled={isGenerating || isPublishing}
                        onChange={(e) => {
                          const nextText = e.target.value;
                          updateQuestionState(q.id, item => ({ ...item, question_text: nextText }));
                        }}
                        className={`w-full p-2 border-b-2 font-bold focus:outline-none text-sm sm:text-base bg-transparent transition-colors ${!q.question_text.trim() ? 'border-rose-300 focus:border-rose-500' : 'border-slate-100 focus:border-slate-900'}`}
                      />
                      
                      {q.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          {q.options.map((opt, oIdx) => {
                            const isCorrect = q.correct_answers.includes(opt) && opt.trim() !== '';
                            const isDuplicate = opt.trim() !== '' && q.options.filter(o => o.trim().toLowerCase() === opt.trim().toLowerCase()).length > 1;

                            return (
                              <label 
                                key={oIdx} 
                                className={`flex items-center gap-3 border rounded-xl p-3 cursor-pointer transition-all ${
                                  isCorrect ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500' : 
                                  isDuplicate ? 'border-rose-300 bg-rose-50/50' :
                                  'border-slate-200 bg-white hover:border-slate-300'
                                }`}
                              >
                                <input 
                                  type={q.type === 'MCQ' ? 'radio' : 'checkbox'}
                                  checked={isCorrect}
                                  disabled={isGenerating || isPublishing || opt.trim() === ''}
                                  name={`correct-${q.id}`}
                                  onChange={() => {
                                    updateQuestionState(q.id, item => {
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
                                    });
                                  }}
                                  className={`w-4 h-4 cursor-pointer ${q.type === 'MCQ' ? 'accent-emerald-600' : 'accent-emerald-600 rounded'}`}
                                />
                                <input 
                                  type="text" 
                                  value={opt} 
                                  disabled={isGenerating || isPublishing}
                                  placeholder={`Option ${oIdx + 1}`}
                                  onChange={(e) => {
                                    const nextValue = e.target.value;
                                    updateQuestionState(q.id, item => {
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
                                    });
                                  }}
                                  className={`bg-transparent text-sm w-full focus:outline-none font-medium placeholder-slate-300 ${isDuplicate ? 'text-rose-700' : 'text-slate-800'}`}
                                />
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {/* Real-time Inline Errors Validation UI */}
                      {isInvalid && (
                        <div className="mt-3 bg-rose-50 border border-rose-100 rounded-lg p-3 space-y-1.5">
                          {qErrors.map((err, errIdx) => (
                            <p key={errIdx} className="text-xs text-rose-600 font-medium flex items-center gap-1.5">
                              <AlertCircle size={12} className="shrink-0" /> {err}
                            </p>
                          ))}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}
            
            {stagedQuestions.length > 0 && (
              <button 
                onClick={saveAndPublishTest} 
                disabled={isPublishing || isGenerating}
                className="w-full bg-emerald-600 text-white font-black py-4 sm:py-5 rounded-2xl text-xs sm:text-sm uppercase tracking-widest hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-200 transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-100 disabled:opacity-50 disabled:hover:bg-emerald-600 sticky bottom-4 sm:static active:scale-[0.99]"
              >
                {isPublishing ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {isPublishing ? 'Executing Global Commit Write Operations...' : 'Commit and Publish Test Object'}
              </button>
            )}
            
          </section>
        </div>
      </div>
    </main>
  );
}