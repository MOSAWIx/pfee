import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ProductCard from "../../Product Card/ProductCard";
import "swiper/css";
import "swiper/css/navigation";
import { RiArrowRightSLine } from "react-icons/ri";
import { LanguageContext } from '../../../context/language';
import { useContext } from 'react';

function CollectionComponent({ products, title }) {
    const { language } = useContext(LanguageContext);
    const currentLang = language;
    const swiperRef = useRef(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const updateNavigation = (swiper) => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };

    const goNext = () => {
        const swiper = swiperRef.current?.swiper;
        if (swiper) swiper.slideNext();
    };

    const goPrev = () => {
        const swiper = swiperRef.current?.swiper;
        if (swiper) swiper.slidePrev();
    };

    return (
        <div>
            {/* Navigation Arrows */}
            <div className="flex items-center justify-center text-2xl font-bold mb-5 md:mb-10">
                <span
                    onClick={goPrev}
                    className={`inline prev cursor-pointer mohda navigation transition-opacity text-2xl ${isBeginning ? "opacity-50 pointer-events-none" : "opacity-100"}`}
                >
                    <RiArrowRightSLine className={`${currentLang === 'ar' ? '' : 'rotate-180'} text-[30px]`} />
                </span>
                <h2 className="mx-8">{title}</h2>
                <span
                    onClick={goNext}
                    className={`inline next cursor-pointer mohda navigation transition-opacity ${isEnd ? "opacity-50 pointer-events-none" : "opacity-100"}`}
                >
                    <RiArrowRightSLine className={`${currentLang === 'ar' ? 'rotate-180' : ''} text-[30px]`} />
                </span>
            </div>

            <Swiper
                key={currentLang}
                ref={swiperRef}
                modules={[Navigation]}
                onSlideChange={updateNavigation}
                onInit={updateNavigation}
                breakpoints={{
                    0: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                    },
                    640: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                    },
                    768: {
                        slidesPerView: 4,
                        spaceBetween: 30,
                    },
                    1024: {
                        slidesPerView: 5,
                        spaceBetween: 40,
                    },
                }}
            >
                {products.map((product, index) => (
                    <SwiperSlide key={index}>
                        <ProductCard product={product} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default CollectionComponent;
