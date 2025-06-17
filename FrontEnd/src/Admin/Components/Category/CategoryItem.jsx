import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setSelectedCategory, toggleDeleteConfirmModal, setIsOpen, setIsEdit, } from '../../Features/CategorieAdmin/CategorieAdminSlice';
import { handleOverllay } from '../../Features/UI/UiSlice';

// Category Item Component
export const CategoryItem = ({ _id, name, description, parentId, active, setOpen }) => {
    console.log(_id, name, description, parentId, active);
    const dispatch = useDispatch();

    // Function to handle edit action
    const handleDelete = (_id) => {
        dispatch(setSelectedCategory(_id));
        dispatch(toggleDeleteConfirmModal(true));
    };
    // Function To Handle Edit ACtion
    const handleEdit = (_id) => {
        dispatch(setSelectedCategory(_id));
        dispatch(setIsOpen(true));
        dispatch(setIsEdit(true));
        dispatch(handleOverllay(true));
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{name.en}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">{description.en}</p>
                    {parentId && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 block">
                            Parent Category ID: {parentId}
                        </span>
                    )}
                </div>
                <div className="flex items-center space-x-3">
                    <span
                        className={`px-3 py-1 rounded-full text-sm ${
                            active
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                    >
                        {active ? 'Active' : 'Inactive'}
                    </span>
                    <button
                        onClick={() => handleEdit(_id)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors"
                        aria-label="Edit category"
                    >
                        <FaEdit className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => handleDelete(_id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors"
                        aria-label="Delete category"
                    >
                        <FaTrash className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
