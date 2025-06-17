import React from 'react'
import { GrPrevious } from "react-icons/gr";

function SkeletonProductCard() {
    return (
        <div className="Product_Card animate-pulse select-none">
            <div className="Product_Image_Card relative select-none overflow-hidden bg-gray-200 h-[250px] md:h-[300px] w-full rounded-md">
                {/* Simulated image swiper */}
                <div className="absolute inset-0 bg-gray-300" />

                {/* Discount badge skeleton */}
                <div className="absolute top-4 right-4 h-[20px] w-[50px] bg-gray-400 rounded-sm z-50" />

                {/* Next & Prev Buttons */}
                <div className="next absolute top-1/2 right-[-100%] group-hover:right-0 transform -translate-y-1/2 z-50 p-1">
                    <GrPrevious className='text-[20px] text-gray-500 opacity-50' />
                </div>
                <div className="prev absolute top-1/2 left-[-100%] group-hover:left-0 transform -translate-y-1/2 z-50 p-1">
                    <GrPrevious className='text-[20px] text-gray-500 opacity-50' />
                </div>
            </div>

            <div className="Product_Detail items-center flex flex-col-reverse sm:flex-col">
                <div className="Product_Content text-center mt-[10px] space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                    <div className="flex justify-center gap-2">
                        <div className="h-4 bg-gray-300 rounded w-12"></div>
                        <div className="h-4 bg-gray-300 rounded w-12"></div>
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                    </div>
                </div>

                <div className="Product_Variants_Colors mt-2 flex justify-center gap-2">
                    {[1, 2, 3].map((_, idx) => (
                        <div key={idx} className="w-5 h-5 rounded-full bg-gray-300" />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SkeletonProductCard 