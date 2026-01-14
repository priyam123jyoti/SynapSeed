"use client"; // Required because Chloroplast3D and Navbar likely use hooks

import Navbar from '@/components/layout/Navbar'; 
import Chloroplast3D from '@/components/layout/Chloroplast3D';
import RightPanel from '@/components/layout/RightPanel';
import MobileBottomNavbar from '@/components/layout/MobileBottomNavbar';
import AIFloatingButton from '@/components/layout/AIFloatingButton';

export default function Home() {
  // We stripped the auth logic - it just renders the UI now
  return (
    <div className="w-full bg-[#f8fafc] flex flex-col min-h-screen pb-15">
      <Navbar /> 
      
      <main className="flex-1 p-4 md:p-10">
        <div className="flex flex-col xl:flex-row gap-8 max-w-[1600px] mx-auto w-full">
          <div className="flex-1 flex flex-col lg:flex-row gap-8">
            <div className="flex-1 min-h-[50vh] lg:min-h-[70vh]">
              <Chloroplast3D />
            </div>
            <div className="w-full lg:w-96">
              <RightPanel />
            </div>
          </div>
        </div>
      </main>
      
      <AIFloatingButton />
      <MobileBottomNavbar />
    </div>
  );
}