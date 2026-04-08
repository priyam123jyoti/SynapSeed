// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Botany Department | Dhakuakhana College Autonomous, Lakhimpur, Assam",
    template: "%s | Botany Department, Dhakuakhana College Autonomous"
  },
  description: "Official website of the Department of Botany, Dhakuakhana College Autonomous. AI-powered mindmaps, unlimited quizzes for physics, chemistry, botany, zoology, and academic resources for students.",
  keywords: ["Botany Department", "Dhakuakhana College", "Science AI", "Moana AI", "Text to Mindmaps generator Moana AI, Unlimited quiz generation by Moana AI, Quiz Game and Leaderboard ranking"],
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
          {/* You might want to add a Global Navbar here later */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}