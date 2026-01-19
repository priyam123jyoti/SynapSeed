"use client";

import { memo } from 'react';
import Image from 'next/image';
import { Star, ShoppingCart } from 'lucide-react';

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
  author?: string;
}

const WideProductCard = memo(({ product }: { product: Product }) => {
  return (
    <div className="group flex flex-col md:flex-row bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300">
      
      {/* Product Image Section */}
      <div className="relative w-full md:w-52 h-52 bg-gray-50 flex-shrink-0">
        <Image 
          src={product.image} 
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 208px"
          className="object-contain p-6 mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          priority={false}
        />
        {product.examTag && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-gray-900/80 backdrop-blur-sm rounded">
            <span className="text-[9px] font-bold text-white uppercase tracking-wider">
              {product.examTag}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 p-5 flex flex-col">
        {/* Rating & Reviews */}
        <div className="flex items-center gap-2 mb-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                className={`${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} 
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 font-medium">({product.reviews})</span>
        </div>

        {/* Product Title */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight mb-1">
          {product.name}
        </h3>

        {/* Brand/Author */}
        {product.author && (
          <p className="text-sm text-gray-500 mb-3">
            By <span className="font-semibold text-gray-700">{product.author}</span>
          </p>
        )}
        
        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>

        {/* Bottom Section: Price & Icon Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <div className="flex flex-col justify-center">
            <span className="text-2xl font-black text-gray-900 tabular-nums leading-none">
              {product.price}
            </span>
          </div>

          <button 
            onClick={() => window.open(product.affiliateLink, '_blank')}
            className="flex items-center justify-center w-12 h-12 bg-gray-900 hover:bg-black text-white rounded-xl transition-all active:scale-90 shadow-lg shadow-gray-200"
            title="Buy Now"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
});

WideProductCard.displayName = 'WideProductCard';
export default WideProductCard;