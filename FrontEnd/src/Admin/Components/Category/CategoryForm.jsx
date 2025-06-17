import React, { useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { createCategory, modifyCategory, fetchCategoryById } from '../../Features/CategorieAdmin/Actions/CategorieAdminActions';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { FiX } from 'react-icons/fi';
import { setSelectedCategory, setIsOpen, setIsEdit } from '../../Features/CategorieAdmin/CategorieAdminSlice';
import { handleOverllay } from '../../Features/UI/UiSlice';
import { useSelector } from 'react-redux';


export const CategoryForm = ({
    onSubmit,
    categories = [],
    onClose,
}) => {
    const dispatch = useDispatch();
    const selectedCategory = useSelector((state) => state.admin.categories.selectedCategory);
    const isOpen = useSelector((state) => state.admin.categories.isOpen);
    const isEdit = useSelector((state) => state.admin.categories.isEdit);


    const [formData, setFormData] = React.useState({
        name: {
            en: '',
            ar: '',
            fr: ''
        },
        description: {
            en: '',
            ar: '',
            fr: ''
        },
        active: true,
        parent: ''
    });

    useEffect(() => {
        const fetchCategoryData = async () => {
            if (isEdit && selectedCategory) {
                try {
                    const response = await dispatch(fetchCategoryById(selectedCategory)).unwrap();
                    const categoryData = response.category;
                    setFormData({
                        name: {
                            en: categoryData.name?.en || '',
                            ar: categoryData.name?.ar || '',
                            fr: categoryData.name?.fr || ''
                        },
                        description: {
                            en: categoryData.description?.en || '',
                            ar: categoryData.description?.ar || '',
                            fr: categoryData.description?.fr || ''
                        },
                        active: categoryData.active ?? true,
                        parent: categoryData.parent || ''
                    });
                } catch (error) {
                    toast.error('Failed to fetch category data!');
                }
            }
        };

        fetchCategoryData();
    }, [isEdit, selectedCategory, dispatch]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                if (formData.parent === '') {
                    const { parent, ...rest } = formData;
                    await dispatch(modifyCategory({ id: selectedCategory, categoryData: rest }));
                } else {
                    const categoryData = {
                        id: selectedCategory,
                        ...formData
                    };
                    await dispatch(modifyCategory({ id: selectedCategory, categoryData }));
                }
                toast.success('Category updated successfully!');

            } else {
                if (formData.parent === '') {
                    const { parent, ...rest } = formData;
                    await dispatch(createCategory(rest));
                } else {
                    await dispatch(createCategory(formData));
                }
                toast.success('Category created successfully!');
            }
            resetData();
            dispatch(setIsOpen(false));
            dispatch(setIsEdit(false));
            dispatch(handleOverllay(false));
        } catch (error) {
            toast.error(isEdit ? 'Failed to update category!' : 'Failed to create category!');
        }
        console.log('Form Data:', formData);
    };

    const resetData = () => {
        setFormData({
            name: {
                en: '',
                ar: '',
                fr: ''
            },
            description: {
                en: '',
                ar: '',
                fr: ''
            },
            active: true,
            parent: ''
        });
    };

    const handleNameChange = (lang, value) => {
        setFormData({
            ...formData,
            name: {
                ...formData.name,
                [lang]: value
            }
        });
    };

    const handleDescriptionChange = (lang, value) => {
        setFormData({
            ...formData,
            description: {
                ...formData.description,
                [lang]: value
            }
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl transform transition-all fixed left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] fadeInAlt">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between border-b dark:border-gray-700 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {isEdit ? 'Edit Category' : 'Add New Category'}
                    </h2>
                    <button
                        onClick={() => {
                            dispatch(setSelectedCategory(null));
                            dispatch(setIsOpen(false));
                            dispatch(setIsEdit(false));
                            onClose && onClose();
                        }}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <FiX className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        {/* Name Fields */}
                        <div className="space-y-4">
                            <h3 className="text-md font-medium text-gray-700 dark:text-gray-200">Category Name</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="name-en" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                        English
                                    </label>
                                    <input
                                        type="text"
                                        id="name-en"
                                        value={formData.name.en}
                                        onChange={(e) => handleNameChange('en', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 transition-colors"
                                        required
                                        placeholder="English name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="name-ar" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                        Arabic
                                    </label>
                                    <input
                                        type="text"
                                        id="name-ar"
                                        value={formData.name.ar}
                                        onChange={(e) => handleNameChange('ar', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 transition-colors"
                                        dir="rtl"
                                        placeholder="الاسم بالعربية"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="name-fr" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                        French
                                    </label>
                                    <input
                                        type="text"
                                        id="name-fr"
                                        value={formData.name.fr}
                                        onChange={(e) => handleNameChange('fr', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 transition-colors"
                                        placeholder="Nom en français"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description Fields */}
                        <div className="space-y-4">
                            <h3 className="text-md font-medium text-gray-700 dark:text-gray-200">Description</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="description-en" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                        English
                                    </label>
                                    <textarea
                                        id="description-en"
                                        rows={3}
                                        value={formData.description.en}
                                        onChange={(e) => handleDescriptionChange('en', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 transition-colors resize-none"
                                        placeholder="English description"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="description-ar" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                        Arabic
                                    </label>
                                    <textarea
                                        id="description-ar"
                                        rows={3}
                                        value={formData.description.ar}
                                        onChange={(e) => handleDescriptionChange('ar', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 transition-colors resize-none"
                                        dir="rtl"
                                        placeholder="الوصف بالعربية"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="description-fr" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                        French
                                    </label>
                                    <textarea
                                        id="description-fr"
                                        rows={3}
                                        value={formData.description.fr}
                                        onChange={(e) => handleDescriptionChange('fr', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 transition-colors resize-none"
                                        placeholder="Description en français"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="parent" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Parent Category
                            </label>
                            <select
                                id="parent"
                                value={formData.parent}
                                onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 transition-colors"
                            >
                                <option value="" className="dark:bg-gray-700">None</option>
                                {categories
                                    .filter(category => !isEdit || category._id !== selectedCategory)
                                    .map((category) => (
                                        <option key={category._id} value={category._id} className="dark:bg-gray-700">
                                            {category.name.en}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Active Status</span>
                            <Switch
                                checked={formData.active}
                                onChange={(checked) => setFormData({ ...formData, active: checked })}
                                className={`${formData.active ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:ring-offset-gray-800`}
                            >
                                <span className="sr-only">Enable category</span>
                                <span
                                    className={`${formData.active ? 'translate-x-6' : 'translate-x-1'
                                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                />
                            </Switch>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
                        <button
                            type="button"
                            onClick={
                                () => {
                                    dispatch(setSelectedCategory(null));
                                    dispatch(setIsOpen(false));
                                    dispatch(setIsEdit(false));
                                    onClose && onClose();
                                }

                            }
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400 transition-colors"
                        >
                            {isEdit ? 'Update Category' : 'Create Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
