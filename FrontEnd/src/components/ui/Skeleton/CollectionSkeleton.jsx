import React from 'react';
import { motion } from 'framer-motion';
import SkeletonProductCard from './SkeletonProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const CollectionSkeleton = () => {
    return (
        <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
                0: {
                    slidesPerView: 2,
                },
                640: {
                    slidesPerView: 2,
                },
                768: {
                    slidesPerView: 3,
                },
                1024: {
                    slidesPerView: 4,
                },
            }}
            className="py-8"
        >
            {[...Array(6)].map((_, index) => (
                <SwiperSlide key={index}>
                    <SkeletonProductCard />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default CollectionSkeleton;
