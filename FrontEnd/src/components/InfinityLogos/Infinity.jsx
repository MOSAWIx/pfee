import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/autoplay';
import { Autoplay, FreeMode } from 'swiper/modules';
import { PumaLogo, NewBalanseLogo, AsicsLogo, RebookLogo } from '../../assets/images/images';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { LanguageContext } from '../../context/language';

export default function InfiniteBrandMarquee() {
  const { t } = useTranslation();
  const { language } = useContext(LanguageContext);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const brands = [
    { name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg' },
    { name: 'Adidas', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg' },
    { name: 'Puma', logo: PumaLogo },
    { name: 'Reebok', logo: RebookLogo },
    { name: 'New Balance', logo: NewBalanseLogo },
    { name: 'Asics', logo: AsicsLogo },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const logoVariants = {
    rest: { scale: 1, opacity: 0.8 },
    hover: { 
      scale: 1.15, 
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className="relative w-full bg-black py-12 md:py-16 overflow-hidden z-[2]"
    >
      {/* Header with decorative elements */}
      <motion.div variants={itemVariants} className="text-center mb-8 md:mb-12 relative select-none px-4">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "64px" }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="absolute left-1/2 top-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform -translate-x-1/2 rounded-full"
        />
        <motion.h2 
          className="text-2xl md:text-3xl font-bold text-white mt-4"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {t('InfinityLogos.title')}
        </motion.h2>
        <motion.p 
          className="text-gray-400 mt-2 max-w-xl mx-auto text-sm md:text-base"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {t('InfinityLogos.description')}
        </motion.p>
      </motion.div>

      {/* Enhanced Gradient Left & Right Fade - Responsive widths */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="pointer-events-none absolute top-0 left-0 z-10 h-full w-16 sm:w-24 md:w-32 lg:w-40 bg-gradient-to-r from-black via-black/90 to-transparent" 
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="pointer-events-none absolute top-0 right-0 z-10 h-full w-16 sm:w-24 md:w-32 lg:w-40 bg-gradient-to-l from-black via-black/90 to-transparent" 
      />

      {/* Swiper Marquee Container with Enhanced Styles */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="relative py-6 md:py-8 border-t border-b border-gray-800/60"
      >
        {/* Background overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/20 via-transparent to-gray-900/20" />
        
        {/* Swiper Marquee */}
        <Swiper
          modules={[Autoplay, FreeMode]}
          slidesPerView="auto"
          key={language}
          spaceBetween={24}
          freeMode={true}
          loop={true}
          speed={4000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          breakpoints={{
            320: {
              spaceBetween: 20,
            },
            480: {
              spaceBetween: 28,
            },
            768: {
              spaceBetween: 36,
            },
            1024: {
              spaceBetween: 40,
            },
          }}
          className="w-full relative z-20"
        >
          {[...brands, ...brands].map((brand, idx) => (
            <SwiperSlide key={`${brand.name}-${idx}`} style={{ width: '140px' }} className="sm:!w-[160px]">
              <motion.div 
                className="group h-12 md:h-16 flex items-center justify-center px-2 md:px-4 relative"
                variants={logoVariants}
                initial="rest"
                whileHover="hover"
              >
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <motion.img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-8 sm:h-10 md:h-12 w-auto max-w-full object-contain brightness-0 invert opacity-80 group-hover:opacity-100 transition-all duration-300 relative z-10"
                  style={{
                    filter: 'brightness(0) invert(1)',
                    WebkitFilter: 'brightness(0) invert(1)',
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.3 }
                  }}
                  loading='lazy'
                />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
      
      {/* Enhanced Bottom accent */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-0 left-0 w-full h-0.5 md:h-1 bg-gradient-to-r from-transparent via-gray-600/80 to-transparent"
        style={{ originX: 0 }}
      />
      
      {/* Additional mobile enhancement - subtle background pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent pointer-events-none" />
    </motion.div>
  );
}