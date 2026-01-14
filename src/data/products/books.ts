export interface Book {
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

export const books: Book[] = [
  {
    id: 1,
    category: 'Books',
    examTag: 'CSIR-NET',
    subjects: ['Life Sciences', 'Botany', 'Zoology'],
    name: 'Pathfinder: Life Sciences Fundamentals',
    author: 'Pranav Kumar',
    price: '₹850',
    originalPrice: '1,370',
    image: 'https://m.media-amazon.com/images/I/71RCO4qqRcL._SL1500_.jpg',
    description: 'The gold standard for CSIR-NET Life Sciences. Covers biochemistry, genetics, and plant physiology in depth.',
    link: 'https://amzn.in/d/eHpolQE'
  },
  {
    id: 2,
    category: 'Books',
    examTag: 'IIT-JAM',
    subjects: ['Physics', 'Mathematics'],
    name: 'Pathfinder Academy : Csir-Jrf-Net Life Sciences Book Combo Set With Ecology',
    author: 'David J. Griffiths',
    price: '₹799',
    originalPrice: '1,200',
    image: 'https://m.media-amazon.com/images/I/51nSYj8wX+L._SX342_SY445_FMwebp_.jpg',
    description: 'It includes seven books for the preparation of CSIR JRF NET, Life Sciences and other examinations like ICMR, GATE, DBT-JRF, IISc, JNU entrance examinations.',
    link: 'https://amzn.in/d/itjoOnP'
  },
  {
    id: 3,
    category: 'Books',
    examTag: 'GATE, CSIR NET, ICMR JRF',
    subjects: ['BIOLOGY', 'Best Rated book'],
    name: "Shomu's Biology Mind Map for Csir Net, Gate, Icmr Jrf (English, Bhattacharjee Suman)",
    author: 'Shomu Bhatacharjee',
    price: '₹378',
    originalPrice: '499',
    image: 'https://m.media-amazon.com/images/I/51tvt7uWl2L._SX342_SY445_FMwebp_.jpg',
    description: 'Essential for IIT-JAM Physics aspirants. Known for clear explanations of electromagnetic theory.',
    link: 'https://amzn.in/d/510xKoU'
  },
  {
    id: 4,
    category: 'Books',
    examTag: 'GATE, CSIR NET, ICMR JRF',
    subjects: ['Life Science', 'Biotechnology'],
    name: "Pathfinder's CSIR NET Life Sciences – MCQs Practice Book | Topic Wise + Concept Based Analytical Questions",
    author: 'Shomu Bhatacharjee',
    price: '₹378',
    originalPrice: '499',
    image: 'https://m.media-amazon.com/images/I/41Rkva8eJtL._SY445_SX342_FMwebp_.jpg',
    description: "Conquer the CSIR NET Life Sciences Exam with Pathfinder's Ultimate MCQ Practice Book!",
    link: 'https://amzn.in/d/5l2Uq9n'
  },
  {
    id: 5,
    category: 'Books',
    examTag: 'IIT-JAM',
    subjects: ['Physics', 'Mathematics'],
    name: 'Pathfinder Academy : Combo Set - 2',
    author: 'David J. Griffiths',
    price: '₹799',
    originalPrice: '1,200',
    image: 'https://m.media-amazon.com/images/I/51nSYj8wX+L._SX342_SY445_FMwebp_.jpg',
    description: 'Comprehensive study material for higher-level life science entrance exams.',
    link: 'https://amzn.in/d/itjoOnP'
  },
  {
    id: 6,
    category: 'Books',
    examTag: 'GATE, CSIR NET, ICMR JRF',
    subjects: ['BIOLOGY', 'Best Rated book'],
    name: "Shomu's Biology Mind Map (Advanced Edition)",
    author: 'Shomu Bhatacharjee',
    price: '₹378',
    originalPrice: '499',
    image: 'https://m.media-amazon.com/images/I/51tvt7uWl2L._SX342_SY445_FMwebp_.jpg',
    description: 'Visual learning tools for complex biological systems.',
    link: 'https://amzn.in/d/510xKoU'
  },
  {
    id: 7,
    category: 'Books',
    examTag: 'GATE, CSIR NET, ICMR JRF',
    subjects: ['Life Science', 'Biotechnology'],
    name: "Pathfinder's MCQs Practice Book - Vol 2",
    author: 'Shomu Bhatacharjee',
    price: '₹378',
    originalPrice: '499',
    image: 'https://m.media-amazon.com/images/I/41Rkva8eJtL._SY445_SX342_FMwebp_.jpg',
    description: "Extensive collection of concept-based questions for competitive exams.",
    link: 'https://amzn.in/d/5l2Uq9n'
  },
  {
    id: 8,
    category: 'Books',
    examTag: 'IIT-JAM',
    subjects: ['Physics', 'Mathematics'],
    name: 'Pathfinder Academy : Combo Set - 3',
    author: 'David J. Griffiths',
    price: '₹799',
    originalPrice: '1,200',
    image: 'https://m.media-amazon.com/images/I/51nSYj8wX+L._SX342_SY445_FMwebp_.jpg',
    description: 'Expertly curated combo for CSIR JRF and ICMR entrance preparation.',
    link: 'https://amzn.in/d/itjoOnP'
  },
  {
    id: 9,
    category: 'Books',
    examTag: 'GATE, CSIR NET, ICMR JRF',
    subjects: ['BIOLOGY', 'Best Rated book'],
    name: "Shomu's Biology Mind Map - Series 3",
    author: 'Shomu Bhatacharjee',
    price: '₹378',
    originalPrice: '499',
    image: 'https://m.media-amazon.com/images/I/51tvt7uWl2L._SX342_SY445_FMwebp_.jpg',
    description: 'Strategic mind maps for quick revision of biological concepts.',
    link: 'https://amzn.in/d/510xKoU'
  },
  {
    id: 10,
    category: 'Books',
    examTag: 'GATE, CSIR NET, ICMR JRF',
    subjects: ['Life Science', 'Biotechnology'],
    name: "Pathfinder's Practice Book - High Intensity",
    author: 'Shomu Bhatacharjee',
    price: '₹378',
    originalPrice: '499',
    image: 'https://m.media-amazon.com/images/I/41Rkva8eJtL._SY445_SX342_FMwebp_.jpg',
    description: "Focuses on analytical and topic-wise questions for Life Science majors.",
    link: 'https://amzn.in/d/5l2Uq9n'
  },
  {
    id: 11,
    category: 'Books',
    examTag: 'IIT-JAM',
    subjects: ['Physics', 'Mathematics'],
    name: 'Pathfinder Academy : Combo Set - 4',
    author: 'David J. Griffiths',
    price: '₹799',
    originalPrice: '1,200',
    image: 'https://m.media-amazon.com/images/I/51nSYj8wX+L._SX342_SY445_FMwebp_.jpg',
    description: 'Full preparation set for DBT-JRF and IISc entrance exams.',
    link: 'https://amzn.in/d/itjoOnP'
  },
  {
    id: 12,
    category: 'Books',
    examTag: 'GATE, CSIR NET, ICMR JRF',
    subjects: ['BIOLOGY', 'Best Rated book'],
    name: "Shomu's Biology Mind Map - Final Revision",
    author: 'Shomu Bhatacharjee',
    price: '₹378',
    originalPrice: '499',
    image: 'https://m.media-amazon.com/images/I/51tvt7uWl2L._SX342_SY445_FMwebp_.jpg',
    description: 'The final companion for biological science competitive success.',
    link: 'https://amzn.in/d/510xKoU'
  },
  {
    id: 13,
    category: 'Books',
    examTag: 'IIT-JAM',
    subjects: ['Physics', 'Mathematics'],
    name: 'Pathfinder Academy : Life Sciences Master Collection',
    author: 'David J. Griffiths',
    price: '₹799',
    originalPrice: '1,200',
    image: 'https://m.media-amazon.com/images/I/51nSYj8wX+L._SX342_SY445_FMwebp_.jpg',
    description: 'All-in-one bundle for various research-level entrance exams.',
    link: 'https://amzn.in/d/itjoOnP'
  },
  {
    id: 14,
    category: 'Books',
    examTag: 'GATE, CSIR NET, ICMR JRF',
    subjects: ['BIOLOGY', 'Best Rated book'],
    name: "Shomu's Biology Mind Map - Exam Ready",
    author: 'Shomu Bhatacharjee',
    price: '₹378',
    originalPrice: '499',
    image: 'https://m.media-amazon.com/images/I/51tvt7uWl2L._SX342_SY445_FMwebp_.jpg',
    description: 'Condensed knowledge for rapid recall during exams.',
    link: 'https://amzn.in/d/510xKoU'
  }
];