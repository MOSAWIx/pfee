import React, { useState, useEffect, useCallback, useRef } from "react";
import { GiSettingsKnobs } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import { FiFilter, FiX } from "react-icons/fi";

import { useDispatch, useSelector } from "react-redux";

import { CategoriesSelector } from "../../Features/selectors/CategoriesSelector";
import { Link, useSearchParams } from "react-router-dom";
import { FaAngleRight, FaAngleDown } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { actGetProducts } from "../../Features/Products/actions/actGetProducts";
import { useContext } from "react";
import { LanguageContext } from "../../context/language"
import { BsArrowRight } from "react-icons/bs";

import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

const RangeStyle = `
  .range-slider .range-slider__range {
    background:rgb(0, 0, 0); 
  }
    
  .range-slider .range-slider__thumb{
      background:rgb(0, 0, 0);
      }
  `;

const colors = [
    { 
        id: "purple",
        color: "bg-[#8434e1]",
        name: {
            en: "Purple",
            ar: "بنفسجي",
            fr: "Violet"
        },
        hex: "#8434e1"
    },
    {
        id: "black", 
        color: "bg-[#252525]",
        name: {
            en: "Black",
            ar: "أسود",
            fr: "Noir"
        },
        hex: "#252525"
    },
    {
        id: "red",
        color: "bg-[#f35528]", 
        name: {
            en: "Red",
            ar: "أحمر",
            fr: "Rouge"
        },
        hex: "#f35528"
    },
    {
        id: "orange",
        color: "bg-[#f16f2b]",
        name: {
            en: "Orange", 
            ar: "برتقالي",
            fr: "Orange"
        },
        hex: "#f16f2b"
    },
    {
        id: "navy",
        color: "bg-[#345eff]",
        name: {
            en: "Navy",
            ar: "كحلي",
            fr: "Marine"
        },
        hex: "#345eff"
    },
    {
        id: "white",
        color: "bg-white border",
        name: {
            en: "White",
            ar: "أبيض",
            fr: "Blanc"
        },
        hex: "#FFFFFF"
    },
    {
        id: "brown",
        color: "bg-[#d67e3b]",
        name: {
            en: "Brown",
            ar: "بني",
            fr: "Marron"
        },
        hex: "#d67e3b"
    },
    {
        id: "green",
        color: "bg-[#48bc4e]",
        name: {
            en: "Green",
            ar: "أخضر",
            fr: "Vert"
        },
        hex: "#48bc4e"
    },
    {
        id: "yellow",
        color: "bg-[#fdc761]",
        name: {
            en: "Yellow",
            ar: "أصفر",
            fr: "Jaune"
        },
        hex: "#fdc761"
    },
    {
        id: "grey",
        color: "bg-[#e4e5e8]",
        name: {
            en: "Grey",
            ar: "رمادي",
            fr: "Gris"
        },
        hex: "#e4e5e8"
    },
    {
        id: "pink",
        color: "bg-[#e08d9d]",
        name: {
            en: "Pink",
            ar: "وردي",
            fr: "Rose"
        },
        hex: "#e08d9d"
    },
    {
        id: "blue",
        color: "bg-[#3fdeff]",
        name: {
            en: "Blue",
            ar: "أزرق",
            fr: "Bleu"
        },
        hex: "#3fdeff"
    }
];

const clothingSizes = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"];
const shoeSizes = [36, 37, 38, 39, 40, 41, 42, 43, 44];

export default function Filter({ category=false, closeMobileFilter }) {
    const { t } = useTranslation();
    const { language } = useContext(LanguageContext);
    const currentLanguage = language;
    const [searchParams, setSearchParams] = useSearchParams();
    const [isColorsOpen, setIsColorsOpen] = useState(true);
    const [isSizeOpen, setIsSizeOpen] = useState(true);
    const [isPriceOpen, setIsPriceOpen] = useState(true);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
    const [expandedCategories, setExpandedCategories] = useState(new Set());
    const [sizeType, setSizeType] = useState('shoes'); // 'clothing' or 'shoes'
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const timeOutRef = useRef(null);
    const dispatch = useDispatch();
    const categories = useSelector(CategoriesSelector.categories);

    const initialColor = searchParams.get("color") ?? null;
    const initialSize = searchParams.get("size") ?? null;
    const initialCategory = searchParams.get("category") ?? null;
    const initialSizeType = searchParams.get("sizeType") ?? 'shoes';
    const initialMinPrice = searchParams.get("minPrice")
        ? parseInt(searchParams.get("minPrice"))
        : 0;
    const initialMaxPrice = searchParams.get("maxPrice")
        ? parseInt(searchParams.get("maxPrice"))
        : 600;

    const [priceRange, setPriceRange] = useState({
        min: initialMinPrice,
        max: initialMaxPrice,
    });
    const [selectedColor, setSelectedColor] = useState(initialColor);
    const [selectedSize, setSelectedSize] = useState(initialSize);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [isLoading, setIsLoading] = useState(false);

    // Temporary states for unsaved changes
    const [tempPriceRange, setTempPriceRange] = useState(priceRange);
    const [tempSelectedColor, setTempSelectedColor] = useState(selectedColor);
    const [tempSelectedSize, setTempSelectedSize] = useState(selectedSize);
    const [tempSelectedCategory, setTempSelectedCategory] = useState(selectedCategory);
    const [tempSizeType, setTempSizeType] = useState(initialSizeType);

    // Helper function to get category name in current language
    const getCategoryName = (category) => {
        return category.name?.[currentLanguage] || category.name?.en || category.name || 'Unknown';
    };

    // Helper function to get category slug in current language
    const getCategorySlug = (category) => {
        return category.slug?.[currentLanguage] || category.slug?.en || category.slug || '';
    };

    // Build category tree structure
    const buildCategoryTree = useCallback(() => {
        if (!categories || categories.length === 0) return [];

        const categoryMap = new Map();
        const rootCategories = [];

        // First pass: create map of all categories
        categories.forEach(cat => {
            categoryMap.set(cat._id, { ...cat, children: [] });
        });

        // Second pass: organize into tree structure
        categories.forEach(cat => {
            const categoryNode = categoryMap.get(cat._id);
            if (cat.parent) {
                const parent = categoryMap.get(cat.parent);
                if (parent) {
                    parent.children.push(categoryNode);
                }
            } else {
                rootCategories.push(categoryNode);
            }
        });

        console.log("Category Tree:", rootCategories);

        return rootCategories;
    }, [categories]);

    const isWeAreInCategoryPage = () => {
        return window.location.pathname.includes('/products/');
    };


    

    const categoryTree = buildCategoryTree();

    // Get categories to display
    const getCategoriesToDisplay = useCallback(() => {
        if (!category) {
            // If no specific category is selected, show all root categories with their children
            return categoryTree;
        }

        // Find the matching category and return its children
        const findCategoryAndChildren = (cats, targetSlug) => {
            for (const cat of cats) {
                const slugs = Object.values(cat.slug || {});
                if (slugs.includes(targetSlug) || getCategorySlug(cat) === targetSlug) {
                    return cat.children || [];
                }
                if (cat.children && cat.children.length > 0) {
                    const result = findCategoryAndChildren(cat.children, targetSlug);
                    if (result.length > 0) return result;
                }
            }
            return [];
        };

        const filteredCategories = findCategoryAndChildren(categoryTree, category);
        console.log("de",filteredCategories)
        return filteredCategories.length > 0 ? filteredCategories : categoryTree;
    }, [categoryTree, category]);

    const categoriesToDisplay = getCategoriesToDisplay();

    const handleTempChange = (type, value) => {
        setHasUnsavedChanges(true);
        
        if (type === "color") {
            const newColorValue = tempSelectedColor === value ? null : value;
            setTempSelectedColor(newColorValue);
        } else if (type === "size") {
            const newSizeValue = tempSelectedSize === value ? null : value;
            setTempSelectedSize(newSizeValue);
        } else if (type === "category") {
            const newCategoryValue = tempSelectedCategory === value ? null : value;
            setTempSelectedCategory(newCategoryValue);
        } else if (type === "sizeType") {
            setTempSizeType(value);
            setTempSelectedSize(null); // Reset size when changing type
        }
    };

    const applyFilters = () => {
        setSelectedColor(tempSelectedColor);
        setSelectedSize(tempSelectedSize);
        setSelectedCategory(tempSelectedCategory);
        setPriceRange(tempPriceRange);
        setSizeType(tempSizeType);
        
        // Update URL
        const newParams = new URLSearchParams(searchParams);
        
        if (tempSelectedColor) {
            newParams.set("color", tempSelectedColor);
        } else {
            newParams.delete("color");
        }
        
        if (tempSelectedSize) {
            newParams.set("size", tempSelectedSize);
        } else {
            newParams.delete("size");
        }
        
        if (tempSelectedCategory) {
            newParams.set("category", tempSelectedCategory);
        } else {
            newParams.delete("category");
        }
        
        newParams.set("sizeType", tempSizeType);
        newParams.set("minPrice", tempPriceRange.min.toString());
        newParams.set("maxPrice", tempPriceRange.max.toString());
        
        setSearchParams(newParams);
        setHasUnsavedChanges(false);

        // Dispatch filters to Redux
        dispatch(actGetProducts({
            categoryId: category ? tempSelectedCategory : category,
            size: tempSelectedSize,
            sizeType: tempSizeType,
            color: tempSelectedColor,
            minPrice: tempPriceRange.min,
            maxPrice: tempPriceRange.max
        }));
    };

    const clearAllFilters = () => {
        setTempSelectedColor(null);
        setTempSelectedSize(null);
        setTempSelectedCategory(null);
        setTempPriceRange({ min: 0, max: 600 });
        setTempSizeType('clothing');
        setHasUnsavedChanges(true);
    };

    const handlePriceChange = (value) => {
        setTempPriceRange({ min: value[0], max: value[1] });
        setHasUnsavedChanges(true);
        setIsLoading(true);
        
        if (timeOutRef.current) {
            clearTimeout(timeOutRef.current);
        }
        timeOutRef.current = setTimeout(() => {
            setIsLoading(false);
        }, 500);
    };

    const toggleCategoryExpansion = (categoryId) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    const toggleFilter = (filterType) => {
        switch (filterType) {
            case "price":
                setIsPriceOpen(!isPriceOpen);
                break;
            case "colors":
                setIsColorsOpen(!isColorsOpen);
                break;
            case "size":
                setIsSizeOpen(!isSizeOpen);
                break;
            case "categories":
                setIsCategoriesOpen(!isCategoriesOpen);
                break;
            default:
                break;
        }
    };

    // Recursive component to render category tree
    const CategoryItem = ({ category, level = 0 }) => {
        const hasChildren = category.children && category.children.length > 0;
        const isExpanded = expandedCategories.has(category._id);
        const isSelected = tempSelectedCategory === category._id;
        const categoryName = getCategoryName(category);

        return (
            <div className={`${level > 0 ? 'ml-4' : ''}`}>
                <div className="flex justify-between items-center py-2">
                    {/* Category name - clickable for selection */}
                    <button
                        onClick={() => handleTempChange("category", category._id)}
                        className={`flex-1 text-left text-base font-semibold hover:text-gray-900 transition-colors ${
                            isSelected ? 'text-black' : 'text-gray-600'
                        }`}
                    >
                        {categoryName}
                    </button>
                    
                    {/* Expand/collapse button for categories with children */}
                    {hasChildren && (
                        <button
                            onClick={() => toggleCategoryExpansion(category._id)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                            {isExpanded ? (
                                <FaAngleDown className="w-3 h-3 text-gray-400" />
                            ) : (
                                <FaAngleRight className="w-3 h-3 text-gray-400" />
                            )}
                        </button>
                    )}
                    
                    {/* Arrow icon for categories without children */}
                    {!hasChildren && (
                        <span className="text-gray-400 text-sm">
                            <BsArrowRight />
                        </span>
                    )}
                </div>
                
                {/* Children categories */}
                {hasChildren && isExpanded && (
                    <div className="ml-2 border-l border-gray-200 pl-2">
                        {category.children.map((child) => (
                            <CategoryItem
                                key={child._id}
                                category={child}
                                level={level + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // Clear timeout on unmount
    useEffect(() => {
        return () => {
            if (timeOutRef.current) {
                clearTimeout(timeOutRef.current);
            }
        };
    }, []);

    // Initialize temp states on mount
    useEffect(() => {
        setSizeType(initialSizeType);
        setTempSizeType(initialSizeType);
    }, [initialSizeType]);

    const currentSizes = tempSizeType === 'clothing' ? clothingSizes : shoeSizes;

    return (
        <>
            <style>{RangeStyle}</style>
            <div className="">
                {/* Header with close button */}
                <div className="z-10 bg-white border-b px-4 sm:px-6 py-4 flex justify-between items-center">
                    <span className="text-lg sm:text-xl font-semibold">{t("Filter.filter")}</span>
                    <div className="flex items-center gap-3">
                        <GiSettingsKnobs className="w-5 h-5 text-gray-600" />
                        <button
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
                            onClick={closeMobileFilter}
                            aria-label="Close filters"
                        >
                            <RxCross2 className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Filter Actions */}
                <div className="px-4 sm:px-6 py-4 border-b">
                    <div className="flex gap-3">
                        <button
                            onClick={applyFilters}
                            disabled={!hasUnsavedChanges}
                            className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
                                hasUnsavedChanges
                                    ? 'bg-black text-white hover:bg-gray-800'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            {t("Filter.applyFilters")}
                        </button>
                        <button
                            onClick={clearAllFilters}
                            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
                        >
                            <FiX size={16} className="inline mr-1" />
                            {t("Filter.clear")}
                        </button>
                    </div>
                    {hasUnsavedChanges && (
                        <p className="text-xs text-orange-600 mt-2 flex items-center">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
                            {t("Filter.unsavedChanges")}
                        </p>
                    )}
                </div>

                {/* Categories - Only show when category prop is provided */}
                {category && (
                    <div className="border-b">
                        <button
                            className="w-full flex justify-between items-center px-4 sm:px-6 py-4 hover:bg-gray-50"
                            onClick={() => toggleFilter("categories")}
                        >
                            <span className="text-lg font-semibold">{t("Filter.categories")}</span>
                            {isCategoriesOpen ? (
                                <FaAngleDown className="w-4 h-4" />
                            ) : (
                                <FaAngleRight className="w-4 h-4 -rotate-90" />
                            )}
                        </button>
                        <div
                            className={`px-4 sm:px-6 transition-all duration-300 overflow-hidden ${
                                isCategoriesOpen ? "max-h-96 py-4" : "max-h-0 py-0"
                            }`}
                        >
                            { categoriesToDisplay.map((cat) => (
                                <CategoryItem key={cat._id} category={cat} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Price Range */}
                <div className="border-b">
                    <button
                        className="w-full flex justify-between items-center px-4 sm:px-6 py-4 hover:bg-gray-50"
                        onClick={() => toggleFilter("price")}
                    >
                        <span className="text-lg font-semibold">{t("Filter.price")}</span>
                        {isPriceOpen ? (
                            <FaAngleDown className="w-4 h-4" />
                        ) : (
                            <FaAngleRight className="w-4 h-4 -rotate-90" />
                        )}
                    </button>
                    <div
                        className={`px-4 sm:px-6 transition-all duration-300 ${
                            isPriceOpen ? "max-h-40 py-4" : "max-h-0 py-0"
                        } overflow-hidden`}
                    >
                        <RangeSlider
                            value={[tempPriceRange.min, tempPriceRange.max]}
                            min={0}
                            max={600}
                            onInput={handlePriceChange}
                            className="mb-4"
                        />
                        <div className="flex justify-between gap-4">
                            <div className="flex-1 px-3 py-2 border rounded-md text-center text-sm">
                                {tempPriceRange.min} MAD
                            </div>
                            <div className="flex-1 px-3 py-2 border rounded-md text-center text-sm">
                                {tempPriceRange.max} MAD
                            </div>
                        </div>
                        {isLoading && (
                            <div className="flex items-center justify-center mt-3 text-sm text-gray-500">
                                <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-2" />
                                {t("Filter.loading")}
                            </div>
                        )}
                    </div>
                </div>

                {/* Colors section */}
                <div className="border-b-2">
                    <div
                        className="flex justify-between items-center px-7 xl:px-[36px] py-5 cursor-pointer"
                        onClick={() => toggleFilter("colors")}
                    >
                        <span className="text-xl font-semibold">{t("Filter.colors")}</span>
                        {isColorsOpen ? (
                            <FaAngleDown />
                        ) : (
                            <FaAngleRight className="-rotate-90" />
                        )}
                    </div>
                    <div
                        className={`px-7 transition-all duration-300 overflow-hidden ${
                            isColorsOpen ? "max-h-96 py-5" : "max-h-0 py-0"
                        }`}
                    >
                        <div className="grid grid-cols-4 gap-3">
                            {colors.map((color) => (
                                <div
                                    key={color.id}
                                    className="flex flex-col items-center cursor-pointer"
                                    onClick={() => handleTempChange("color", color.id)}
                                >
                                    <div
                                        className={`w-9 h-9 rounded-xl shadow-sm ${color.color} ${
                                            tempSelectedColor === color.id ? "ring-2 ring-black" : ""
                                        }`}
                                    />
                                    <span className="text-xs mt-2 font-sans font-semibold text-gray-500 text-center">
                                        {color.name[currentLanguage]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Size section */}
                <div>
                    <div
                        className="flex justify-between items-center px-7 xl:px-[36px] py-5 cursor-pointer"
                        onClick={() => toggleFilter("size")}
                    >
                        <span className="text-xl font-semibold">{t("Filter.size")}</span>
                        {isSizeOpen ? (
                            <FaAngleDown />
                        ) : (
                            <FaAngleRight className="-rotate-90" />
                        )}
                    </div>
                    <div
                        className={`px-7 xl:px-[36px] transition-all duration-300 overflow-hidden ${
                            isSizeOpen ? "max-h-80 py-5" : "max-h-0 py-0"
                        }`}
                    >
                        {/* Size Type Toggle */}
                        <div className="mb-4">
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => handleTempChange("sizeType", "clothing")}
                                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                                        tempSizeType === 'clothing'
                                            ? 'bg-white text-black shadow-sm'
                                            : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                >
                                    {t("Filter.clothingSizes")}
                                </button>
                                <button
                                    onClick={() => handleTempChange("sizeType", "shoes")}
                                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                                        tempSizeType === 'shoes'
                                            ? 'bg-white text-black shadow-sm'
                                            : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                >
                                    {t("Filter.shoeSizes")}
                                </button>
                            </div>
                        </div>
                        
                        {/* Size Grid */}
                        <div className="grid grid-cols-3 gap-2">
                            {currentSizes.map((size) => (
                                <button
                                    key={size}
                                    className={`block text-gray-2 py-2 border-[#BEBCBD] border rounded-lg ${
                                        tempSelectedSize === size.toString()
                                            ? "bg-black text-white"
                                            : "hover:border-black"
                                    }`}
                                    onClick={() => handleTempChange("size", size.toString())}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}