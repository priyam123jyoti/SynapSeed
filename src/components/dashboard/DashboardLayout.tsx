'use client';

import { ReactNode } from 'react';
import Navbar from '../layout/Navbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex">

       {/* Main Area */}
        <div >
          {/* Top Navigation */}
          <Navbar />

          {/* Page Content */}
          <main className="p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}