import { useRef, useContext } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../../context/language';
import 'swiper/css';
import 'swiper/css/navigation';
const API_URL = import.meta.env.VITE_API_BASE_URL;

function AnimatedProductCard({ product }) {
    const swiperRef = useRef(null);
    const { language } = useContext(LanguageContext);
    const currentLang = language;

    const hasDiscount = product.discount > 0;
    const price = product.basePrice;
    const originalPrice = hasDiscount
        ? price + (price * product.discount) / 100
        : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="rounded-xl overflow-hidden border border-[#dfe3e8] bg-[#f5f8f9] shadow-sm hover:shadow-md transition-shadow duration-300"
        >
            <Link to={`/product/${product._id}`} className="block">
                {/* Image Swiper */}
                <div className="relative w-full aspect-[4/5] overflow-hidden group">
                    <Swiper
                        ref={swiperRef}
                        modules={[Navigation]}
                        loop={true}
                        spaceBetween={0}
                        className="h-full"
                    >
                        {product.colors.flatMap((color, i) =>
                            color.images.map((img, j) => (
                                <SwiperSlide key={`${i}-${j}`}>
                                    <motion.img
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                        src={`${API_URL}${img.webpPath}`}
                                        alt={product.title[currentLang]}
                                        className="w-full h-full object-cover transition-transform duration-500"
                                    />
                                </SwiperSlide>
                            ))
                        )}
                    </Swiper>

                    {hasDiscount && (
                        <span className="absolute top-2 left-2 text-xs bg-red-600 text-white px-2 py-1 rounded z-10 font-medium">
                            {currentLang === 'ar' ? `${product.discount}% خصم` : `${product.discount}% OFF`}
                        </span>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                    <h3 className="text-sm font-semibold text-black line-clamp-2 mb-2">
                        {product.title[currentLang]}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-black font-bold">{price.toFixed(2)} DH</span>
                        {hasDiscount && (
                            <span className="line-through text-sm text-gray-500">
                                {originalPrice.toFixed(2)} DH
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                        {product.colors.map((color, index) => (
                            <span
                                key={index}
                                title={color.name}
                                className="w-5 h-5 rounded-full border border-white"
                                style={{ backgroundColor: color.colorHex }}
                            />
                        ))}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export default AnimatedProductCard;
