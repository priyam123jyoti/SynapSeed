import { 
  Microscope, 
  Trophy, 
  Globe2, 
  BookOpen, 
  type LucideIcon 
} from 'lucide-react';

/**
 * MODE INTERFACE
 * Standardizing the shape of our data for TypeScript safety
 */
export interface Mode {
  id: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  color: string;
  path: string; 
  subjectKey: string; 
}

/**
 * MODES CONSTANT
 * Defined outside of the React lifecycle to prevent memory re-allocation.
 * This is "Static Data" - it never needs to change, so we freeze it.
 */
export const MODES: Mode[] = [
  { 
    id: 'quizPhysics', 
    title: "Physics Quiz", 
    desc: "Time is Absolute?", 
    icon: Microscope, 
    color: "from-emerald-500 to-teal-400", 
    path: "/quiz", 
    subjectKey: "physics" 
  },
  { 
    id: 'quizChemistry', 
    title: "Chemistry Quiz", 
    desc: "Do you fear exceptions?", 
    icon: Globe2, 
    color: "from-blue-500 to-cyan-400", 
    path: "/quiz", 
    subjectKey: "chemistry" 
  },
  { 
    id: 'quizBotany', 
    title: "Botany Quiz", 
    desc: "Not all green is Chlorophyll", 
    icon: Trophy, 
    color: "from-amber-500 to-orange-400", 
    path: "/quiz", 
    subjectKey: "botany" 
  },
  { 
    id: 'quizZoology', 
    title: "Zoology Quiz", 
    desc: "Adaptation is intentional?", 
    icon: BookOpen, 
    color: "from-purple-500 to-pink-400", 
    path: "/quiz", 
    subjectKey: "zoology" 
  }
];

// Object.freeze ensures the data cannot be modified at runtime
Object.freeze(MODES);