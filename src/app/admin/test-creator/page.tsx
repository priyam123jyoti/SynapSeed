"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Brain, Plus, FileText, Send, UploadCloud, Loader2, Trash2 } from "lucide-react";

// 1. Explicitly layout type rules for standard question fields
type QuestionType = "MCQ" | "FITB" | "MSQ";

interface Question {
  id: string;
  type: QuestionType;
  question_text: string;
  questionText: string; // Synced camelCase vector
  options: string[];
  correct_answers: string[];
  correctAnswers: string[]; // Synced camelCase vector
}

export default function TestCreator() {
  const [mode, setMode] = useState<"scratch" | "ai">("scratch");
  const [testTitle, setTestTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // AI Form States
  const [aiText, setAiText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const addQuestion = (type: QuestionType) => {
    // Fallback safe client-side UUID string generator
    const uniqueId = typeof crypto !== "undefined" && crypto.randomUUID 
      ? crypto.randomUUID() 
      : Math.random().toString(36).substring(2, 11);

    setQuestions([
      ...questions, 
      { 
        id: uniqueId,
        type, 
        question_text: "", 
        questionText: "", 
        options: type === "FITB" ? [] : ["", "", "", ""], 
        correct_answers: [],
        correctAnswers: []
      }
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestionText = (index: number, text: string) => {
    const updated = [...questions];
    updated[index].question_text = text;
    updated[index].questionText = text; // Dual key sync mutation
    setQuestions(updated);
  };

  const updateOptionText = (qIdx: number, oIdx: number, val: string) => {
    const updated = [...questions];
    updated[qIdx].options[oIdx] = val;
    setQuestions(updated);
  };

  const toggleCorrectAnswer = (qIdx: number, optionValue: string, type: QuestionType) => {
    const updated = [...questions];
    let currentAnswers = updated[qIdx].correct_answers || [];

    if (type === "MCQ") {
      currentAnswers = [optionValue];
    } else {
      if (currentAnswers.includes(optionValue)) {
        currentAnswers = currentAnswers.filter((a) => a !== optionValue);
      } else {
        currentAnswers = [...currentAnswers, optionValue];
      }
    }

    updated[qIdx].correct_answers = currentAnswers;
    updated[qIdx].correctAnswers = currentAnswers; // Dual key sync mutation
    setQuestions(updated);
  };

  const handleAIGenerateDraft = async () => {
    if (!aiText.trim() && !selectedFile) {
      alert("Please paste text notes or upload a standard lecture PDF file first.");
      return;
    }

    setIsGenerating(true);
    const formData = new FormData();
    if (selectedFile) formData.append("file", selectedFile);
    if (aiText) formData.append("text", aiText);

    try {
      const res = await fetch("/api/generate-test", {
        method: "POST",
        body: formData
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server raw response:", errorText);
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();
      
      if (data.questions && Array.isArray(data.questions)) {
        setQuestions(data.questions);
        alert(`AI generated ${data.questions.length} questions successfully! Review the draft below.`);
      } else {
        throw new Error(data.error || "Malformed response payload configuration.");
      }
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Unknown syntax conversion exception";
      alert("AI failed to cleanly convert text array elements: " + msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (questions.length === 0) {
      alert("Please add at least one question into the matrix before broadcasting.");
      return;
    }
    
    setIsPublishing(true);

    try {
      const { data, error } = await supabase
        .from("quizzes") 
        .insert([{ 
          title: testTitle || "Untitled Academic Test Assessment", 
          description: "Departmental Evaluation Node Registry",
          questions: questions 
        }])
        .select("id")
        .single();

      if (error) throw error;

      const testLink = `${window.location.origin}/test/${data.id}`;
      
      await fetch("/api/notify-students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testTitle: testTitle || "Untitled Test Assessment",
          testLink: testLink
        })
      });

      alert("Test Assessment Published and Students Notified Successfully!");
      setQuestions([]);
      setTestTitle("");
      setAiText("");
      setSelectedFile(null);

    } catch (err) {
      console.error("Publishing error:", err);
      alert("Failed saving test data profiles to cloud tracking matrix.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-emerald-900 uppercase italic">Test Generation Admin</h1>
        <div className="flex bg-emerald-100 p-1 rounded-xl">
          <button onClick={() => setMode("scratch")} className={`px-4 py-2 rounded-lg text-xs font-bold ${mode === "scratch" ? "bg-emerald-600 text-white" : "text-emerald-700"}`}>Manual Scratch</button>
          <button onClick={() => setMode("ai")} className={`px-4 py-2 rounded-lg text-xs font-bold ${mode === "ai" ? "bg-emerald-600 text-white" : "text-emerald-700"}`}>AI Smart Import</button>
        </div>
      </header>

      {mode === "ai" && (
        <div className="mb-10 p-6 bg-lime-50 rounded-3xl border-2 border-lime-200 space-y-4">
          <h3 className="flex items-center gap-2 text-lime-800 font-bold"><Brain size={18}/> AI Material Extraction Portal</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-lime-700 mb-1">Paste Material (Max 40k Chars)</label>
              <textarea 
                placeholder="Paste long topics, reading notes, or pre-made past tests here..." 
                value={aiText}
                onChange={(e) => setAiText(e.target.value)}
                maxLength={40000}
                className="w-full h-44 p-4 rounded-xl border-none focus:ring-2 focus:ring-lime-400 outline-none text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-lime-700 mb-1">Or Upload Document (Max 8 Pages PDF)</label>
              <div className="w-full h-44 border-2 border-dashed border-lime-300 rounded-xl bg-white flex flex-col items-center justify-center p-4 relative cursor-pointer hover:bg-lime-100/50 transition-colors">
                <input 
                  type="file" 
                  accept="application/pdf"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <UploadCloud size={32} className="text-lime-600 mb-2" />
                <span className="text-xs font-bold text-slate-600 truncate max-w-full">
                  {selectedFile ? selectedFile.name : "Select or Drop PDF File Here"}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 font-medium">Parsed safely in-memory</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleAIGenerateDraft}
            disabled={isGenerating}
            className="w-full bg-lime-600 text-white py-3 rounded-xl font-black text-xs hover:bg-lime-700 uppercase tracking-widest flex items-center justify-center gap-2"
          >
            {isGenerating ? <Loader2 size={16} className="animate-spin"/> : null}
            {isGenerating ? "Parsing Text & Materials..." : "Generate Test Draft"}
          </button>
        </div>
      )}

      <div className="mb-8">
        <input 
          type="text"
          placeholder="Enter Test Title (e.g., Cell Division Term Evaluation)"
          value={testTitle}
          onChange={(e) => setTestTitle(e.target.value)}
          className="w-full text-2xl font-black text-slate-800 border-b-2 border-slate-200 pb-3 focus:border-emerald-500 outline-none placeholder-slate-300 bg-transparent transition-colors"
        />
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={q.id || idx} className="p-6 bg-white rounded-2xl border border-emerald-100 shadow-sm relative group">
            <button 
              onClick={() => removeQuestion(idx)}
              className="absolute top-6 right-6 text-slate-300 hover:text-rose-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>

            <div className="flex justify-between mb-4">
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{q.type}</span>
            </div>
            
            <input 
              value={q.question_text || q.questionText || ""} 
              onChange={(e) => updateQuestionText(idx, e.target.value)}
              placeholder="Type your question content configuration here..." 
              className="w-full text-lg font-bold border-b border-emerald-50 mb-4 focus:border-emerald-500 outline-none pr-10"
            />
            
            {q.type === "FITB" ? (
              <input 
                value={q.correct_answers?.[0] || ""}
                onChange={(e) => {
                  const updated = [...questions];
                  const val = e.target.value;
                  updated[idx].correct_answers = [val];
                  updated[idx].correctAnswers = [val]; // Mirror key updates safely
                  setQuestions(updated);
                }}
                placeholder="Enter correct blank literal keyword(s)" 
                className="w-full p-3 bg-slate-50 rounded-lg italic font-semibold text-sm border-none focus:ring-2 focus:ring-emerald-500 outline-none" 
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(q.options || []).map((opt: string, oIdx: number) => {
                  const isChecked = q.correct_answers?.includes(opt) && opt !== "";
                  return (
                    <div key={oIdx} className="flex items-center gap-3 p-2 bg-slate-50/50 rounded-xl border border-slate-100">
                      <input 
                        type={q.type === "MCQ" ? "radio" : "checkbox"} 
                        name={`correct-ans-${idx}`}
                        checked={isChecked}
                        onChange={() => toggleCorrectAnswer(idx, opt, q.type)}
                        className="w-4 h-4 accent-emerald-600 cursor-pointer"
                      />
                      <input 
                        value={opt} 
                        onChange={(e) => updateOptionText(idx, oIdx, e.target.value)}
                        placeholder={`Option ${oIdx + 1}`} 
                        className="flex-1 text-sm bg-transparent border-b border-transparent focus:border-slate-300 outline-none font-semibold text-slate-700" 
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
        
        <div className="flex gap-4">
          <button onClick={() => addQuestion("MCQ")} className="flex-1 border-2 border-dashed border-emerald-200 p-4 rounded-2xl text-emerald-600 hover:bg-emerald-50 flex flex-col items-center gap-2 transition-all">
            <Plus size={20} /> <span className="text-[10px] font-black uppercase">Add MCQ</span>
          </button>
          <button onClick={() => addQuestion("MSQ")} className="flex-1 border-2 border-dashed border-emerald-200 p-4 rounded-2xl text-emerald-600 hover:bg-emerald-50 flex flex-col items-center gap-2 transition-all">
            <Plus size={20} /> <span className="text-[10px] font-black uppercase">Add MSQ</span>
          </button>
          <button onClick={() => addQuestion("FITB")} className="flex-1 border-2 border-dashed border-emerald-200 p-4 rounded-2xl text-emerald-600 hover:bg-emerald-50 flex flex-col items-center gap-2 transition-all">
            <FileText size={20} /> <span className="text-[10px] font-black uppercase">Add Fill-In</span>
          </button>
        </div>

        {questions.length > 0 && (
          <div className="pt-8 border-t border-slate-200 mt-8">
            <button 
              onClick={handlePublish}
              disabled={isPublishing}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white p-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-slate-200"
            >
              {isPublishing ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              <span className="font-black uppercase tracking-widest text-sm">
                {isPublishing ? "Syncing Test Documents..." : "Publish & Broadcast Test"}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}