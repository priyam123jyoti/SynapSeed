"use client";

import { memo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Atom, Beaker, Leaf, Dog, ArrowRight } from 'lucide-react';

const SUBJECTS = [
  {
    id: 'physics',
    title: 'Physics',
    icon: <Atom size={32} />,
    stats: '8,500+ Questions',
    topic: 'Mechanics and Thermodynamics', // The auto-search term
    description: 'Master Mechanics to Quantum Physics with AI-driven problem solving.',
    color: 'from-blue-500/20 to-cyan-500/20',
    border: 'hover:border-blue-400',
    iconColor: 'text-blue-500'
  },
  {
    id: 'chemistry',
    title: 'Chemistry',
    icon: <Beaker size={32} />,
    stats: '12,000+ Questions',
    topic: 'Organic Chemistry Mechanisms',
    description: 'Organic mechanisms and Chemical bonding deconstructed by MoanaAI.',
    color: 'from-emerald-500/20 to-teal-500/20',
    border: 'hover:border-emerald-400',
    iconColor: 'text-emerald-500'
  },
  {
    id: 'botany',
    title: 'Botany',
    icon: <Leaf size={32} />,
    stats: '10,200+ Questions',
    topic: 'Plant Physiology and Anatomy',
    description: 'Deep dive into Plant Physiology, Genetics, and Taxonomy.',
    color: 'from-green-500/20 to-lime-500/20',
    border: 'hover:border-green-400',
    iconColor: 'text-green-500'
  },
  {
    id: 'zoology',
    title: 'Zoology',
    icon: <Dog size={32} />,
    stats: '9,800+ Questions',
    topic: 'Animal Kingdom and Physiology',
    description: 'From Animal Diversity to Human Physiology, mastered through active recall.',
    color: 'from-rose-500/20 to-orange-500/20',
    border: 'hover:border-rose-400',
    iconColor: 'text-rose-500'
  }
];

const SubjectPillars = memo(() => {
  const router = useRouter();

  const handleStartQuiz = (id: string, name: string, topic: string) => {
    // Navigates and passes the specific topic as a 'query'
    router.push(`/quiz?subject=${id}&name=${name}&query=${encodeURIComponent(topic)}`);
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Choose Your <span className="text-emerald-600">Battlefield</span>
          </h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto">
            MoanaAI has indexed millions of data points across the core sciences to generate infinite practice for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SUBJECTS.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleStartQuiz(subject.id, subject.title, subject.topic)}
              className={`
                group relative p-8 rounded-[2rem] border border-gray-100 bg-white shadow-sm
                transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-gray-200/50
                flex flex-col h-full cursor-pointer overflow-hidden ${subject.border}
              `}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />

              <div className={`mb-6 p-4 w-fit rounded-2xl bg-white shadow-sm ${subject.iconColor}`}>
                {subject.icon}
              </div>

              <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">
                {subject.title}
              </h3>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                  {subject.stats}
                </span>
              </div>

              <p className="text-sm text-gray-500 leading-relaxed font-medium mb-8">
                {subject.description}
              </p>

              <button className="mt-auto flex items-center justify-between w-full p-4 bg-gray-900 text-white rounded-2xl font-bold text-xs group-hover:bg-black transition-all">
                Initiate AI Quiz
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

SubjectPillars.displayName = 'SubjectPillars';
export default SubjectPillars;