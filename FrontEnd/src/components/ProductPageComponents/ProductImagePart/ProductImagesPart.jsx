import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode, EffectFade, Pagination } from "swiper/modules";
import { useSelector } from "react-redux";
import { ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import ZoomPortal from "./ZoomPortal";
import { LanguageContext } from "../../../context/language";
import { useContext } from "react";
const API_URL = import.meta.env.VITE_API_BASE_URL;

const ProductSlider = ({ product }) => {
  const { language } = useContext(LanguageContext);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomedImage, setZoomedImage] = useState(null);
  const mainSwiperRef = useRef(null);
  const selectedColor = useSelector(
    (state) => state.root.products.selectedSizeAndColorAndTaille.color
  );

  // Fallback image for error handling
  const fallbackImage = "/api/placeholder/400/600";


  // Get current color's images or default to first color's images
  const currentColorIndex = selectedColor?.colorIndex ?? 0;
  const currentImages =
    product.colors[currentColorIndex]?.images || product.colors[0]?.images || [];

  // Handle thumbnail click
  const handleThumbClick = (index) => {
    if (mainSwiperRef.current && mainSwiperRef.current.swiper) {
      mainSwiperRef.current.swiper.slideTo(index);
    }
  };

  // Handle image error
  const handleImageError = (e) => {
    e.target.src = fallbackImage;
    e.target.onerror = null; // Prevent infinite error loop
  };

  // Open zoomed image modal
  const openZoomedImage = (img) => {
    setZoomedImage(img);
    document.body.style.overflow = "hidden";
  };

  // Close zoomed image modal
  const closeZoomedImage = () => {
    setZoomedImage(null);
    document.body.style.overflow = "auto";
  };

  // Custom navigation buttons
  const renderNavButton = (direction) => {
    const Icon = direction === "next" ? ChevronRight : ChevronLeft;
    return (
      <button
        className={`absolute top-1/2 z-10 transform -translate-y-1/2 ${
          direction === "next" ? "right-2" : "left-2"
        } bg-white bg-opacity-80 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-all duration-200`}
        onClick={() => {
          if (mainSwiperRef.current && mainSwiperRef.current.swiper) {
            direction === "next"
              ? mainSwiperRef.current.swiper.slideNext()
              : mainSwiperRef.current.swiper.slidePrev();
          }
        }}
      >
        <Icon size={20} />
      </button>
    );
  };

  return (
    <div className="product-slider sm:sticky sm:top-10 w-full sm:w-1/3 flex flex-col gap-4 justify-center select-none">
      {/* Main image slider */}
      <div className="relative">
        <Swiper
          key={language}
          ref={mainSwiperRef}
          modules={[EffectFade, Navigation, Thumbs]}
          effect="fade"
          navigation={false} // Using custom navigation
          thumbs={{ swiper: thumbsSwiper }}
          pagination={{
            type: "bullets",
            el: ".swiper-pagination",
            clickable: true,
          }}
          className="main-swiper w-full overflow-hidden"
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        >
          {currentImages.length > 0 ? (
            currentImages.map((img, index) => (
              <SwiperSlide key={index} className=" bg-gray-100">
                <div className="image-wrapper relative w-full h-full group">
                  <img
                    src={`${API_URL}${img?.webpPath || img?.originalPath || fallbackImage}`}
                    alt={`${product.title?.en || "Product"} - ${
                      product.colors[currentColorIndex]?.name?.en || "Color"
                    }`}
                    className="aspect-[5/7] lg:aspect-[15/18]   object-cover"
                    onError={handleImageError}
                  />
                  <div 
                    className="absolute bottom-4 left-4 bg-white bg-opacity-80 p-2 rounded-full cursor-pointer md:opacity-0 opacity-1 md:group-hover:opacity-100 transition-opacity duration-300"
                    onClick={() => openZoomedImage(`${API_URL}${img?.webpPath || img?.originalPath || fallbackImage}`)}
                  >
                    <ZoomIn size={20} />
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide className="aspect-[3/4] bg-gray-100">
              <img
                src={fallbackImage}
                alt="Product image placeholder"
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          )}
        </Swiper>
        
        {/* Custom navigation buttons */}
        {currentImages.length > 1 && (
          <>
            {renderNavButton("prev")}
            {renderNavButton("next")}
          </>
        )}
        
        {/* Pagination */}
         
      </div>

      {/* Thumbnails */}
      {currentImages.length > 1 && (
        <Swiper
          modules={[Thumbs, FreeMode]}
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={"auto"}
          watchSlidesProgress={true}
          centeredSlides={false}
          className="thumbs-swiper mt-3 h-24"
          breakpoints={{
            0: {
              slidesPerView: 3,
              spaceBetween: 8,
            },
            640: {
              slidesPerView: 4,
              spaceBetween: 10,
            },
          }}
        >
          {currentImages.map((img, index) => (
            <SwiperSlide 
              key={index} 
              className="cursor-pointer !w-auto !h-20 mx-1"
              onClick={() => handleThumbClick(index)}
            >
              <div className={`relative w-full h-full rounded-md overflow-hidden border-2 ${
                activeIndex === index ? "border-black" : "border-transparent"
              }`}>
                <img
                  src={`${API_URL}${img?.thumbnailPath || img?.webpPath || fallbackImage}`}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Zoomed Image Modal */}
      {zoomedImage && (
        <ZoomPortal closeZoomedImage={closeZoomedImage} zoomedImage={zoomedImage} handleImageError={handleImageError} />
      )}
    </div>
  );
};

export default ProductSlider;