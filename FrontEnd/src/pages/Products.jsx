import { useEffect, useState, useContext } from "react";
import Filter from "../components/Filter/Filter";
import { IoFilterOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { actGetProducts } from "../Features/Products/actions/actGetProducts";
import { getProducts, getLoading } from "../Features/selectors/ProducsSelector";
import { CategoriesSelector } from "../Features//selectors/CategoriesSelector";
import ProductCard from "../components/Product Card/ProductCard";
import { EmptyState } from "../components/Shared Components/EmptyProducts";
import { useParams } from "react-router-dom";
import SkeletonProductCard from "../components/ui/Skeleton/SkeletonProductCard";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../context/language";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function ProductList() {
    const { t } = useTranslation();
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const products = useSelector(getProducts);
    const loading = useSelector(getLoading);
    const pagination = useSelector(state => state.root.products.data.pagination);
    const dispatch = useDispatch();
    const { language } = useContext(LanguageContext);
    const categories = useSelector(CategoriesSelector.categories);
    console.log(categories, "categories");
    const categoryName =t('allProducts');


    useEffect(() => {
        dispatch(actGetProducts({
            page: pagination.page,
            limit: pagination.limit
        }));
    }, [dispatch, pagination.page]);

    useEffect(() => {
        if (showMobileFilter) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [showMobileFilter]);

    const handlePageChange = (newPage) => {
        dispatch(actGetProducts({
            page: newPage,
            limit: pagination.limit
        }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="container mt-section-padding relative">
            {/* Mobile Filter Button */}
            <div className="lg:hidden  bg-white p-4 border-b">
                <button
                    className="w-full flex items-center justify-center gap-2 py-3 bg-black text-white rounded-md"
                    onClick={() => setShowMobileFilter(!showMobileFilter)}
                >
                    <IoFilterOutline size={20} />
                    {showMobileFilter ? "Hide Filters" : "Show Filters"}
                </button>
            </div>

            <div className="relative flex flex-col lg:flex-row lg:gap-4 ">
                {/* Mobile/Desktop Filter - Hidden on mobile by default, always visible on desktop */}
                <div
                    className={`fixed lg:relative inset-0 z-[9999999] transform ${showMobileFilter ? "translate-x-0" : language === 'ar' ? "translate-x-full" : "-translate-x-full"
                        } lg:translate-x-0 transition-transform duration-300 ease-in-out lg:z-0 lg:w-1/4 md:shadow-md min-h-screen lg:h-fit`}
                >
                    {/* Semi-transparent overlay for mobile */}
                    <div
                        className={`${showMobileFilter ? "opacity-50" : "opacity-0"
                            } absolute inset-0 bg-black lg:hidden transition-all delay-300`}
                        onClick={() => setShowMobileFilter(false)}
                    />

                    {/* Sidebar container */}
                    <div 
                        id="filter-container" 
                        className={`z-[999] relative min-h-screen h-[calc(100vh-4rem)] sm:h-fit w-3/4 max-w-xs lg:w-full lg:max-w-none bg-white overflow-y-auto pb-20 lg:pb-0 ${language === 'ar' ? 'right-0' : 'left-0'}`}
                    >
                        <div className="p-4">
                            <Filter
                            category={true}
                                closeMobileFilter={() => setShowMobileFilter(false)}
                            />
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="w-full lg:w-3/4">
                    <div className="flex justify-between items-center px-4 mt-5">
                        <h1 className="text-gray-2 text-[22px] font-semibold">
                            {categoryName || t('allProducts')}
                        </h1>
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="w-full grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 items-start gap-10 p-4">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <SkeletonProductCard key={index} />
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <EmptyState setShowMobileFilter={setShowMobileFilter} />
                    ) : (
                        <>
                            <motion.div
                                className="w-full grid grid-cols-2  md:grid-cols-3 2xl:grid-cols-4 items-start gap-10 p-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                {products.map((product, index) => (
                                    <motion.div
                                        key={product._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: index * 0.1
                                        }}
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Pagination Controls */}
                            <div className="flex items-center justify-between px-4 py-3 bg-white border-t">
                                <div className="flex items-center">
                                    <p className="text-sm text-gray-700">
                                        {t('showing')} <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> {t('to')} {' '}
                                        <span className="font-medium">
                                            {Math.min(pagination.page * pagination.limit, pagination.total)}
                                        </span>{' '}
                                        {t('of')} <span className="font-medium">{pagination.total}</span> {t('products')}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={pagination.page === 1}
                                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                                            pagination.page === 1
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <FaChevronLeft className={`h-4 w-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
                                    </button>
                                    {[...Array(pagination.totalPages)].map((_, index) => (
                                        <button
                                            key={index + 1}
                                            onClick={() => handlePageChange(index + 1)}
                                            className={`px-3 py-1 rounded-md text-sm font-medium ${
                                                pagination.page === index + 1
                                                ? 'bg-black text-white'
                                                : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        disabled={pagination.page === pagination.totalPages}
                                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                                            pagination.page === pagination.totalPages
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <FaChevronRight className={`h-4 w-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}