"use client";
import Link from "next/link";

export default function QuizWidget({ quiz }: { quiz: any }) {
  // Enhanced Auto-Poster Logic
  const getPoster = (title: string) => {
    const t = title.toLowerCase();
    // Taxonomy Posters
    if (t.includes('taxo') || t.includes('classif') || t.includes('family')) {
      return 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80';
    }
    // Cell/Cytology Posters
    if (t.includes('cell') || t.includes('cyto') || t.includes('micro')) {
      return 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80';
    }
    // Genetics/DNA Posters
    if (t.includes('gene') || t.includes('dna') || t.includes('heredity')) {
      return 'https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?auto=format&fit=crop&q=80';
    }
    // Default Botanical
    return 'https://images.unsplash.com/photo-1501004318641-729e8e3986ff?auto=format&fit=crop&q=80';
  };

  return (
    <div className="group relative w-full h-56 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
      {/* Background Poster */}
      <img 
        src={getPoster(quiz.title)} 
        alt={quiz.title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
      />
      
      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
      
      {/* Content */}
      <div className="absolute bottom-6 left-6 right-6 flex flex-col items-start">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-lime-400 text-emerald-950 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest animate-pulse">
            Professor Challenge
          </span>
          <span className="text-white/60 text-[8px] font-bold uppercase tracking-widest">
            {quiz.question_count || "Multiple"} Questions
          </span>
        </div>
        
        <h4 className="text-white font-black text-2xl leading-tight uppercase italic tracking-tighter mb-4">
          {quiz.title}
        </h4>

        <Link 
          href={`/play-quiz/${quiz.id}`} 
          className="bg-white text-emerald-900 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-lime-400 hover:text-emerald-950 transition-all active:scale-95"
        >
          Begin Quiz
        </Link>
      </div>
    </div>
  );
}