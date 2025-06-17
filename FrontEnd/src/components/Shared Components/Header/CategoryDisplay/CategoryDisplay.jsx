import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { LanguageContext } from "../../../../context/language";

function CategoryDropdown({ categories }) {
    const { language } = useContext(LanguageContext);
    const { t } = useTranslation();
    const currentLang = language;
    const isRTL = currentLang === "ar";
    const [expandedCategories, setExpandedCategories] = useState({});

    // Function to get root categories (categories with no parent)
    const getRootCategories = () => {
        if (!categories || !Array.isArray(categories)) return [];
        return categories.filter((category) => !category.parent);
    };

    // Function to get child categories
    const getChildCategories = (parentId) => {
        if (!categories || !Array.isArray(categories)) return [];
        return categories.filter((category) => category.parent === parentId);
    };

    // Toggle category expansion
    const toggleCategory = (categoryId) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }));
    };

    // Check if a category is expanded
    const isCategoryExpanded = (categoryId) => {
        return expandedCategories[categoryId] === true;
    };

    // Get category name safely
    const getCategoryName = (category) => {
        if (!category || !category.name) return "Unknown Category";
        return category.name[currentLang] || category.name.en || category.name;
    };

    // Render a single category with improved styling
    const renderCategory = (category, level = 0) => {
        if (!category || !category._id) return null;

        const hasChildren = getChildCategories(category._id).length > 0;
        const isExpanded = isCategoryExpanded(category._id);
        const ArrowIcon = isRTL ? IoIosArrowBack : IoIosArrowForward;
        const paddingLeft = 16 + level * 12;

        return (
            <div key={category._id} className="relative z-[60] ">
                <div className="flex items-center justify-between hover:bg-gray-50 transition-colors duration-200">
                    <Link
                        to={`/products/${category._id}`}
                        className={`flex-grow px-4 py-3 text-gray-700 hover:text-gray-900 transition-all duration-200 ${level === 0
                                ? "font-semibold text-gray-800 border-l-2 border-transparent hover:border-blue-500"
                                : "font-normal"
                            }`}
                        style={{
                            paddingLeft: `${paddingLeft}px`,
                            paddingRight: hasChildren ? "8px" : "16px",
                        }}
                        dir={isRTL ? "rtl" : "ltr"}
                    >
                        <div className="block">
                            <span className="block truncate">
                                {getCategoryName(category)}
                            </span>
                            {level === 0 && hasChildren && (
                                <span className="text-xs text-gray-500 mt-1 block">
                                    {getChildCategories(category._id).length} {getChildCategories(category._id).length === 1 ? t("Header.item") : t("Header.items")}
                                </span>
                            )}
                        </div>
                    </Link>

                    {hasChildren && (
                        <button
                            onClick={() => toggleCategory(category._id)}
                            className="px-2 py-3 flex items-center hover:bg-gray-100 rounded-md transition-colors"
                        >
                            <ArrowIcon
                                className={`w-3 h-3 text-gray-400 transition-all duration-300 ${isExpanded ? "rotate-90 text-blue-500" : ""
                                    }`}
                            />
                        </button>
                    )}
                </div>

                {/* Render children if expanded */}
                {hasChildren && isExpanded && (
                    <div
                        className={`bg-gray-25 border-l-2 ${isExpanded ? "border-blue-200" : "border-gray-100"
                            } ml-2 transition-all duration-200`}
                    >
                        {getChildCategories(category._id).map((child) =>
                            renderCategory(child, level + 1)
                        )}
                    </div>
                )}
            </div>
        );
    };

    // Handle empty or invalid categories
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
        return (
            <div
                className={`absolute top-full ${isRTL ? "right-0" : "left-0"
                    } mt-1 bg-white shadow-lg rounded-lg border border-gray-200 w-72 z-50`}
                dir={isRTL ? "rtl" : "ltr"}
            >
                <div className="py-8 px-4 text-center text-gray-500">
                    <p className="text-sm">{t("Header.noCategories")}</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`absolute !z-[70] top-full ${isRTL ? "right-0" : "left-0"
                } mt-2 bg-white shadow-2xl rounded-lg border border-gray-200 w-80 max-h-96 overflow-hidden z-50`}
            dir={isRTL ? "rtl" : "ltr"}
        >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    {t("Header.browse_by_category")}
                </h3>
            </div>

            {/* Categories List */}
            <div className="py-2 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {getRootCategories().map((category) => renderCategory(category))}
            </div>
        </div>
    );
}

export default CategoryDropdown;
