import React from 'react';

// Skeleton for the product images section
export const ProductImagesSkeleton = () => {
  return (
    <div className="w-full sm:w-1/3 flex flex-col gap-4 animate-pulse">
      {/* Main image skeleton */}
      <div className="relative aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
      </div>
      
      {/* Thumbnails skeleton */}
      <div className="flex gap-2 justify-center">
        {[...Array(4)].map((_, index) => (
          <div 
            key={index} 
            className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Skeleton for the product content section
export const ProductContentSkeleton = () => {
  return (
    <div className="w-full sm:w-2/3 flex flex-col gap-4 animate-pulse">
      {/* Title skeleton */}
      <div className="h-8 bg-gray-200 rounded-md w-3/4"></div>
      
      {/* Price skeleton */}
      <div className="h-6 bg-gray-200 rounded-md w-1/4 mt-2"></div>
      
      {/* Description skeleton */}
      <div className="space-y-2 mt-4">
        <div className="h-4 bg-gray-200 rounded-md w-full"></div>
        <div className="h-4 bg-gray-200 rounded-md w-full"></div>
        <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
      </div>
      
      {/* Color variants skeleton */}
      <div className="mt-4">
        <div className="h-5 bg-gray-200 rounded-md w-1/4 mb-2"></div>
        <div className="flex gap-2">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="w-8 h-8 rounded-full bg-gray-300"></div>
          ))}
        </div>
      </div>
      
      {/* Size variants skeleton */}
      <div className="mt-4">
        <div className="h-5 bg-gray-200 rounded-md w-1/4 mb-2"></div>
        <div className="flex gap-2">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="w-10 h-10 rounded-md bg-gray-300"></div>
          ))}
        </div>
      </div>
      
      {/* Quantity and add to cart button skeleton */}
      <div className="flex gap-4 mt-6">
        <div className="w-32 h-12 bg-gray-200 rounded-md"></div>
        <div className="flex-1 h-12 bg-gray-300 rounded-md"></div>
      </div>
    </div>
  );
};

// Add shimmer animation to tailwind.config.js
// This requires adding the following to tailwind.config.js extend section:
// animation: {
//   shimmer: 'shimmer 1.5s infinite linear'
// },
// keyframes: {
//   shimmer: {
//     '0%': { backgroundPosition: '-200% 0' },
//     '100%': { backgroundPosition: '200% 0' }
//   }
// }