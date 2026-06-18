"use client";

import { useState } from "react";
import { Brain, Plus, FileText, Send, UploadCloud, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

type QuestionType = "MCQ" | "FITB" | "MSQ";

interface Question {
  id: string;
  type: QuestionType;
  question_text: string;
  options: string[];
  correct_answers: string[];
}

// Helper function to extract text directly from a file stream layout in-browser
async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .join(' ');
    fullText += pageText + "\n";
  }

  return fullText.trim();
}

export default function TestCreator() {
  const router = useRouter();
  const [mode, setMode] = useState<"scratch" | "ai">("scratch");
  const [testTitle, setTestTitle] = useState("");
  const [testDescription, setTestDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [aiText, setAiText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const addQuestion = (type: QuestionType) => {
    const uniqueId = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 11);

    setQuestions((prev) => [
      ...prev,
      {
        id: uniqueId,
        type,
        question_text: "",
        options: type === "FITB" ? [] : ["", "", "", ""],
        correct_answers: [],
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuestionText = (index: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, question_text: text } : q))
    );
  };

  const updateOptionText = (qIdx: number, oIdx: number, val: string) => {
    setQuestions((prev) =>
      prev.map((q, idx) => {
        if (idx !== qIdx) return q;

        const oldOptionValue = q.options[oIdx];
        const nextOptions = [...q.options];
        nextOptions[oIdx] = val;

        const nextCorrectAnswers = q.correct_answers.map((ans) =>
          ans === oldOptionValue ? val : ans
        );

        return {
          ...q,
          options: nextOptions,
          correct_answers: nextCorrectAnswers,
        };
      })
    );
  };

  const toggleCorrectAnswer = (qIdx: number, optionValue: string, type: QuestionType) => {
    if (!optionValue.trim()) {
      alert("Please specify option text before marking it as correct.");
      return;
    }

    setQuestions((prev) =>
      prev.map((q, idx) => {
        if (idx !== qIdx) return q;

        let nextCorrectAnswers = [...q.correct_answers];

        if (type === "MCQ") {
          nextCorrectAnswers = [optionValue];
        } else {
          if (nextCorrectAnswers.includes(optionValue)) {
            nextCorrectAnswers = nextCorrectAnswers.filter((a) => a !== optionValue);
          } else {
            nextCorrectAnswers = [...nextCorrectAnswers, optionValue];
          }
        }

        return {
          ...q,
          correct_answers: nextCorrectAnswers,
        };
      })
    );
  };

  const handleAIGenerateDraft = async () => {
    if (!aiText.trim() && !selectedFile) {
      alert("Please provide context text or drop a target PDF asset.");
      return;
    }

    setIsGenerating(true);
    try {
      let textToSend = aiText;

      if (selectedFile) {
        try {
          textToSend = await extractTextFromPDF(selectedFile);
          if (!textToSend.trim()) {
            throw new Error("No readable text found inside this PDF layout structure.");
          }
        } catch (pdfErr) {
          const msg = pdfErr instanceof Error ? pdfErr.message : "PDF processing failure.";
          alert(msg);
          setIsGenerating(false);
          return;
        }
      }

      const formData = new FormData();
      formData.append("text", textToSend);

      const res = await fetch("/api/generate-test", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server status fault code: ${res.status}. Payload: ${errorText}`);
      }

      const data = await res.json();

      if (data.questions && Array.isArray(data.questions)) {
        const formattedQuestions = data.questions.map((q: any) => ({
          id: q.id || Math.random().toString(36).substring(2, 11),
          type: q.type || "MCQ",
          question_text: q.question_text || q.questionText || "",
          options: q.options || (q.type === "FITB" ? [] : ["", "", "", ""]),
          correct_answers: q.correct_answers || q.correctAnswers || []
        }));

        setQuestions((prev) => [...prev, ...formattedQuestions]);
        alert(`AI generated ${data.questions.length} new structural questions successfully.`);
      } else {
        throw new Error(data.error || "Malformed dictionary output schema.");
      }
    } catch (err: any) {
      console.error(err);
      alert("AI execution loop failure: " + (err.message || "Unknown error"));
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!testTitle.trim()) {
      alert("Please provide a definitive Test Title before publishing.");
      return;
    }
    if (questions.length === 0) {
      alert("Please build at least one testing target row block before publishing.");
      return;
    }

    // Comprehensive Deep Integrity Checks: Stops bad schema formats before hitting server
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question_text.trim()) {
        alert(`Question #${i + 1} prompt line text cannot be blank.`);
        return;
      }
      if (q.correct_answers.length === 0 || !q.correct_answers[0]?.trim()) {
        alert(`Question #${i + 1} ("${q.question_text.substring(0, 15)}...") must have an assigned correct answer solution.`);
        return;
      }
      
      if (q.type !== "FITB") {
        for (let o = 0; o < q.options.length; o++) {
          if (!q.options[o].trim()) {
            alert(`Question #${i + 1} contains an empty option field context string at Choice Slot #${o + 1}.`);
            return;
          }
        }
      }
    }

    setIsPublishing(true);

    try {
      const res = await fetch("/api/publish-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: testTitle.trim(),
          description: testDescription.trim() || "Departmental Evaluation",
          questionsArray: questions,
        }),
      });

      // 🛡️ Safe Extraction: Intercept HTML crash dumps from server before running .json()
      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        
        if (contentType && contentType.includes("application/json")) {
          const errData = await res.json();
          throw new Error(errData.error || `Server responded with status code ${res.status}`);
        } else {
          const rawHtmlText = await res.text();
          console.error("🚨 Detailed Server HTML Crash Dump:", rawHtmlText);
          throw new Error(
            `Server configuration error (Status ${res.status}). The backend returned an HTML error page instead of JSON data. Check your server terminal logs.`
          );
        }
      }

      const data = await res.json();

      alert("🎉 Test fully built and distributed to student rosters.");
      
      setQuestions([]);
      setTestTitle("");
      setTestDescription("");
      setAiText("");
      setSelectedFile(null);

      router.push(`/admin/test/${data.testId}`);
    } catch (err: any) {
      console.error("Pipeline failure:", err);
      alert("Publish loop runtime failure: " + err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-emerald-900 uppercase italic">
          Test Generation Admin
        </h1>
        <div className="flex bg-emerald-100 p-1 rounded-xl">
          <button
            onClick={() => setMode("scratch")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === "scratch" ? "bg-emerald-600 text-white" : "text-emerald-700"
            }`}
          >
            Manual Scratch
          </button>
          <button
            onClick={() => setMode("ai")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === "ai" ? "bg-emerald-600 text-white" : "text-emerald-700"
            }`}
          >
            AI Smart Import
          </button>
        </div>
      </header>

      {mode === "ai" && (
        <div className="mb-10 p-6 bg-lime-50 rounded-3xl border-2 border-lime-200 space-y-4">
          <h3 className="flex items-center gap-2 text-lime-800 font-bold">
            <Brain size={18} /> AI Material Extraction
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-lime-700 mb-1">
                Paste Material (Max 40k Chars)
              </label>
              <textarea
                placeholder="Paste context lines, data arrays or notes..."
                value={aiText}
                onChange={(e) => setAiText(e.target.value)}
                maxLength={40000}
                className="w-full h-44 p-4 rounded-xl border-none focus:ring-2 focus:ring-lime-400 outline-none text-sm font-medium bg-white shadow-sm resize-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">{aiText.length} / 40000</p>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-lime-700 mb-1">
                Or Upload PDF (Max 8 Pages)
              </label>
              <div className="w-full h-44 border-2 border-dashed border-lime-300 rounded-xl bg-white flex flex-col items-center justify-center p-4 relative cursor-pointer hover:bg-lime-100/50 transition-colors shadow-sm">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <UploadCloud size={32} className="text-lime-600 mb-2" />
                <span className="text-xs font-bold text-slate-600 truncate max-w-full px-2">
                  {selectedFile ? selectedFile.name : "Select or Drop PDF Here"}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 font-medium text-center">
                  Parsed in browser safely
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleAIGenerateDraft}
            disabled={isGenerating}
            className="w-full bg-lime-600 text-white py-3 rounded-xl font-black text-xs hover:bg-lime-700 uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {isGenerating && <Loader2 size={16} className="animate-spin" />}
            {isGenerating ? "Parsing Knowledge Graph..." : "Generate Test Draft"}
          </button>
        </div>
      )}

      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Enter Test Title (e.g., Cell Division Term Evaluation)"
          value={testTitle}
          onChange={(e) => setTestTitle(e.target.value)}
          className="w-full text-2xl font-black text-slate-800 border-b-2 border-slate-200 pb-2 focus:border-emerald-500 outline-none placeholder-slate-300 bg-transparent transition-colors"
        />
        <input
          type="text"
          placeholder="Enter short description context (e.g., Biology Sem-2 Chapter 4)"
          value={testDescription}
          onChange={(e) => setTestDescription(e.target.value)}
          className="w-full text-sm font-semibold text-slate-600 border-b border-slate-100 pb-2 focus:border-emerald-400 outline-none placeholder-slate-300 bg-transparent transition-colors"
        />
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div
            key={q.id || idx}
            className="p-6 bg-white rounded-2xl border border-emerald-100 shadow-sm relative transition-all hover:shadow-md"
          >
            <button
              onClick={() => removeQuestion(idx)}
              className="absolute top-6 right-6 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
            >
              <Trash2 size={18} />
            </button>

            <div className="mb-4">
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                {q.type}
              </span>
            </div>

            <input
              value={q.question_text}
              onChange={(e) => updateQuestionText(idx, e.target.value)}
              placeholder="Type your question prompt here..."
              className="w-full text-lg font-bold border-b border-emerald-50 mb-4 focus:border-emerald-500 outline-none pr-10 bg-transparent"
            />

            {q.type === "FITB" ? (
              <input
                value={q.correct_answers?.[0] || ""}
                onChange={(e) => {
                  setQuestions((prev) =>
                    prev.map((item, i) =>
                      i === idx ? { ...item, correct_answers: [e.target.value] } : item
                    )
                  );
                }}
                placeholder="Type the exact expected answer keyword..."
                className="w-full p-3 bg-slate-50 rounded-lg italic font-semibold text-sm border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(q.options || []).map((opt: string, oIdx: number) => {
                  const isChecked = q.correct_answers.includes(opt) && opt.trim() !== "";
                  return (
                    <div
                      key={oIdx}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        isChecked ? "bg-emerald-50/50 border-emerald-200" : "bg-slate-50/50 border-slate-100"
                      }`}
                    >
                      <input
                        type={q.type === "MCQ" ? "radio" : "checkbox"}
                        name={`correct-ans-${q.id}`}
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
          <button
            onClick={() => addQuestion("MCQ")}
            className="flex-1 border-2 border-dashed border-emerald-200 p-4 rounded-2xl text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 flex flex-col items-center gap-2 transition-all cursor-pointer"
          >
            <Plus size={20} />
            <span className="text-[10px] font-black uppercase tracking-wider">Add MCQ</span>
          </button>
          <button
            onClick={() => addQuestion("MSQ")}
            className="flex-1 border-2 border-dashed border-emerald-200 p-4 rounded-2xl text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 flex flex-col items-center gap-2 transition-all cursor-pointer"
          >
            <Plus size={20} />
            <span className="text-[10px] font-black uppercase tracking-wider">Add MSQ</span>
          </button>
          <button
            onClick={() => addQuestion("FITB")}
            className="flex-1 border-2 border-dashed border-emerald-200 p-4 rounded-2xl text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 flex flex-col items-center gap-2 transition-all cursor-pointer"
          >
            <FileText size={20} />
            <span className="text-[10px] font-black uppercase tracking-wider">Add Fill-In</span>
          </button>
        </div>

        {questions.length > 0 && (
          <div className="pt-8 border-t border-slate-200 mt-8">
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white p-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.99] shadow-xl shadow-slate-200 cursor-pointer disabled:cursor-not-allowed"
            >
              {isPublishing ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
              <span className="font-black uppercase tracking-widest text-sm">
                {isPublishing ? "Publishing Database Entries..." : "Publish & Broadcast Test"}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}