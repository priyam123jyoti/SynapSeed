"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Brain, Plus, FileText, Send } from "lucide-react";

export default function QuizCreator() {
  const [mode, setMode] = useState<'scratch' | 'ai'>('scratch');
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);

  // Function to add a new blank question
  const addQuestion = (type: 'MCQ' | 'FITB' | 'MSQ') => {
    setQuestions([...questions, { 
      type, 
      question_text: "", 
      options: type === 'FITB' ? [] : ["", "", "", ""], 
      correct_answers: [] 
    }]);
  };

  const handleAISuggestion = async (text: string) => {
    // This is where you would call your Gemini/AI API 
    // to parse the text into a JSON object of questions.
    alert("AI is processing your document/text...");
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-emerald-900 uppercase italic">Quiz Engine Admin</h1>
        <div className="flex bg-emerald-100 p-1 rounded-xl">
          <button onClick={() => setMode('scratch')} className={`px-4 py-2 rounded-lg text-xs font-bold ${mode === 'scratch' ? 'bg-emerald-600 text-white' : 'text-emerald-700'}`}>Manual Scratch</button>
          <button onClick={() => setMode('ai')} className={`px-4 py-2 rounded-lg text-xs font-bold ${mode === 'ai' ? 'bg-emerald-600 text-white' : 'text-emerald-700'}`}>AI Smart Import</button>
        </div>
      </header>

      {mode === 'ai' && (
        <div className="mb-10 p-6 bg-lime-50 rounded-2xl border-2 border-lime-200">
          <h3 className="flex items-center gap-2 text-lime-800 font-bold mb-4"><Brain size={18}/> AI Question Generator</h3>
          <textarea 
            placeholder="Paste your PDF text or long notes here..." 
            className="w-full h-40 p-4 rounded-xl border-none focus:ring-2 focus:ring-lime-400 outline-none"
          />
          <button className="mt-4 bg-lime-500 text-emerald-950 px-6 py-2 rounded-full font-black text-xs hover:bg-lime-400">GENERATE DRAFT</button>
        </div>
      )}

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={idx} className="p-6 bg-white rounded-2xl border border-emerald-100 shadow-sm">
            <div className="flex justify-between mb-4">
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{q.type}</span>
            </div>
            <input 
              placeholder="Type your question here..." 
              className="w-full text-lg font-bold border-b border-emerald-50 mb-4 focus:border-emerald-500 outline-none"
            />
            
            {/* Logic changes based on type */}
            {q.type === 'FITB' ? (
              <input placeholder="Enter correct word(s)" className="w-full p-3 bg-slate-50 rounded-lg italic" />
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {q.options.map((opt: any, oIdx: number) => (
                  <div key={oIdx} className="flex items-center gap-2">
                    <input type={q.type === 'MCQ' ? "radio" : "checkbox"} />
                    <input placeholder={`Option ${oIdx + 1}`} className="flex-1 text-sm p-2 border-b border-slate-100 outline-none" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        <div className="flex gap-4">
          <button onClick={() => addQuestion('MCQ')} className="flex-1 border-2 border-dashed border-emerald-200 p-4 rounded-2xl text-emerald-600 hover:bg-emerald-50 flex flex-col items-center gap-2 transition-all">
            <Plus size={20} /> <span className="text-[10px] font-black uppercase">Add MCQ</span>
          </button>
          <button onClick={() => addQuestion('FITB')} className="flex-1 border-2 border-dashed border-emerald-200 p-4 rounded-2xl text-emerald-600 hover:bg-emerald-50 flex flex-col items-center gap-2 transition-all">
            <FileText size={20} /> <span className="text-[10px] font-black uppercase">Add Fill-In</span>
          </button>
        </div>
      </div>
    </div>
  );
}