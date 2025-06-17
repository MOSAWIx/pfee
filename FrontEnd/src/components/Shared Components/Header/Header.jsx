import { IoIosArrowDown } from "react-icons/io";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import CategoryDropdown from "./CategoryDisplay/CategoryDisplay";
import { CategoriesSelector } from "../../../Features/selectors/CategoriesSelector";
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect, useCallback } from "react";
import SwitchLanguage from "../SwitchLuanguage";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fetchLogo } from "../../../Admin/Features/Settings/logoSlice/LogoAction";

function Header() {
    const categories = useSelector((state) =>
        CategoriesSelector.categories(state)
    );
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    
    // Redux state for logo
    const { data: logo, loading: logoLoading, error: logoError, source: logoSource } = useSelector(
        (state) => state.admin.logo
    );
    
    const [showCategories, setShowCategories] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [logoFetchAttempted, setLogoFetchAttempted] = useState(false);
      
    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const logoIntervalRef = useRef(null);
    const isRTL = i18n.language === "ar";

    // Memoized logo fetch function to prevent recreating on every render
    const handleLogoFetch = useCallback(async (forceRefresh = false) => {
        // Prevent multiple simultaneous fetches
        if (logoLoading && !forceRefresh) {
            console.log('Logo fetch already in progress, skipping');
            return;
        }

        // Check if we already have logo data and haven't attempted fetch
        if (!logo?.path && !logoFetchAttempted) {
            console.log('Dispatching fetchLogo - no logo data available');
            setLogoFetchAttempted(true);
            dispatch(fetchLogo());
        } else if (forceRefresh) {
            console.log('Force refreshing logo');
            dispatch(fetchLogo({ forceRefresh: true }));
        } else if (logo?.path) {
            console.log('Logo already available:', logo);
        }
    }, [dispatch, logo?.path, logoLoading, logoFetchAttempted]);

    // Initial logo fetch - only runs once on mount
    useEffect(() => {
        handleLogoFetch();
    }, []); // Empty dependency array - only run once on mount

    // Periodic logo refresh - separate effect with proper cleanup
    useEffect(() => {
        // Only set up interval if we have logo data from cache
        if (logo?.path && logoSource === 'localStorage') {
            console.log('Setting up periodic logo refresh');
            logoIntervalRef.current = setInterval(() => {
                console.log('Periodic logo refresh check');
                handleLogoFetch(true);
            }, 10 * 60 * 1000); // Check every 10 minutes
        }

        // Cleanup function
        return () => {
            if (logoIntervalRef.current) {
                console.log('Cleaning up logo refresh interval');
                clearInterval(logoIntervalRef.current);
                logoIntervalRef.current = null;
            }
        };
    }, [logo?.path, logoSource, handleLogoFetch]);

    // Listen for storage events (when localStorage is updated in another tab)
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'website_logo_cache') {
                console.log('Storage event detected for logo cache');
                // Logo was updated in another tab, refresh our data
                handleLogoFetch(true);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [handleLogoFetch]);

    // Close the dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowCategories(false);
            }
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target)
            ) {
                setIsMobileMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileMenuOpen]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    // Function to get root categories for mobile menu
    const getRootCategories = () => {
        return categories.filter((category) => !category.parent);
    };

    // Function to get child categories for mobile menu
    const getChildCategories = (parentId) => {
        return categories.filter((category) => category.parent === parentId);
    };

    // Mobile category item component
    const MobileCategoryItem = ({ category, level = 0, onClose }) => {
        const [isExpanded, setIsExpanded] = useState(false);
        const hasChildren = getChildCategories(category._id).length > 0;
        const currentLang = i18n.language;
        
        return (
            <div className="border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                    <Link
                        to={`/products/${category._id}`}
                        onClick={onClose}
                        className={`flex-1 py-3 px-4 text-gray-700 hover:bg-gray-50 transition-colors ${
                            level === 0 ? "font-semibold" : "font-normal"
                        }`}
                        style={{ paddingLeft: `${16 + level * 20}px` }}
                    >
                        {category.name[currentLang] || category.name.en}
                    </Link>
                    {hasChildren && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-3 hover:bg-gray-50 transition-colors"
                        >
                            <IoIosArrowDown
                                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                                    isExpanded ? "rotate-180" : ""
                                }`}
                            />
                        </button>
                    )}
                </div>
                {hasChildren && isExpanded && (
                    <div className="bg-gray-25">
                        {getChildCategories(category._id).map((child) => (
                            <MobileCategoryItem
                                key={child._id}
                                category={child}
                                level={level + 1}
                                onClose={onClose}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // Enhanced Logo rendering component with better error handling
    const LogoComponent = () => {
        if (logoLoading) {
            return (
                <div className="flex items-center">
                    <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                </div>
            );
        }

        // Show error state briefly, then fallback
        if (logoError && logoFetchAttempted) {
            console.warn('Logo loading error:', logoError);
            // Don't retry automatically to prevent loops
        }

        if (logo?.path) {
            return (
                <div className="h-full py-1">
                    <img
                        src={`${import.meta.env.VITE_API_BASE_URL}${logo.path}`}
                        alt={logo.altText || "Website Logo"}
                        loading="eager"
                        fetchPriority="high"
                        className="max-w-[200px] h-full object-cover"
                        onError={(e) => {
                            console.error('Failed to load logo image from:', e.target.src);
                            // Only force refresh once per session to prevent loops
                            if (logoSource === 'localStorage' && !e.target.dataset.refreshAttempted) {
                                console.log('Marking refresh attempt and forcing refresh due to image load error');
                                e.target.dataset.refreshAttempted = 'true';
                                handleLogoFetch(true);
                            }
                            e.target.style.display = 'none';
                        }}
                    />
                </div>
            );
        }

        // Fallback logo/text - always show this if no logo is available
        return (
            <div className="flex items-center">
                <h1 className="text-xl font-bold tracking-wider uppercase">
                    <span className="text-gray-900">Solea</span>
                    <span className="text-gray-400">Shop</span>
                </h1>
            </div>
        );
    };

    return (
        <>
            <header className="bg-white sticky top-0 z-[55] border-b border-gray-200 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Mobile Menu Button */}
                        <div className="lg:hidden">
                            <button
                                onClick={toggleMobileMenu}
                                className="p-2 hover:bg-gray-50 rounded-md transition-colors"
                                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                            >
                                {isMobileMenuOpen ? (
                                    <HiX className="w-6 h-6 text-gray-700" />
                                ) : (
                                    <HiMenuAlt3 className="w-6 h-6 text-gray-700" />
                                )}
                            </button>
                        </div>

                        {/* Logo */}
                        <div className="h-full">
                            <Link to="/" className="block h-full">
                                <LogoComponent className="h-full py-3" />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-8">
                            {/* Categories Dropdown */}
                            <div
                                className={`relative ${isRTL ? "text-right" : "text-left"}`}
                                ref={dropdownRef}
                                onMouseEnter={() => setShowCategories(true)}
                                onMouseLeave={() => setShowCategories(false)}
                            >
                                <button
                                    className={`flex items-center gap-1 py-2 px-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-all duration-200 ${
                                        showCategories ? "bg-gray-50 text-gray-900" : ""
                                    }`}
                                >
                                    <span className="font-medium">
                                        {t("Header.categories")}
                                    </span>
                                    <IoIosArrowDown
                                        className={`w-4 h-4 transition-transform duration-300 ${
                                            showCategories ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>
                                {showCategories && <CategoryDropdown categories={categories} />}
                            </div>

                            {/* Products Link */}
                            <Link 
                                to="/products" 
                                className="py-2 px-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-all duration-200 font-medium"
                            >
                                {t("Header.ProductsName")}
                            </Link>
                        </nav>

                        {/* Right Side - Language Switcher */}
                        <div className="flex items-center">
                            <SwitchLanguage />
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-[1000] lg:hidden"
                        onClick={closeMobileMenu}
                    />
                    
                    <motion.div
                        ref={mobileMenuRef}
                        initial={{ x: isRTL ? '100%' : '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: isRTL ? '100%' : '-100%' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={`fixed top-0 ${
                            isRTL ? "right-0" : "left-0"
                        } h-full w-80 max-w-[85vw] bg-white shadow-xl z-[1001] overflow-hidden`}
                    >
                        {/* Mobile Menu Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                            <Link to="/" onClick={closeMobileMenu}>
                                <LogoComponent className="h-8" />
                            </Link>
                            <button
                                onClick={closeMobileMenu}
                                className="p-2 hover:bg-gray-50 rounded-md transition-colors"
                                aria-label="Close menu"
                            >
                                <HiX className="w-5 h-5 text-gray-700" />
                            </button>
                        </div>

                        {/* Mobile Menu Content */}
                        <div className="flex-1">
                            {/* Quick Links */}
                            <div className="py-2 border-b border-gray-100">
                                <Link
                                    to="/products"
                                    onClick={closeMobileMenu}
                                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                                >
                                    {t("Header.ProductsName")}
                                </Link>
                            </div>

                            {/* Categories Section */}
                            <div className="py-2">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                        {t("Header.categories") || "Categories"}
                                    </h3>
                                </div>
                                <div className="max-h-[calc(100vh-350px)] overflow-y-auto custom-scroll">
                                    {categories && categories.length > 0 ? (
                                        getRootCategories().map((category) => (
                                            <MobileCategoryItem
                                                key={category._id}
                                                category={category}
                                                onClose={closeMobileMenu}
                                            />
                                        ))
                                    ) : (
                                        <div className="py-8 text-center text-gray-500">
                                            <p className="text-sm">
                                                {t("Header.noCategories") || "No categories available"}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Language Switcher in Mobile */}
                            <div className="p-4 border-t border-gray-100 mt-auto flex-1">
                                <SwitchLanguage />
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </>
    );
}

export default Header;