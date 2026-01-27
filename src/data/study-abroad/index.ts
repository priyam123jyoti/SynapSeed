export interface Country {
  id: string;
  name: string;
  flag: string;
  tuition: string;
  livingCost: string;
  partTime: string;
  postStudyVisa: string;
  topFields: string[];
  image: string;
}

export interface Scholarship {
  id: string;
  name: string;
  country: string;
  coverage: string;
  targetAudience: string;
  examRequired: string;
  deadline: string;
  isFullyFunded: boolean;
}

export interface Exam {
  name: string;
  purpose: string;
  validity: string;
  cost: string;
  minScoreForAid: string;
  acceptedBy: string[];
}

export const STUDY_Tabs = [
  { id: 'destinations', label: 'Top Destinations' },
  { id: 'scholarships', label: 'Scholarship Vault' },
  { id: 'exams', label: 'Exam Matrix' },
  { id: 'timeline', label: 'Action Timeline' },
];

export const COUNTRIES: Country[] = [
  {
    id: 'germany',
    name: 'Germany',
    flag: '🇩🇪',
    tuition: 'Free (Public Unis)',
    livingCost: '€850 - €1000/mo',
    partTime: '20 hrs/week',
    postStudyVisa: '18 Months',
    topFields: ['Biotech', 'Automotive', 'Engineering'],
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=800' 
  },
  {
    id: 'usa',
    name: 'USA',
    flag: '🇺🇸',
    tuition: '$20k - $60k/yr',
    livingCost: '$1,200 - $2,500/mo',
    partTime: 'On-Campus Only',
    postStudyVisa: '1 - 3 Years (STEM)',
    topFields: ['Best Research', 'High Salaries', 'Global Networking'],
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800'
  }
];

export const SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'daad-epos',
    name: 'DAAD EPOS Scholarship',
    country: 'Germany',
    coverage: 'Full Tuition + €850 Stipend + Travel',
    targetAudience: 'Developing Country Students',
    examRequired: 'IELTS (6.0+)',
    deadline: 'Aug - Oct',
    isFullyFunded: true
  }
];

export const EXAMS: Exam[] = [
  {
    name: 'GRE',
    purpose: 'MS/PhD Admission',
    validity: '5 Years',
    cost: '$220',
    minScoreForAid: '320+',
    acceptedBy: ['USA', 'Singapore', 'Germany']
  }
];