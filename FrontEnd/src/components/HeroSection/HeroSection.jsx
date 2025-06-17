import React, { useEffect, useState, useCallback, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";
import NavigationBtns from "./NavigationBtns";
import PaginationDots from "./PaginationDots";
import { getHeroData } from "../../Admin/util/heroHelper";
// swipper Css
import "swiper/swiper-bundle.css";
// Fallback images in case API fails
import { sliderMobile1, sliderDesktop1 } from "../../assets/images/images";

const HeroSection = () => {
  const [swiperPassToPagination, setswiperPassToPagination] = useState(null);
  const swiperRef = useRef();
  const [isFirstSlideLoaded, setIsFirstSlideLoaded] = useState(false);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [dataSource, setDataSource] = useState(""); // Track data source for debugging
  const [fetchAttempted, setFetchAttempted] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  // Create fallback slide data
  const fallbackSlide = {
    _id: 'fallback-slide',
    backgroundImage: {
      mobile: sliderMobile1,
      desktop: sliderDesktop1
    },
    title: { en: "Welcome", ar: "أهلاً وسهلاً" },
    subtitle: { en: "Discover Amazing Products", ar: "اكتشف منتجات رائعة" },
    description: { en: "Shop the latest collection", ar: "تسوق أحدث المجموعات" },
    buttonText: { en: "Shop Now", ar: "تسوق الآن" }
  };

  // function for next and prev
  const next = () => {
    swiperRef.current?.slideNext();
  };
  const prev = () => {
    swiperRef.current?.slidePrev();
  };

  useEffect(() => {
    if (swiperRef.current) {
      setswiperPassToPagination(swiperRef.current);
    }
  }, [swiperRef.current]);

  // Memoized function to preload first slide image
  const preloadFirstSlideImage = useCallback((slideData, isFromCache = false) => {
    if (!slideData || slideData.length === 0) {
      setIsFirstSlideLoaded(true);
      return ;
    }

    const firstSlide = slideData[0];
    
    // If data is from cache, skip preloading and show immediately
    if (isFromCache) {
      setIsFirstSlideLoaded(true);
      return;
    }

    if (firstSlide.backgroundImage) {
      const preloadImage = new Image();
      const imageSrc = window.innerWidth <= 768
        ? (firstSlide.backgroundImage.mobile.startsWith('http') 
            ? firstSlide.backgroundImage.mobile 
            : `${import.meta.env.VITE_API_BASE_URL}${firstSlide.backgroundImage.mobile}`)
        : (firstSlide.backgroundImage.desktop.startsWith('http') 
            ? firstSlide.backgroundImage.desktop 
            : `${import.meta.env.VITE_API_BASE_URL}${firstSlide.backgroundImage.desktop}`);
      
      preloadImage.src = imageSrc;
      
      const cleanup = () => {
        preloadImage.onload = null;
        preloadImage.onerror = null;
      };

      preloadImage.onload = () => {
        cleanup();
        setIsFirstSlideLoaded(true);
      };
      
      preloadImage.onerror = () => {
        cleanup();
        console.error("Failed to preload first slide image");
        setIsFirstSlideLoaded(true); // Set to true anyway to prevent infinite loading
      };
    } else {
      setIsFirstSlideLoaded(true);
    }
  }, []);

  // Memoized function to load fallback image
  const loadFallbackImage = useCallback(() => {
    console.log("Loading fallback image");
    const preloadImage = new Image();
    const imageSrc = window.innerWidth <= 768 ? sliderMobile1 : sliderDesktop1;
    preloadImage.src = imageSrc;

    const cleanup = () => {
      preloadImage.onload = null;
      preloadImage.onerror = null;
    };

    preloadImage.onload = () => {
      cleanup();
      setIsFirstSlideLoaded(true);
      setUseFallback(true);
      setSlides([fallbackSlide]);
      setLoading(false);
    };

    preloadImage.onerror = () => {
      cleanup();
      console.error("Failed to load fallback image");
      setIsFirstSlideLoaded(true);
      setUseFallback(true);
      setSlides([fallbackSlide]);
      setLoading(false);
    };
  }, [fallbackSlide]);

  // Fetch hero section data with caching - only run once
  useEffect(() => {
    // Prevent multiple fetch attempts
    if (fetchAttempted) {
      return;
    }

    const fetchHeroSection = async () => {
      try {
        setFetchAttempted(true);
        setError(null);
        
        console.log("Fetching hero section data...");
        const result = await getHeroData();

        // Handle case where result is invalid or no data
        if (!result?.data || !Array.isArray(result.data) || result.data.length === 0) {
          console.log("No valid hero section data found, using fallback");
          setError("No hero section data found");
          loadFallbackImage();
          return;
        }

        console.log(`Hero data loaded from: ${result.source}`, result.data);
        setSlides(result.data);
        setDataSource(result.source);

        // Check if data is from cache
        const isFromCache = result.source === "localStorage" || result.cached === true;

        if (isFromCache) {
          // Data from cache - show immediately
          setLoading(false);
          setIsFirstSlideLoaded(true);
        } else {
          // Data from API - preload first image
          preloadFirstSlideImage(result.data, false);
          setLoading(false); // Set loading to false after preload starts
        }
      } catch (error) {
        console.error("Error loading hero section:", error);
        setError("Failed to load hero section data");
        loadFallbackImage();
      }
    };

    fetchHeroSection();
  }, []); // Empty dependency array - only run once

  // Determine what slides to show
  const slidesToShow = useFallback ? [fallbackSlide] : slides;
  const shouldShowLoading = loading && slidesToShow.length === 0 && !fetchAttempted;

  // Function to get image source with proper URL handling
  const getImageSrc = (slide, isMobile = false) => {
    if (!slide.backgroundImage) return '';
    
    const imagePath = isMobile ? slide.backgroundImage.mobile : slide.backgroundImage.desktop;
    
    // If it's a fallback slide or already a complete URL, return as is
    if (useFallback || imagePath.startsWith('http') || imagePath.startsWith('/')) {
      return imagePath;
    }
    
    // Otherwise, prepend the API base URL
    return `${import.meta.env.VITE_API_BASE_URL}${imagePath}`;
  };

  console.log("HeroSection render:", { 
    loading, 
    slidesToShow: slidesToShow.length, 
    useFallback, 
    fetchAttempted,
    shouldShowLoading,
    dataSource
  });

  return (
    <div className="HeroSection relative  select-none w-full aspect-[16/16] md:aspect-[21/8] lg:aspect-[21/7] bg-gray-100">
      {shouldShowLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-gray-100">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-lg"></div>
          </div>
          <span className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            Loading sliders...
          </span>
        </div>
      )}

      <Swiper
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          nextEl: ".next",
          prevEl: ".prev",
          clickable: true,
        }}
        // loop={slidesToShow.length > 1} // Only loop if there are multiple slides
        key={`${currentLanguage}-${slidesToShow.length}-${useFallback}`} // Key to re-render on changes
        // autoplay={slidesToShow.length > 1 ? {
        //   delay: 5000,
        //   disableOnInteraction: false,
        // } : false} // Only autoplay if multiple slides
        draggable={true}
        autoplay={false}
        effect="fade"
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        className="w-full h-full"
      >
        {slidesToShow.map((slide, index) => (
          <SwiperSlide key={slide._id || `slide-${index}`} className="w-full h-full">
            <div className="wrapper_image relative w-full h-full md:before:content-[''] md:before:absolute md:before:inset-0 md:before:w-full md:before:h-full md:before:bg-[rgba(0,0,0,0.3)] md:before:z-10">
              <picture className="w-full h-full block">
                <source
                  media="(max-width: 768px)"
                  srcSet={getImageSrc(slide, true)}
                />
                <source
                  media="(min-width: 769px)"
                  srcSet={getImageSrc(slide, false)}
                />
                <img
                  src={getImageSrc(slide, true)}
                  alt={slide.title?.[currentLanguage] || slide.title?.en || "Slider image"}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  decoding="async"
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    index === 0 && isFirstSlideLoaded
                      ? "opacity-100"
                      : index === 0
                      ? "opacity-0"
                      : "opacity-100"
                  }`}
                  onError={(e) => {
                    console.error("Image failed to load:", e.target.src);
                    // Don't retry to prevent loops
                    e.target.style.display = 'none';
                  }}
                />
              </picture>

              {/* Text content overlay */}
              {(slide.title?.[currentLanguage] ||
                slide.subtitle?.[currentLanguage] ||
                slide.description?.[currentLanguage] ||
                slide.buttonText?.[currentLanguage]) && (
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-[999] p-4 text-center">
                  {slide.title?.[currentLanguage] && (
                    <h2 className="text-2xl md:text-4xl font-bold mb-2">
                      {slide.title[currentLanguage]}
                    </h2>
                  )}
                  {slide.subtitle?.[currentLanguage] && (
                    <h3 className="text-xl md:text-2xl mb-2">
                      {slide.subtitle[currentLanguage]}
                    </h3>
                  )}
                  {slide.description?.[currentLanguage] && (
                    <p className="text-sm md:text-base mb-4">
                      {slide.description[currentLanguage]}
                    </p>
                  )}
                  {slide.buttonText?.[currentLanguage] && (
                    <button className="bg-black hover:bg-gray-950 text-white font-bold py-2 px-4 rounded transition duration-300">
                      {slide.buttonText[currentLanguage]}
                    </button>
                  )}
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation buttons - only show if there are multiple slides */}
      {slidesToShow.length > 1 && <NavigationBtns next={next} prev={prev} />}

      {/* Pagination - only show if there are multiple slides */}
      {swiperPassToPagination && slidesToShow.length > 1 && (
        <PaginationDots
          swiper={swiperPassToPagination}
          slidesCount={slidesToShow.length}
        />
      )}
    </div>
  );
};

export default HeroSection;