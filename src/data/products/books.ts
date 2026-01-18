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
  affiliateLink: string; // Renamed from 'link' to match UI expectation
  rating: number;       // Added for UI display
  reviews: number;      // Added for UI display
}

export const books: Book[] = [
  {
    id: 1,
    category: 'Books',
    examTag: 'CSIR-NET',
    subjects: ['Life Sciences', 'Botany', 'Zoology'],
    name: 'Pathfinder: Life Sciences Fundamentals',
    author: 'Pranav Kumar',
    price: '850',
    originalPrice: '1370',
    image: 'https://m.media-amazon.com/images/I/71RCO4qqRcL._SL1500_.jpg',
    description: 'The gold standard for CSIR-NET Life Sciences. Covers biochemistry, genetics, and plant physiology in depth.',
    affiliateLink: 'https://amzn.in/d/eHpolQE',
    rating: 4.8,
    reviews: 1240
  },
  {
    id: 2,
    category: 'Books',
    examTag: 'CSIR-NET',
    subjects: ['Life Sciences', 'Ecology'],
    name: 'Pathfinder Academy : Combo Set With Ecology',
    author: 'Pranav Kumar',
    price: '799',
    originalPrice: '1200',
    image: 'https://m.media-amazon.com/images/I/51nSYj8wX+L._SX342_SY445_FMwebp_.jpg',
    description: 'Includes seven books for the preparation of CSIR JRF NET, Life Sciences and other exams like GATE and DBT-JRF.',
    affiliateLink: 'https://amzn.in/d/itjoOnP',
    rating: 4.7,
    reviews: 890
  },
  {
    id: 3,
    category: 'Books',
    examTag: 'GATE, CSIR NET, ICMR JRF',
    subjects: ['Biology', 'Mind Maps'],
    name: "Shomu's Biology Mind Map for CSIR NET",
    author: 'Shomu Bhattacharjee',
    price: '378',
    originalPrice: '499',
    image: 'https://m.media-amazon.com/images/I/51tvt7uWl2L._SX342_SY445_FMwebp_.jpg',
    description: 'Strategic mind maps for quick revision of biological concepts. Highly rated for visual learners.',
    affiliateLink: 'https://amzn.in/d/510xKoU',
    rating: 4.9,
    reviews: 2100
  },
  {
    id: 4,
    category: 'Books',
    examTag: 'GATE, CSIR NET',
    subjects: ['Life Science', 'MCQs'],
    name: "Pathfinder's CSIR NET MCQs Practice Book",
    author: 'Pranav Kumar',
    price: '378',
    originalPrice: '499',
    image: 'https://m.media-amazon.com/images/I/41Rkva8eJtL._SY445_SX342_FMwebp_.jpg',
    description: "Topic wise and concept based analytical questions for Life Sciences majors.",
    affiliateLink: 'https://amzn.in/d/5l2Uq9n',
    rating: 4.6,
    reviews: 560
  }
  // ... Repeat this pattern for books 5 through 14
];