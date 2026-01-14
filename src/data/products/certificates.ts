export interface Certificate {
  id: number;
  category: string;
  examTag: string;
  subjects: string[];
  name: string;
  author: string;
  price: string;
  originalPrice: string;
  image: string;
  description: string;
  link: string;
}

export const certificates: Certificate[] = [
  // --- BIOLOGY & BIOINFORMATICS ---
  {
    id: 301,
    category: 'Certificates',
    examTag: 'Bioinformatics',
    subjects: ['Python', 'Genomics', 'Data Science'],
    name: 'Bioinformatics Specialization',
    author: 'UC San Diego',
    price: '₹3,200/mo',
    originalPrice: '4,500',
    image: 'https://m.media-amazon.com/images/I/51pS9pM1mFL.jpg', 
    description: 'Master the computational methods used to analyze DNA sequences. Perfect for Life Science students moving into Tech.',
    link: 'YOUR_COURSERA_LINK'
  },
  {
    id: 302,
    category: 'Certificates',
    examTag: 'Cancer Biology',
    subjects: ['Oncology', 'Molecular Biology'],
    name: 'Cancer Biology Specialization',
    author: 'Johns Hopkins University',
    price: '₹3,900/mo',
    originalPrice: '5,000',
    image: 'https://m.media-amazon.com/images/I/81x1R6fL-qL.jpg', 
    description: 'Deep dive into the molecular basis of cancer. Highly valued for research-oriented students.',
    link: 'YOUR_COURSERA_LINK'
  },

  // --- DATA & AI (HIGH DEMAND) ---
  {
    id: 303,
    category: 'Certificates',
    examTag: 'Data Science',
    subjects: ['Python', 'SQL', 'Data Analysis'],
    name: 'IBM Data Science Professional Certificate',
    author: 'IBM',
    price: '₹2,500/mo',
    originalPrice: '3,800',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/2e/0f/5e/2e0f5e1a-c7a8-444a-a92e-1e1e1e1e1e1e/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512.png/512x512bb.jpg',
    description: 'The #1 certificate for starting a career in Data Science. Includes 10 hands-on courses.',
    link: 'YOUR_COURSERA_LINK'
  },
  {
    id: 304,
    category: 'Certificates',
    examTag: 'IT Support',
    subjects: ['Python', 'Troubleshooting', 'Automation'],
    name: 'Google IT Automation with Python',
    author: 'Google',
    price: '₹1,200/mo',
    originalPrice: '2,000',
    image: 'https://m.media-amazon.com/images/I/61N9p7G9yFL.jpg',
    description: 'Learn how to use Python to automate everyday tasks. Great for anyone wanting to work in Tech.',
    link: 'YOUR_COURSERA_LINK'
  },

  // --- BUSINESS & PRODUCTIVITY ---
  {
    id: 305,
    category: 'Certificates',
    examTag: 'Digital Marketing',
    subjects: ['SEO', 'E-commerce', 'Ads'],
    name: 'Google Digital Marketing & E-commerce',
    author: 'Google',
    price: '₹2,500/mo',
    originalPrice: '3,500',
    image: 'https://m.media-amazon.com/images/I/71RCO4qqRcL._SL1500_.jpg',
    description: 'A complete beginner-to-pro path for digital marketing. Perfect for starting a side-hustle.',
    link: 'YOUR_COURSERA_LINK'
  }
];