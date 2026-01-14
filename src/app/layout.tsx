import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Recommended font optimization
import "./globals.css"; // Ensure this matches your CSS filename
import { AuthProvider } from "@/contexts/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SynapSeed | AI-Powered Learning",
  description: "Biology, AI, and Career Resources for Students",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* In Next.js, we don't need <BrowserRouter>. 
            The AuthProvider remains here to wrap the entire app. 
        */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}