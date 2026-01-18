export interface Course {
  id: number;
  category: string;
  examTag: string;
  subjects: string[];
  name: string;
  author: string; // The platform or instructor name
  price: string;
  originalPrice: string;
  image: string;
  description: string;
  link: string;
}

export const courses: Course[] = [
  {
    id: 501,
    category: 'Courses',
    examTag: 'CSIR NET',
    subjects: ['Life Sciences', 'Unit 1-13'],
    name: 'CSIR NET Life Sciences - Comprehensive Batch',
    author: 'Synapse Academy',
    price: '₹4,999',
    originalPrice: '9,999',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop', 
    description: 'A complete video course covering the entire syllabus for CSIR NET Life Sciences with mock tests and PDF notes.',
    link: '#' // Replace with your affiliate link
  },
  {
    id: 502,
    category: 'Courses',
    examTag: 'Biotech',
    subjects: ['Bioprocess', 'Genetics'],
    name: 'Industrial Biotechnology Certification',
    author: 'Edu-Bio',
    price: '₹2,499',
    originalPrice: '5,000',
    image: 'https://images.unsplash.com/photo-1532187863486-abf51ad9f69d?q=80&w=2070&auto=format&fit=crop',
    description: 'Learn the core principles of industrial biotechnology, from fermentation technology to downstream processing.',
    link: '#' // Replace with your affiliate link
  },
  {
    id: 503,
    category: 'Courses',
    examTag: 'Data Science',
    subjects: ['Python', 'Statistics'],
    name: 'Python for Biologists',
    author: 'Bio-Code',
    price: '₹1,599',
    originalPrice: '3,200',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop',
    description: 'The perfect entry point for biologists to learn Python coding for data analysis and visualization.',
    link: '#' // Replace with your affiliate link
  }
];