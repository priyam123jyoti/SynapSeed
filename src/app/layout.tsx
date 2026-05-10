import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // 1. Metadata Base
  metadataBase: new URL('https://synap-seed.vercel.app'),
  
  title: {
    default: "Botany Department | Dhakuakhana College Autonomous, Lakhimpur, Assam",
    template: "%s | Botany Department, Dhakuakhana College Autonomous"
  },
  description: "Official website of the Department of Botany, Dhakuakhana College Autonomous. Featuring AI-powered mindmaps, Moana AI unlimited quizzes for Physics, Chemistry, Botany, Zoology, and academic resources.",
  
  // 2. Optimized Keywords
  keywords: [
    "Botany Department", 
    "Dhakuakhana College", 
    "Lakhimpur College Assam", 
    "Moana AI", 
    "AI Mindmap Generator", 
    "Botany Quiz Game", 
    "Zoology Quiz", 
    "Chemistry Quiz Generator", 
    "Physics Quiz",
    "Academic Leaderboard"
  ],

  // 3. Search Engine Verification (BING & GOOGLE)
  verification: {
    other: {
      'msvalidate.01': '62A9712E34794B46597398830C36FA29',
    },
  },

  // 4. Global Robots Instructions
  robots: {
    index: true,
    follow: true,
  },

  // 5. Social Media Sharing (Open Graph)
  openGraph: {
    title: "Botany Department | Dhakuakhana College",
    description: "AI-powered study tools and academic resources for Science students.",
    url: 'https://synap-seed.vercel.app',
    siteName: 'Dhakuakhana College Botany Portal',
    images: [
      {
        url: '/botany-department-dhakuakhana-college.png',
        width: 1200,
        height: 630,
        alt: 'Dhakuakhana College Botany Department AI Portal',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },

  // 6. Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Botany Department | Dhakuakhana College',
    description: 'Transforming science education with Moana AI Mindmaps and Quizzes.',
    images: '/botany-department-dhakuakhana-college.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-[#fdfdfd] text-slate-900`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}