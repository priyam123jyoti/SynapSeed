export interface FacultyMember {
  id: string;
  slug: string; // Used for the URL: /faculty/rakesh-kalita
  name: string;
  designation: string;
  qualifications: string;
  specialization: string;
  bio: string;
  isHod?: boolean;
  imageUrl: string;
}

export const botanyFaculty: FacultyMember[] = [
  {
    id: "rabin-b-pegu",
    slug: "rabin-b-pegu",
    name: "Rabin B Pegu",
    designation: "Associate Professor & HOD",
    qualifications: "M.Sc.",
    specialization: "Taxonomy & Ethnobotany",
    bio: "Rabin B Pegu leads the Department of Botany with extensive experience in plant classification and the study of traditional plant use in regional Assam.",
    isHod: true,
    imageUrl: "/images/faculty/rabin-b-pegu.jpg",
  },
  {
    id: "biswa-bikash-gogoi",
    slug: "biswa-bikash-gogoi",
    name: "Biswa Bikash Gogoi",
    designation: "Associate Professor",
    qualifications: "M.Sc.",
    specialization: "Plant Physiology",
    bio: "An expert in plant life processes, focusing on how local flora adapts to the unique environmental conditions of the Brahmaputra valley.",
    imageUrl: "/images/faculty/biswa-bikash-gogoi.jpg",
  },
  {
    id: "tridisha-borgohain",
    slug: "tridisha-borgohain",
    name: "Tridisha Borgohain",
    designation: "Assistant Professor",
    qualifications: "M.Sc.",
    specialization: "Cytogenetics & Plant Breeding",
    bio: "Specializing in the genetic makeup of plants and modern breeding techniques to improve crop resilience and variety.",
    imageUrl: "/images/faculty/tridisha-borgohain.png",
  },
  {
    id: "rakesh-kalita",
    slug: "rakesh-kalita",
    name: "Rakesh Kalita",
    designation: "Assistant Professor",
    qualifications: "M.Sc., NET, SLET, GATE XL, GATE EY",
    specialization: "Bioinformatics & Molecular Biology",
    bio: "Rakesh Kalita integrates computational biology with botany, holding multiple national-level certifications in life sciences.",
    imageUrl: "/images/faculty/rakesh-kalita.png",
  }
];