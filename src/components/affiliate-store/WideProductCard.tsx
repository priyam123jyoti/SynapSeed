"use client";

import { ShoppingCart, Star, CheckCircle2, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Defined an interface to ensure TypeScript knows the product structure
interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  image: string;
  description: string;
  link: string;
  examTag?: string;
  subjects?: string[];
  tags?: string[];
}

export default function WideProductCard({ product }: { product: Product }) {
  // Logic to show either 'tags' or 'subjects' as small pills
  const displayTags = product.tags || product.subjects || [];

  // Function to handle WhatsApp Sharing
  const shareOnWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault(); 
    const message = `Check out this ${product.name} on SynapStore! 🚀\nPrice: ${product.price}\nLink: ${product.link}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="group bg-white border border-emerald-100 p-4 md:p-6 flex flex-col md:flex-row gap-6 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500 relative overflow-hidden rounded-[2rem]">
      
      {/* 1. IMAGE CONTAINER */}
      <div className="w-full md:w-64 h-64 bg-slate-50 rounded-3xl overflow-hidden flex-shrink-0 flex items-center justify-center p-6 relative">
        <img 
          src={product.image} 
          alt={product.name} 
          referrerPolicy="no-referrer" // CRITICAL: Fixes Amazon image blocking
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
        />
        
        {/* Floating Discount Badge */}
        <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
          OFFER
        </div>
      </div>

      {/* 2. DETAILS SECTION */}
      <div className="flex-1 flex flex-col justify-between py-2">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full border border-emerald-100">
                {product.examTag || "Reference"}
              </span>
              <div className="flex text-yellow-400">
                <Star size={12} className="fill-current"/> 
                <Star size={12} className="fill-current"/> 
                <Star size={12} className="fill-current"/>
                <Star size={12} className="fill-current"/>
                <Star size={12} className="fill-current/50"/>
              </div>
            </div>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-emerald-950 mb-2 leading-tight group-hover:text-emerald-600 transition-colors">
            {product.name}
          </h3>
          
          <p className="text-emerald-800/60 text-sm md:text-base line-clamp-2 mb-4 italic">
            &quot;{product.description}&quot;
          </p>

          {/* Dynamic Tags/Subjects */}
          <div className="flex flex-wrap gap-2 mb-6">
            {displayTags.map((tag: string) => (
              <span key={tag} className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50/50 border border-emerald-100/50 px-3 py-1 rounded-lg">
                <CheckCircle2 size={12} className="text-emerald-500" /> {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 3. PRICING & CTA SECTION */}
        <div className="flex items-center justify-between border-t border-emerald-50 pt-5">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-emerald-900/30 line-through tracking-wider">
              MRP ₹{product.originalPrice}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-emerald-950 tracking-tighter">
                {product.price}
              </span>
              <span className="text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded">
                Save 💸
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Share Button */}
            <button 
              onClick={shareOnWhatsApp}
              className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl hover:bg-emerald-100 transition-all active:scale-90"
              aria-label="Share on WhatsApp"
            >
              <Share2 size={20} />
            </button>

            {/* Buy Button */}
            <a 
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-emerald-950 text-white px-8 py-4 rounded-2xl hover:bg-emerald-800 hover:translate-x-1 transition-all shadow-xl shadow-emerald-950/20 active:scale-95 group/btn"
            >
              <ShoppingCart size={18} className="group-hover/btn:rotate-12 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      {/* Subtle Background Decoration */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-50/30 rounded-full blur-3xl group-hover:bg-emerald-100/50 transition-colors -z-10" />
    </div>
  );
}