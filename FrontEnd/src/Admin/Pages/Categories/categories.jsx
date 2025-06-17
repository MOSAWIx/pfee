import React, { useEffect, useState } from 'react'
import { CategoryItem } from '../../Components/Category/CategoryItem'
import { FaPlus } from 'react-icons/fa6';
import { CategoryForm } from '../../Components/Category/CategoryForm';
import  Overllay from '../../Components/Reusable/Overllay';
import { handleOverllay } from '../../Features/UI/UiSlice'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
// Skeleton
import { CategoryItemSkeleton } from '../../Components/Skeleton/CategoryItemSkeleton';
// confirm Delete
import { Modal } from '../../Components/Reusable/Modal';
import { AdminCategorieSelector } from '../../Selectors/AdminCategorieSelector';
import {clearSelectedCategory, toggleDeleteConfirmModal, setIsOpen } from '../../Features/CategorieAdmin/CategorieAdminSlice';
import { deleteCategory } from '../../Features/CategorieAdmin/Actions/CategorieAdminActions';
import toast from 'react-hot-toast';




function categories() {
    const isOpen = useSelector((state) => state.admin.categories.isOpen);
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.admin.categories.categories);
    console.log(categories, "mohda")
    const Loading = useSelector((state) => state.admin.categories.loading);
    const error = useSelector((state) => state.admin.categories.error);
    // Modal
    const showDeleteConfirmModal = useSelector(AdminCategorieSelector.showDeleteConfirm);
    const selectedCategory = useSelector(AdminCategorieSelector.selectedCategory);

// Handle Add Category
    const handleAddCategory = (open) => {
        dispatch(handleOverllay(open))
        dispatch(setIsOpen(open))
    }
    // Handle Scroll
    useEffect(() => {
        if (isOpen || showDeleteConfirmModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isOpen, showDeleteConfirmModal])

    // Handle Delete Category functions
    const handleOncloseModal=()=>{
        dispatch(toggleDeleteConfirmModal(false))
        dispatch(clearSelectedCategory())
    }
    const handleDeleteCategory = async () => {
        // Call the delete category action here
        try {
            await dispatch(deleteCategory(selectedCategory));
            // Optionally, you can show a success message or perform any other actions after deletion
            toast.success("Category deleted successfully");
            handleOncloseModal();
        } catch (error) {
            // Handle any errors that occur during the deletion process
            
            console.error("Error deleting category:", error);
        }
        
    }
    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen relative">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Categories
                    </h1>
                </div>
                {
                    Loading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <CategoryItemSkeleton key={index} />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-red-500 text-center">
                            {error}
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="text-gray-500 text-center">
                            No categories found.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {categories.map((category) => (
                                <CategoryItem key={category._id} {...category} setOpen={setIsOpen} />
                            ))}
                        </div>
                    )
                }


            </div>

            {/* Fixed Add Category Button */}
            <button
                className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors shadow-lg flex items-center justify-center"
                aria-label="Add Category"
                onClick={() => handleAddCategory(true)}
            >
                <FaPlus className="w-6 h-6" />
            </button>


            {/* Add Category Form */}
            {isOpen && <CategoryForm
                onClose={() => handleAddCategory(false)}
                categories={categories}

            />}
            {/* Confirm Delete */}
            {showDeleteConfirmModal &&
                <Modal
                    title="Confirm Delete"
                    content={<div>Are you sure you want to delete this category?</div>}
                    onClose={() =>handleOncloseModal()}
                    onSubmit={() => handleDeleteCategory()}
                />
            }
            {/* Overlay */}
            {showDeleteConfirmModal && <Overllay />}

        </div>
    )
}

export default categories