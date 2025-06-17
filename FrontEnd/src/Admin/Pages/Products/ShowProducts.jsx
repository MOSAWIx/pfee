import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { AdminProducts } from '../../Selectors/AdminProducts'
import { fetchProducts } from '../../Features/ProductsAdmin/Action/ProductAdminActions'
import ProductCard from '../../Components/Reusable/ProductCard'
import CustomSpinner from '../../Components/Reusable/CustomSpinner'
import { Modal } from '../../Components/Reusable/Modal'
import Overllay from '../../Components/Reusable/Overllay'
import { setShowDeleteConfirm, setSelectedProduct } from '../../Features/ProductsAdmin/ProductAdminSlice'
import { deleteProduct } from '../../Features/ProductsAdmin/Action/ProductAdminActions'


function ShowProducts() {
    const dispatch = useDispatch();
    const products = useSelector(AdminProducts.products);
    const loading = useSelector(AdminProducts.loading);
    const error = useSelector(AdminProducts.error);
    const showDeleteConfirmModal = useSelector(AdminProducts.showDeleteConfirm);
    const selectedProduct = useSelector(AdminProducts.selectedProduct);
    const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'active', 'inactive'

    // Handle Delete Product
    const handleDeleteProduct = () => {
        dispatch(deleteProduct(selectedProduct));
        dispatch(setShowDeleteConfirm(false));
    }
    const handleOncloseModal = () => {
        dispatch(setShowDeleteConfirm(false))
        dispatch(setSelectedProduct(null))
    }

    // Dispatch the fetchProducts action
    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        if (showDeleteConfirmModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [showDeleteConfirmModal])

    // Filter products based on active status
    const filteredProducts = products.filter(product => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'active') return product.active;
        if (activeFilter === 'inactive') return !product.active;
        return true;
    });

    // Handle loading and error states after hooks
    if (loading) return <CustomSpinner />;
    if (error) return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
            <div className="bg-red-50 dark:bg-red-900/50 p-6 rounded-xl shadow-lg">
                <p className="text-red-600 dark:text-red-400">Error: {error}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 transition-colors duration-200">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>

                    {/* Filter Buttons */}
                    <div className="flex space-x-4 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-md">
                        <button
                            onClick={() => setActiveFilter('all')}
                            className={`px-4 py-2 rounded-lg transition-all duration-200 ${activeFilter === 'all'
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            All ({products.length})
                        </button>
                        <button
                            onClick={() => setActiveFilter('active')}
                            className={`px-4 py-2 rounded-lg transition-all duration-200 ${activeFilter === 'active'
                                    ? 'bg-green-600 text-white shadow-md'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            Active ({products.filter(p => p.active).length})
                        </button>
                        <button
                            onClick={() => setActiveFilter('inactive')}
                            className={`px-4 py-2 rounded-lg transition-all duration-200 ${activeFilter === 'inactive'
                                    ? 'bg-red-600 text-white shadow-md'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            Inactive ({products.filter(p => !p.active).length})
                        </button>
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                        <div className="text-gray-500 dark:text-gray-400 text-lg">
                            No {activeFilter !== 'all' ? activeFilter : ''} products found
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>

            {showDeleteConfirmModal &&
                <Modal
                    title="Confirm Delete"
                    content={<div>Are you sure you want to delete this Product?</div>}
                    onClose={() => handleOncloseModal()}
                    onSubmit={() => handleDeleteProduct()}
                />
            }
            {/* Overlay */}
            {showDeleteConfirmModal && <Overllay />}





        </div>

    )
}

export default ShowProducts