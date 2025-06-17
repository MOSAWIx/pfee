import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import ProductContent from "../components/ProductPageComponents/ProductContentDetail/ProductContent.jsx";
import productsSelector, {
  getError,
  getLoading,
} from "../Features/selectors/ProducsSelector";
import ProductCard from "../components/Product Card/ProductCard";
import ProductSlider from "../components/ProductPageComponents/ProductImagePart/ProductImagesPart";
import { getProductById , getSimilarProducts } from "../Features/Products/actions/actGetProducts";
import {
  ProductImagesSkeleton,
  ProductContentSkeleton,
} from "../components/ProductPageComponents/Skeletons/ProductSkeletons";
import { IoIosSearch } from "react-icons/io";
import { motion } from "framer-motion";
import SkeletonProductCard from "../components/ui/Skeleton/SkeletonProductCard.jsx";


// icons
import { TbBrandWhatsapp } from "react-icons/tb";
import { useTranslation } from "react-i18next";

  const whatappNumber =import.meta.env.VITE_NUMBER;


function ProductPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [isSimilarProductsLoading, setIsSimilarProductsLoading] = useState(true);
  const [similarProductsError, setSimilarProductsError] = useState(null);







  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await dispatch(getProductById(id));
        const product = response.payload.product;
        setProduct(product);
      } catch (err) {
        setError(err.message || "Failed to fetch product");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [dispatch, id]);

  // get similar products
  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        setIsSimilarProductsLoading(true);
        const response = await dispatch(getSimilarProducts(id));
        const similarProducts = response.payload.products;
        setSimilarProducts(similarProducts);
      } catch (err) {
        setSimilarProductsError(err.message || "Failed to fetch similar products");
      } finally {
        setIsSimilarProductsLoading(false);
      }
    };
    fetchSimilarProducts();
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <main>
        <div className="container bg-white">
          <div className="productDetail flex flex-col sm:flex-row gap-[44px] items-start mt-5 mb-[50px]">
            <ProductImagesSkeleton />
            <ProductContentSkeleton />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return <main>Error: {error}</main>;
  }

  if (!product) {
    return (
      <main className="py-24 bg-gray-50 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-md mx-auto">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                
                <IoIosSearch className="w-16 h-16 text-gray-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {t("Product.ProductNotFound.title") || "Product Not Found"}
              </h1>
              <p className="text-gray-600 mb-6">
                {t("Product.ProductNotFound.description") ||
                  "The product you are looking for does not exist or has been removed."}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => window.history.back()}
                className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                {t("Product.ProductNotFound.goBackHome") || "Go Back Home"}
              </button>
              <Link
                to="/"
                onClick={() => (window.location.href = "/")}
                className="w-full border bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                {t("Product.ProductNotFound.exploreProducts") ||
                  "Explore Products"}
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="container bg-white">
        <div className="productDetail flex flex-col sm:flex-row gap-[4px] items-start mt-5 mb-[50px]">
          <ProductSlider product={product} />
          <ProductContent product={product} />
        </div>

        {/* similar products */}
        <div className="py-12 px-4 rounded-lg my-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">
              {t("Product.SimilarProducts.title") || "Similar Products"}
            </h2>
            
            {isSimilarProductsLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {[...Array(5)].map((_, index) => (
                  <SkeletonProductCard key={index} />
                ))}
              </div>  
            ) : similarProductsError ? (
              <div className="text-center py-12 bg-red-50 rounded-lg">
                <p className="text-red-600 text-lg">
                  {similarProductsError}
                </p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  {t("Product.SimilarProducts.retry") || "Try Again"}
                </button>
              </div>
            ) : similarProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {similarProducts.map((product,index) => (
                  <ProductCard key={index} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  {t("Product.SimilarProducts.noProducts") || "No similar products found"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* whatsapp button */}
      <motion.a
        href={`https://wa.me/${whatappNumber}`}
        className="fixed p-3 bottom-2 right-4 lg:right- z-20 bg-green-500 text-white rounded-full flex items-center justify-center"
        whileHover={{
          scale: 1.1,
          rotate: 15,
          transition: { type: "spring", stiffness: 400 },
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          y: [0, -10, 0],
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.3,
          y: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        <TbBrandWhatsapp className="size-10 lg:size-12" />
      </motion.a>
    </main>
  );
}

export default ProductPage;
