import Color from './Color/Color'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, EffectFade } from 'swiper/modules'
import { GrNext, GrPrevious } from "react-icons/gr";
import { useRef, memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { useTranslation } from 'react-i18next';
import {LanguageContext} from '../../context/language';
const API_URL = import.meta.env.VITE_API_BASE_URL;

const ProductCard = memo(({ product }) => {
    const ProductCardSwiperRef = useRef(null)
    const { t } = useTranslation();
    const { language } = useContext(LanguageContext);
    const currentLang = language;

    const handlePrevious = useCallback(() => {
        ProductCardSwiperRef.current?.slidePrev();
    }, []);

    const handleNext = useCallback(() => {
        ProductCardSwiperRef.current?.slideNext();
    }, []);

    const swiperConfig = {
        effect: "fade",
        loop: true,
        spaceBetween: 0,
        modules: [Navigation, EffectFade],
        className: "aspect-[5/7]",
        watchSlidesProgress: true,
        observer: true,
        observeParents: true
    };

    return (
        <Link to={`/product/${product._id}`} className="Product_Card select-none">
            <div className="group Product_Image_Card relative select-none overflow-hidden">
                <Swiper
                    ref={ProductCardSwiperRef}
                    key={currentLang}
                    loading='lazy'
                    data-preload-images="true"
                    {...swiperConfig}
                    onSwiper={(swiper) => (ProductCardSwiperRef.current = swiper)}
                >
                    {product.colors.flatMap((color, index) =>
                        color.images.map((image, imageIndex) => (
                            <SwiperSlide key={`${index}-${imageIndex}`}>
                                <img 
                                    src={`${API_URL}${image.webpPath}`} 
                                    alt={product.title.en} 
                                    className='aspect-[5/7] h-full w-full object-cover'
                                    loading='lazy'
                                    decoding="async"
                                    fetchPriority={index === 0 ? "high" : "low"}
                                />
                            </SwiperSlide>
                        ))
                    )}
                </Swiper>
                {/* Discount */}
                {product.discount > 0 && (
                    <span className='absolute z-[23] rounded-lg inline-block px-3 py-[8px] text-white bg-[#c20000] text-[11px] leading-[1.2] top-4 right-4 pointer-events-none font-medium'>
                        {currentLang === 'ar' ? `${product.discount}% ${t("Product.discount")}` : `${product.discount}% ${t("Product.discount")}`}
                    </span>
                )}
                {/* Next Slider Btn */}
                <button
                    onClick={handleNext}
                    className="absolute top-1/2 size-[30px] xl:size-[40px] flex items-center justify-center right-[-100%] group-hover:right-0 transform -translate-y-1/2 z-50 cursor-pointer duration-75 p-1 origin-center rotate-180"
                    aria-label="Next image"
                >
                    <div className="absolute inset-0 bg-white opacity-70 rounded-full"></div>
                    <GrNext className="relative text-[20px] rounded-lg rotate-180 text-[rgb(51,51,51)] opacity-65 group-hover:opacity-100 z-50" />
                </button>
        
                {/* Previous Button */}
                <button
                    onClick={handlePrevious}
                    className="absolute size-[30px] xl:size-[40px] flex items-center justify-center top-1/2 left-[-100%] group-hover:left-0 transform -translate-y-1/2 z-50 cursor-pointer p-1 duration-75"
                    aria-label="Previous image"
                >
                    <div className="absolute inset-0 bg-white opacity-70 rounded-full"></div>
                    <GrPrevious className="relative text-[20px] rounded-lg text-[rgb(51,51,51)] opacity-65 group-hover:opacity-100" />
                </button>
            </div>
            <div className="Product_Detail items-center flex flex-col">
                <div className="Product_Content text-center mt-[10px]">
                    <h3 className='text-base font-medium text-left line-clamp-1'>{product.title[currentLang]}</h3>
                    <div className="Price flex items-center justify-center">
                        <span className='block mx-1 text-base text-[#2E8B57] font-semibold'>{product.basePrice}DH</span>
                        {product.discount > 0 && (
                            <span className='block mx-1 text-base text-[#FF0000] font-medium line-through'>
                                {product.basePrice + (product.discount*product.basePrice/100)} DH
                            </span>
                        )}
                    </div>
                </div>
                <div className="Product_Variants_Colors mt-1 mb-2 flex items-center justify-center gap-2">
                    {product.colors.map((color, index) => (
                        <Color
                            key={index}
                            colorHex={color.colorHex}
                            index={index}
                            selectedColor={product.selectedColor}
                            onColorChange={product.onColorChange}
                            colorName={color.name}
                        />
                    ))}
                </div>
            </div>
        </Link>
    )
});

ProductCard.displayName = 'ProductCard';

export default ProductCard