import React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { IoToggle, IoToggleOutline } from 'react-icons/io5';
import { FaTshirt, FaRuler } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setShowDeleteConfirm, setSelectedProduct } from '../../Features/ProductsAdmin/ProductAdminSlice';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_BASE_URL;



function ProductCard({ product, onEdit, onDelete, onToggleActive }) {
    console.log("bb",product);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const deleteProduct = (_id) => {
        dispatch(setShowDeleteConfirm(true));
        dispatch(setSelectedProduct(_id));
    }

    const {
        title,
        basePrice,
        priceFor2,
        priceFor3,
        discount,
        colors,
        active,
        category,
        rating
    } = product;

    // Calculate discounted price
    const discountedPrice = basePrice - (basePrice * (discount / 100));

    // Get first color's first image as main display image
    const mainImage = colors[0]?.images[0]?.thumbnailPath;

    // Calculate total stock across all variants
    const calculateTotalStock = () => {
        return colors.reduce((totalStock, color) => {
            const sizesStock = color.sizes?.reduce((sum, size) => sum + size.stock, 0) || 0;
            const taillesStock = color.tailles?.reduce((sum, taille) => sum + taille.stock, 0) || 0;
            return totalStock + sizesStock + taillesStock;
        }, 0);
    };

    // Get available variants count
    const getVariantsCount = () => {
        return colors.reduce((counts, color) => {
            if (color.sizes?.length > 0) counts.sizes += color.sizes.length;
            if (color.tailles?.length > 0) counts.tailles += color.tailles.length;
            return counts;
        }, { sizes: 0, tailles: 0 });
    };

    const totalStock = calculateTotalStock();
    const variants = getVariantsCount();

    const handleEdit = () => {
        navigate(`/admin/products/modify/${product._id}`);
    }

    // Ensure category is defined and has a name

    return (
        <div
            className={`relative w-72 rounded-xl overflow-hidden transition-all duration-300 
            ${active
                    ? 'bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl border border-transparent dark:border-gray-700'
                    : 'bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 opacity-75'
                }`}
        >
            {/* Action Buttons */}
            <div className="absolute top-3 left-3 flex gap-2 z-10">
                <button
                    onClick={() => handleEdit()}
                    className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 
                             hover:bg-blue-500 hover:text-white transition-all duration-200 shadow-md"
                    title="Edit Product"
                >
                    <FiEdit2 size={16} />
                </button>
                <button
                    onClick={() => deleteProduct(product._id)}
                    className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 
                             hover:bg-red-500 hover:text-white transition-all duration-200 shadow-md"
                    title="Delete Product"
                >
                    <FiTrash2 size={16} />
                </button>
            </div>

            {/* Active Status Toggle */}
            <div className="absolute top-3 right-3 z-10">
                <button
                    onClick={() => onToggleActive(product)}
                    className={`p-2 rounded-full transition-all duration-200 shadow-md ${active
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-400 text-white hover:bg-gray-500 dark:bg-gray-700'
                        }`}
                    title={active ? "Deactivate Product" : "Activate Product"}
                >
                    {active ? <IoToggle size={20} /> : <IoToggleOutline size={20} />}
                </button>
            </div>

            {/* Discount Badge */}
            <div className="absolute top-14 right-3 flex flex-col gap-2 z-10">
                {discount > 0 && (
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md transform rotate-2">
                        -{discount}%
                    </div>
                )}
                {(priceFor2 || priceFor3) && (
                    <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-md">
                        Bundle Deals
                    </div>
                )}
            </div>

            {/* Product Image with Active/Inactive Overlay */}
            <div className="relative w-full h-52 overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                    src={`${API_URL}${mainImage}`}
                    alt={title.en}
                    className={`w-full h-full object-cover transition-all duration-300 hover:scale-105`}
                />
                {!active && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm">
                        <span className="bg-gray-900/75 text-white px-4 py-2 rounded-md text-sm font-medium transform -rotate-6 shadow-lg border border-gray-700">
                            INACTIVE
                        </span>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className={`p-5 ${active ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-900'}`}>
                {/* Title in multiple languages */}
                <div className="mb-2">
                    <h3 className={`text-lg font-bold truncate ${active ? 'text-gray-800 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}>
                        {title.en}
                    </h3>
                    <div className="flex gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{title.fr}</span>
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <span dir="rtl">{title.ar}</span>
                    </div>
                </div>

                {/* Prices and Stock */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            {discount > 0 ? (
                                <>
                                    <span className={`text-xl font-bold ${active ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                        ${discountedPrice.toFixed(2)}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                        ${basePrice.toFixed(2)}
                                    </span>
                                </>
                            ) : (
                                <span className={`text-xl font-bold ${active ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                    ${basePrice.toFixed(2)}
                                </span>
                            )}
                        </div>
                        {(priceFor2 || priceFor3) && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {priceFor2 && <div>2x: ${priceFor2.toFixed(2)}</div>}
                                {priceFor3 && <div>3x: ${priceFor3.toFixed(2)}</div>}
                            </div>
                        )}
                    </div>

                    {/* Stock Badge with Variants Info */}
                    <div className="flex flex-col items-end gap-1">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${active ? (
                                totalStock > 0
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400'
                            ) : (
                                'bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-500'
                            )}`}
                        >
                            {totalStock > 0 ? `In Stock (${totalStock})` : 'Out of Stock'}
                        </span>
                        <div className="flex gap-2 text-xs text-gray-500 dark:text-gray-400">
                            {variants.sizes > 0 && (
                                <span className="flex items-center">
                                    <FaTshirt className="w-3 h-3 mr-1" />
                                    {variants.sizes}
                                </span>
                            )}
                            {variants.tailles > 0 && (
                                <span className="flex items-center">
                                    <FaRuler className="w-3 h-3 mr-1" />
                                    {variants.tailles}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Category & Colors */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <span className={`text-sm ${active ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-500'}`}>
                            {category?.name?.en || "cate test"}
                        </span>
                        {rating > 0 && (
                            <span className="flex items-center text-sm text-yellow-500">
                                ★ {rating.toFixed(1)}
                            </span>
                        )}
                    </div>
                    <div className="flex gap-1.5">
                        {colors.map((color) => (
                            <div
                                key={color.colorHex}
                                className={`w-5 h-5 rounded-full shadow-sm transform transition-transform hover:scale-110 
                                    ${active ? 'border border-gray-200 dark:border-gray-600' : 'border border-gray-300 dark:border-gray-700 opacity-75'}`}
                                style={{ backgroundColor: color.colorHex }}
                                title={`${color.name.en} (${(color.sizes?.reduce((sum, size) => sum + size.stock, 0) || 0) +
                                    (color.tailles?.reduce((sum, taille) => sum + taille.stock, 0) || 0)
                                    } in stock)`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;