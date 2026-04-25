import Image from 'next/image';
import Link from 'next/link';
// Import Playfair Display for that "stylish/creative" look
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['700', '900'] 
});

export default function BotanyHero() {
  return (
    <header className="relative w-full min-h-[85vh] flex items-center overflow-hidden bg-[#f5f4ef]">
      
      {/* Background Image Layer - OPTIMIZED FOR LCP */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/dhakuakhana-college-botany-department.jpg"
          alt="Main building of the Department of Botany, Dhakuakhana College"
          fill
          priority // Highest priority for LCP
          quality={80} // Extreme compression without quality loss
          className="object-cover object-center lg:object-[right_center]"
          // Tells the browser exactly how much space the image takes to prevent over-downloading
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
        />
        {/* Solid fade - no blur as requested */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#f5f4ef] via-[#f5f4ef]/95 to-transparent lg:via-[#f5f4ef]/80"></div>
      </div>

      <div className="relative z-10 w-full px-6 py-16 lg:px-20 h-full flex flex-col justify-center">
        
        <div className="max-w-4xl">
          {/* Tagline */}
          <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-[2px] bg-emerald-800"></div>
             <p className="text-emerald-800 font-bold tracking-[0.3em] text-[10px] uppercase">
              Opportunities don't happen, you create them
             </p>
          </div>
          
 {/* Creative Stylish Heading */}
<h1 className={`${playfair.className} text-6xl sm:text-7xl lg:text-9xl leading-[0.95] mb-4 text-[#1a3c34] tracking-tight`}>
  Botany <span className="block text-[#2d5a4c] text-5xl lg:text-7xl">Dhakuakhana College</span>
</h1>

          {/* Dhakuakhana College - Color adjusted for Accessibility (Contrast) */}
          <p className="text-lg lg:text-2xl font-semibold text-emerald-800 mb-12 tracking-wide ml-1">
            You don't get what you want, you get what you deserve!
          </p>

          {/* Navigation Grid - Added ARIA labels for Accessibility score */}
          <nav className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md rounded-2xl overflow-hidden shadow-2xl shadow-emerald-900/10">
            {/* <Link 
              href="/admission"  
              aria-label="Navigate to Admission page"
              className="group flex items-center justify-between bg-[#ef7b3f] text-white px-8 py-5 transition-all hover:bg-[#d96a2f]"
            >
              <span className="font-black text-xs uppercase tracking-[0.15em]">Admission</span>
              <span className="text-xl transform group-hover:translate-x-1 transition-transform" aria-hidden="true">↗</span>
            </Link> */}
            
            {/* <Link 
              href="/research" 
              aria-label="View Research and Publications"
              className="group flex items-center justify-between bg-white text-emerald-950 px-8 py-5 hover:bg-emerald-50 transition-colors border-l border-emerald-50"
            >
              <span className="font-black text-xs uppercase tracking-[0.15em]">Research</span>
              <span className="text-emerald-300 transform group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
            </Link> */}
            
            <Link 
              href="/faculty" 
              aria-label="Meet our Faculty Members"
              className="group flex items-center justify-between bg-white text-emerald-950 px-8 py-5 hover:bg-emerald-50 transition-colors border-t border-emerald-50"
            >
              <span className="font-black text-xs uppercase tracking-[0.15em]">Faculty</span>
              <span className="text-emerald-300 transform group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
            </Link>
            
            <Link 
              href="/events" 
              aria-label="Upcoming Botanical Events and Seminars"
              className="group flex items-center justify-between bg-white text-emerald-950 px-8 py-5 hover:bg-emerald-50 transition-colors border-t border-l border-emerald-50"
            >
              <span className="font-black text-xs uppercase tracking-[0.15em]">Events</span>
              <span className="text-emerald-300 transform group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
            </Link>
          </nav>
        </div>

        {/* Location Footer */}
        <div className="mt-16 flex items-center gap-3 text-stone-500 font-bold text-[9px] lg:text-[10px] uppercase tracking-[0.3em]">
            <span className="p-1.5 bg-emerald-100 rounded-full text-emerald-700">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </span>
            Dhakuakhana, Lakhimpur, Assam, INDIA
        </div>
      </div>
    </header>
  );
}