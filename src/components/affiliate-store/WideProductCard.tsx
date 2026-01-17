"use client";

import { memo } from 'react';
import Image from 'next/image';
import { ShoppingCart, Star, ExternalLink } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: string;
  rating: number;
  reviews: string;
  image: string;
  affiliateLink: string;
  description: string;
  examTag?: string;
}

const WideProductCard = memo(({ product }: { product: Product }) => {
  return (
    <div className="group relative bg-white border border-emerald-50 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 flex flex-col md:flex-row gap-6 p-4 md:p-6 transform-gpu will-change-transform">
      
      {/* Optimized Image Container */}
      {/* Note: 'relative' is required for the Next.js 'fill' property to work */}
      <div className="relative w-full md:w-48 h-48 flex-shrink-0 overflow-hidden rounded-2xl bg-emerald-50/50">
        <Image 
          src={product.image} 
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 192px"
          className="object-contain mix-blend-multiply p-4 group-hover:scale-110 transition-transform duration-700 ease-out"
          priority={false}
        />
        
        {product.examTag && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md border border-emerald-100 rounded-full shadow-sm z-10">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">
              {product.examTag}
            </span>
          </div>
        )}
      </div>

      {/* Info Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-1.5 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={12} 
                className={`${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-emerald-100'}`} 
              />
            ))}
            <span className="text-[10px] font-bold text-emerald-900/30 ml-1 uppercase tabular-nums">
              ({product.reviews})
            </span>
          </div>
        </div>

        <h3 className="text-xl font-black text-emerald-950 leading-tight mb-2 group-hover:text-emerald-600 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-sm text-emerald-900/60 leading-relaxed mb-6 line-clamp-2 italic">
          "{product.description}"
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-emerald-50 pt-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-0.5">
              Amazon Price
            </span>
            <span className="text-2xl font-black text-emerald-950 tabular-nums tracking-tighter">
              {product.price}
            </span>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => window.open(product.affiliateLink, '_blank')}
              className="flex items-center gap-2 bg-emerald-950 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-800 active:scale-95 transition-all shadow-lg shadow-emerald-900/10 group/btn"
            >
              View on Amazon
              <ExternalLink size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

WideProductCard.displayName = 'WideProductCard';
export default WideProductCard;