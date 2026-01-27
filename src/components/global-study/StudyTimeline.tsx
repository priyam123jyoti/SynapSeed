"use client";

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Search, PenTool, Mail, FileCheck, Plane, AlertCircle } from 'lucide-react';

// Data localized here for easy editing
const TIMELINE_STEPS = [
  {
    id: 1,
    phase: '12-15 Months Before',
    title: 'Research & Shortlisting',
    description: 'Don\'t apply blindly. Filter universities based on "fully funded" availability, not just ranking.',
    icon: <Search size={18} />,
    color: 'bg-blue-100 text-blue-600',
    border: 'border-blue-200',
    todos: ['Check DAAD/Commonwealth Requirements', 'Filter by "Zero Tuition" Countries', 'Draft initial University List']
  },
  {
    id: 2,
    phase: '10-12 Months Before',
    title: 'The Exam Sprint',
    description: 'This is the most painful part. Finish it early so you can focus on essays later.',
    icon: <PenTool size={18} />,
    color: 'bg-purple-100 text-purple-600',
    border: 'border-purple-200',
    todos: ['Take GRE/GMAT (Aim for 320+)', 'Take IELTS/TOEFL (Aim for 7.5+)', 'Retake if score is low (Don\'t wait)']
  },
  {
    id: 3,
    phase: '8-10 Months Before',
    title: 'The "Cold Email" Season',
    description: 'For research degrees, you need a Professor\'s approval before the University\'s approval.',
    icon: <Mail size={18} />,
    color: 'bg-amber-100 text-amber-600',
    border: 'border-amber-200',
    todos: ['Read 2-3 papers of target Professors', 'Send "Cover Letter" style emails', 'Request Zoom interviews']
  },
  {
    id: 4,
    phase: '6-8 Months Before',
    title: 'Applications & SOPs',
    description: 'Your Statement of Purpose (SOP) is the tie-breaker. It must tell a story, not just list grades.',
    icon: <FileCheck size={18} />,
    color: 'bg-rose-100 text-rose-600',
    border: 'border-rose-200',
    todos: ['Get 3 Letters of Recommendation (LOR)', 'Customize SOP for each University', 'Submit before the "Early Deadline"']
  },
  {
    id: 5,
    phase: '3-5 Months Before',
    title: 'Visa & Logistics',
    description: 'You got the offer! Now handle the bureaucracy.',
    icon: <Plane size={18} />,
    color: 'bg-emerald-100 text-emerald-600',
    border: 'border-emerald-200',
    todos: ['Open Blocked Account (if Germany)', 'Book Flight Tickets (Student Discount)', 'Apply for Student Visa']
  }
];

const StudyTimeline = memo(() => {
  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      {/* Introduction Warning */}
      <div className="mb-10 bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 items-start">
        <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="font-bold text-amber-900 text-sm">Timelines are strict!</h4>
          <p className="text-xs text-amber-700 mt-1">
            Missing a deadline by 1 hour often means waiting an entire year. Set calendar reminders for these phases.
          </p>
        </div>
      </div>

      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
        {TIMELINE_STEPS.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
          >
            {/* The Dot on the Line */}
            <div className="absolute left-0 md:left-1/2 w-10 h-10 bg-white border-4 border-gray-100 rounded-full flex items-center justify-center shrink-0 z-10 -translate-x-0 md:-translate-x-1/2 shadow-sm group-hover:scale-110 transition-transform duration-300">
               <div className={`${step.color} p-1.5 rounded-full`}>
                 {step.icon}
               </div>
            </div>

            {/* The Content Card */}
            <div className="w-full md:w-[calc(50%-2.5rem)] ml-16 md:ml-0 p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex flex-col gap-1 mb-2">
                <span className={`w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${step.color} bg-opacity-10`}>
                  {step.phase}
                </span>
                <h3 className="text-lg font-black text-gray-900 leading-tight">
                  {step.title}
                </h3>
              </div>
              
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                {step.description}
              </p>

              {/* Todo List */}
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <ul className="space-y-2">
                  {step.todos.map((todo, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs font-medium text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0" />
                      {todo}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

StudyTimeline.displayName = 'StudyTimeline';
export default StudyTimeline;