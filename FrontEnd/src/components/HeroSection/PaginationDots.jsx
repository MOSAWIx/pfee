import React, { useState, useEffect } from "react";

function PaginationDots({ swiper, slidesCount }) {
    const [activeIndex, setActiveIndex] = useState(swiper.activeIndex || 0);

    useEffect(() => {
    
        swiper.on("slideChange", ()=>setActiveIndex(swiper.activeIndex));

        return () => {
            swiper.off("slideChange", ()=>setActiveIndex(swiper.activeIndex));
        };
    }, [swiper]);


    return (
        <div className="pagination-dots flex sm:hidden items-center gap-2 absolute bottom-0 left-1/2 transform -translate-x-1/2 pb-4 z-50">
            {Array.from({ length: slidesCount }, (_, index) => {
                
                return (
                    <span
                    key={index}
                    className={`pagination-dot w-4 h-4 inline-block rounded-full cursor-pointer duration-200  ${
                        activeIndex==index ? "border-[3px] border-[rgba(225,225,225,0.7)]" : "bg-white"
                    }`}
                    onClick={() => swiper.slideTo(index)}
                    />
                    
                );
            })}
        </div>
    );
}

export default PaginationDots;
