import type { Metadata, Viewport } from "next"; 
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthProvider";
import PWAInstaller from "@/components/pwa/PWAInstaller";

const inter = Inter({ subsets: ["latin"] });

// PWA: Viewport configuration for theme colors
export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://synap-seed.vercel.app'),
  manifest: "/manifest.json", // Link to PWA Manifest
  title: {
    default: "Botany Department | Dhakuakhana College Autonomous, Lakhimpur, Assam",
    template: "%s | Botany Department, Dhakuakhana College Autonomous"
  },
  description: "Official website of the Department of Botany, Dhakuakhana College Autonomous. Featuring AI-powered mindmaps, KAKU AI unlimited quizzes for Physics, Chemistry, Botany, Zoology, and academic resources.",
  keywords: ["Botany Department", "Dhakuakhana College", "KAKU AI", "AI Mindmap Generator", "Botany Quiz Game"],

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SynapSeed",
  },

  verification: {
    other: {
      'msvalidate.01': '62A9712E34794B46597398830C36FA29',
    },
  },

  robots: { index: true, follow: true },

  openGraph: {
    title: "Botany Department | Dhakuakhana College",
    description: "AI-powered study tools and academic resources for Science students.",
    url: 'https://synap-seed.vercel.app',
    siteName: 'Dhakuakhana College Botany Portal',
    images: [{ url: '/botany-department-dhakuakhana-college.png', width: 1200, height: 630, alt: 'Dhakuakhana College Botany Department AI Portal' }],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-[#fdfdfd] text-slate-900 overflow-x-hidden`}>
        <AuthProvider>
          
          {/* Page Content */}
          {children}

          {/* FIX: Mounted PWAInstaller here so its event listeners run globally */}
          <PWAInstaller />

          {/* PERMANENT WIDGET: AI Quiz, Mindmap, Home */}
          
        </AuthProvider>
      </body>
    </html>
  );
}