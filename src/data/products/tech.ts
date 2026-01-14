export interface TechProduct {
  id: number;
  category: string;
  examTag: string;
  subjects: string[];
  name: string;
  author: string; // Brand name used as author for consistency
  price: string;
  originalPrice: string;
  image: string;
  description: string;
  link: string;
}

export const tech: TechProduct[] = [
  {
    id: 401,
    category: 'Tech & Tabs',
    examTag: 'Stylus Tablets',
    subjects: ['Note-taking', 'Samsung'],
    name: 'Samsung Galaxy Tab S9 FE',
    author: 'Samsung',
    price: '₹32,999',
    originalPrice: '45,000',
    image: 'https://m.media-amazon.com/images/I/61N9p7G9yFL.jpg',
    description: 'The best budget-friendly tablet for students. Includes an S-Pen in the box, making it perfect for digital biology diagrams and handwritten organic chemistry notes.',
    link: 'YOUR_LINK'
  },
  {
    id: 402,
    category: 'Tech & Tabs',
    examTag: 'Stylus Tablets',
    subjects: ['Note-taking', 'Apple'],
    name: 'Apple iPad Air (M2)',
    author: 'Apple',
    price: '₹54,900',
    originalPrice: '59,900',
    image: 'https://m.media-amazon.com/images/I/71Vf68vS6zL._SL1500_.jpg',
    description: 'Incredibly powerful M2 chip. Pair with Apple Pencil for the most fluid note-taking experience in lectures.',
    link: 'YOUR_LINK'
  },
  {
    id: 403,
    category: 'Tech & Tabs',
    examTag: 'Coding Laptops',
    subjects: ['Research', 'Data Science'],
    name: 'MacBook Air M3',
    author: 'Apple',
    price: '₹1,04,900',
    originalPrice: '1,14,900',
    image: 'https://m.media-amazon.com/images/I/71ItMhg1anL._SL1500_.jpg',
    description: 'Silent, powerful, and long battery life. Ideal for bioinformatics processing and long study sessions.',
    link: 'YOUR_LINK'
  }
];