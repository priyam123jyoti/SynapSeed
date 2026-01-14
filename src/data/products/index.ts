import { books } from './books';
import { tech } from './tech';
import { certificates } from './certificates';
// import { courses } from './courses'; // Ready for when you add courses.ts

/**
 * MASTER PRODUCT ARRAY
 * Combines all scientific and educational resources.
 */
export const ALL_PRODUCTS = [
  ...books,
  ...tech,
  ...certificates,
  // ...courses
];

/**
 * DYNAMIC FILTER MAPPING
 * These values populate the SubFilterNav component.
 * Note: Key names must match the 'category' strings in your data files.
 */
export const SUB_CATEGORIES: Record<string, string[]> = {
  'Books': [
    'CSIR NET', 
    'GATE', 
    'IIT JAM', 
    'BSc Reference', 
    'CUET', 
    'Life Science', 
    'Physics'
  ],
  'Courses': [
    'CSIR NET', 
    'GATE', 
    'Biotech', 
    'Data Science'
  ],
  'Certificates': [
    'Bioinformatics',
    'Cancer Biology',
    'Data Science',
    'IT Support',
    'Digital Marketing',
    'Python',
    'AI'
  ],
  'Tech & Tabs': [
    'Stylus Tablets', 
    'Coding Laptops', 
    '3D Modeling', 
    'Office'
  ],
  'Lab Gear': [
    'Microscopes', 
    'Glassware', 
    'Safety Kits'
  ]
};