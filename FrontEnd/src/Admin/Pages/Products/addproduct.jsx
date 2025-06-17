import React, { useCallback, useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { HiPlus, HiMinus, HiPhotograph, HiTrash, HiX } from 'react-icons/hi';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../../Features/ProductsAdmin/Action/ProductAdminActions';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { AdminCategorieSelector } from '../../Selectors/AdminCategorieSelector';
import { fetchCategories } from '../../Features/CategorieAdmin/Actions/CategorieAdminActions';

const defaultSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '4XL', '5XL', '6XL'];
const defaultTailles = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];


function AddProduct() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const categories = useSelector(AdminCategorieSelector.categories);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const { register, handleSubmit, control, watch, formState: { errors }, setValue } = useForm({
        defaultValues: {
            title: {
                en: '',
                fr: '',
                ar: ''
            },
            description: {
                en: '',
                fr: '',
                ar: ''
            },
            basePrice: '',
            priceFor2: '',
            priceFor3: '',
            discount: 0,
            category: '',
            googleSheetId: '',
            colors: [{
                name: {
                    en: '',
                    fr: '',
                    ar: ''
                },
                colorHex: '#000000',
                images: [],
                sizes: [],
                tailles: []
            }],
            active: true,
        }
    });

    const { fields: colorFields, append: appendColor, remove: removeColor } = useFieldArray({
        control,
        name: "colors"
    });

    const onSubmit = async (data) => {
        console.log('Form Data:', data);
        await dispatch(createProduct(data));
        toast.success('Product created successfully');
        navigate('/admin/products');
    };

    const handleSizeSelect = (e) => {
        const size = e.target.value;
        if (size) {
            setSelectedSizes([...selectedSizes, size]);
            setAvailableSizes(availableSizes.filter(s => s !== size));
            setValue('size', [...selectedSizes, size]);
        }
    };

    const handleTailleSelect = (e) => {
        const taille = e.target.value;
        if (taille) {
            setSelectedTailles([...selectedTailles, taille]);
            setAvailableTailles(availableTailles.filter(t => t !== taille));
            setValue('taille', [...selectedTailles, taille]);
        }
    };

    const removeSize = (size) => {
        setSelectedSizes(selectedSizes.filter(s => s !== size));
        setAvailableSizes([...availableSizes, size].sort());
        setValue('size', selectedSizes.filter(s => s !== size));
    };

    const removeTaille = (taille) => {
        setSelectedTailles(selectedTailles.filter(t => t !== taille));
        setAvailableTailles([...availableTailles, taille].sort());
        setValue('taille', selectedTailles.filter(t => t !== taille));
    };

    const ImageDropzone = ({ index }) => {
        const [previews, setPreviews] = useState([]);

        // Load any existing images when the component mounts
        useEffect(() => {
            const existingImages = watch(`colors.${index}.images`) || [];
            if (existingImages.length > 0) {
                const newPreviews = existingImages.map(file => ({
                    file,
                    preview: file.preview || URL.createObjectURL(file)
                }));
                setPreviews(newPreviews);
            }
        }, [index]);

        const onDrop = useCallback((acceptedFiles) => {
            const newPreviews = acceptedFiles.map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }));
            setPreviews(prev => [...prev, ...newPreviews]);

            const currentImages = watch(`colors.${index}.images`) || [];
            setValue(`colors.${index}.images`, [...currentImages, ...acceptedFiles]);
        }, [index]);

        const { getRootProps, getInputProps, isDragActive } = useDropzone({
            onDrop,
            accept: {
                'image/*': ['.jpeg', '.jpg', '.png', '.webp']
            }
        });

        const removeImage = (previewIndex) => {
            setPreviews(prev => prev.filter((_, i) => i !== previewIndex));
            const currentImages = watch(`colors.${index}.images`) || [];
            setValue(
                `colors.${index}.images`,
                currentImages.filter((_, i) => i !== previewIndex)
            );
        };

        return (
            <div className="space-y-6">
                <div
                    {...getRootProps()}
                    className={`mt-6 flex justify-center px-8 py-10 border-2 ${isDragActive ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-600'
                        } border-dashed rounded-2xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-300`}
                >
                    <div className="space-y-4 text-center">
                        <HiPhotograph className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500" />
                        <div className="flex flex-col items-center text-sm text-gray-600 dark:text-gray-400">
                            <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                                <span>Upload files</span>
                                <input {...getInputProps()} />
                            </label>
                            <p className="mt-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG, WEBP up to 10MB
                        </p>
                    </div>
                </div>

                {previews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                        {previews.map((preview, previewIndex) => (
                            <div key={preview.preview} className="relative group">
                                <div className="relative aspect-square overflow-hidden rounded-xl shadow-lg border-2 border-gray-100 dark:border-gray-700">
                                    <img
                                        src={preview.preview}
                                        alt="preview"
                                        className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => removeImage(previewIndex)}
                                            className="p-3 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transform hover:scale-110 transition-all duration-300"
                                        >
                                            <HiTrash className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };
    // color Picker

    const ColorPicker = ({ index }) => {
        const [showPalette, setShowPalette] = useState(false);
        const colorHex = watch(`colors.${index}.colorHex`);

        const commonColors = [
            '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
            '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
            '#008000', '#800000', '#008080', '#000080', '#808080',
            '#C0C0C0', '#FFC0CB', '#FFD700', '#A52A2A', '#F5F5DC'
        ];

        const SizeManager = () => {
            const [availableSizes, setAvailableSizes] = useState(() => {
                const currentSizes = watch(`colors.${index}.sizes`) || [];
                return defaultSizes.filter(size => !currentSizes.some(s => s.value === size));
            });

            const handleAddSize = (e) => {
                const size = e.target.value;
                if (size) {
                    const currentSizes = watch(`colors.${index}.sizes`) || [];
                    setValue(`colors.${index}.sizes`, [...currentSizes, { value: size, stock: 0 }]);
                    setAvailableSizes(availableSizes.filter(s => s !== size));
                    e.target.value = ''; // Reset select
                }
            };

            const handleRemoveSize = (sizeValue) => {
                const currentSizes = watch(`colors.${index}.sizes`) || [];
                setValue(
                    `colors.${index}.sizes`,
                    currentSizes.filter(s => s.value !== sizeValue)
                );
                setAvailableSizes([...availableSizes, sizeValue].sort());
            };

            const handleStockChange = (sizeValue, newStock) => {
                const currentSizes = watch(`colors.${index}.sizes`) || [];
                setValue(
                    `colors.${index}.sizes`,
                    currentSizes.map(s => s.value === sizeValue ? { ...s, stock: parseInt(newStock) || 0 } : s)
                );
            };

            return (
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Sizes
                    </label>
                    <select
                        onChange={handleAddSize}
                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200 py-3 px-4"
                        value=""
                    >
                        <option value="">Add a size</option>
                        {availableSizes.map((size) => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                    <div className="space-y-3 mt-4">
                        {(watch(`colors.${index}.sizes`) || []).map((size, sizeIndex) => (
                            <div key={size.value} className="flex items-center space-x-4">
                                <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700 min-w-[80px]">
                                    {size.value}
                                </span>
                                <div className="flex-1">
                                    <input
                                        type="number"
                                        min="0"
                                        value={size.stock}
                                        onChange={(e) => handleStockChange(size.value, e.target.value)}
                                        placeholder="Stock"
                                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200 py-2 px-4"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveSize(size.value)}
                                    className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 bg-red-100 dark:bg-red-900/20 rounded-xl transition-colors duration-200 hover:bg-red-200 dark:hover:bg-red-900/40"
                                >
                                    <HiX className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            );
        };

        const TailleManager = () => {
            const [availableTailles, setAvailableTailles] = useState(() => {
                const currentTailles = watch(`colors.${index}.tailles`) || [];
                return defaultTailles.filter(taille => !currentTailles.some(t => t.value === taille));
            });

            const handleAddTaille = (e) => {
                const taille = e.target.value;
                if (taille) {
                    const currentTailles = watch(`colors.${index}.tailles`) || [];
                    setValue(`colors.${index}.tailles`, [...currentTailles, { value: taille, stock: 0 }]);
                    setAvailableTailles(availableTailles.filter(t => t !== taille));
                    e.target.value = ''; // Reset select
                }
            };

            const handleRemoveTaille = (tailleValue) => {
                const currentTailles = watch(`colors.${index}.tailles`) || [];
                setValue(
                    `colors.${index}.tailles`,
                    currentTailles.filter(t => t.value !== tailleValue)
                );
                setAvailableTailles([...availableTailles, tailleValue].sort());
            };

            const handleStockChange = (tailleValue, newStock) => {
                const currentTailles = watch(`colors.${index}.tailles`) || [];
                setValue(
                    `colors.${index}.tailles`,
                    currentTailles.map(t => t.value === tailleValue ? { ...t, stock: parseInt(newStock) || 0 } : t)
                );
            };

            return (
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tailles
                    </label>
                    <select
                        onChange={handleAddTaille}
                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200 py-3 px-4"
                        value=""
                    >
                        <option value="">Add a taille</option>
                        {availableTailles.map((taille) => (
                            <option key={taille} value={taille}>{taille}</option>
                        ))}
                    </select>
                    <div className="space-y-3 mt-4">
                        {(watch(`colors.${index}.tailles`) || []).map((taille, tailleIndex) => (
                            <div key={taille.value} className="flex items-center space-x-4">
                                <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700 min-w-[80px]">
                                    {taille.value}
                                </span>
                                <div className="flex-1">
                                    <input
                                        type="number"
                                        min="0"
                                        value={taille.stock}
                                        onChange={(e) => handleStockChange(taille.value, e.target.value)}
                                        placeholder="Stock"
                                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200 py-2 px-4"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTaille(taille.value)}
                                    className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 bg-red-100 dark:bg-red-900/20 rounded-xl transition-colors duration-200 hover:bg-red-200 dark:hover:bg-red-900/40"
                                >
                                    <HiX className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            );
        };

        return (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Color Name (English)
                        </label>
                        <input
                            type="text"
                            placeholder="Black"
                            {...register(`colors.${index}.name.en`, { required: "Color name is required" })}
                            className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200 py-3 px-4"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Color Name (French)
                        </label>
                        <input
                            type="text"
                            placeholder="Noir"
                            {...register(`colors.${index}.name.fr`, { required: "Color name is required" })}
                            className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200 py-3 px-4"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Color Name (Arabic)
                        </label>
                        <input
                            type="text"
                            placeholder="أسود"
                            {...register(`colors.${index}.name.ar`, { required: "Color name is required" })}
                            className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200 py-3 px-4"
                            dir="rtl"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Color Picker
                        </label>
                        <div className="flex items-center space-x-4">
                            <div className="relative flex items-center space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPalette(!showPalette)}
                                    style={{ backgroundColor: colorHex }}
                                    className="h-12 w-24 rounded-xl border-2 border-gray-300 shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center justify-center relative overflow-hidden"
                                >
                                    <span className="sr-only">Select color</span>
                                    <div className="absolute inset-0 bg-white bg-opacity-0 hover:bg-opacity-10 transition-opacity duration-200"></div>
                                </button>
                                <input
                                    type="color"
                                    {...register(`colors.${index}.colorHex`)}
                                    className="h-12 w-16 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 cursor-pointer opacity-0 absolute left-0"
                                    onChange={(e) => {
                                        setValue(`colors.${index}.colorHex`, e.target.value);
                                        setShowPalette(false);
                                    }}
                                />
                                <input
                                    type="text"
                                    value={colorHex}
                                    className="h-12 w-32 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white uppercase"
                                    onChange={(e) => setValue(`colors.${index}.colorHex`, e.target.value)}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeColor(index)}
                                className="p-3 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 bg-red-100 dark:bg-red-900/20 rounded-xl transition-colors duration-200 hover:bg-red-200 dark:hover:bg-red-900/40"
                            >
                                <HiMinus className="h-5 w-5" />
                            </button>
                        </div>

                        {showPalette && (
                            <div className="fixed inset-0 z-10" onClick={() => setShowPalette(false)}>
                                <div
                                    className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700"
                                    onClick={e => e.stopPropagation()}
                                >
                                    <div className="grid grid-cols-5 gap-3 p-2">
                                        {commonColors.map(color => (
                                            <button
                                                key={color}
                                                type="button"
                                                style={{ backgroundColor: color }}
                                                onClick={() => {
                                                    setValue(`colors.${index}.colorHex`, color);
                                                    setShowPalette(false);
                                                }}
                                                className="h-12 w-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform duration-200 shadow-sm hover:shadow-md"
                                            />
                                        ))}
                                    </div>
                                    <button
                                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                        onClick={() => setShowPalette(false)}
                                    >
                                        <HiX className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <SizeManager />
                    <TailleManager />
                </div>
            </div>
        );
    };

    return (
        <div dir='ltr' className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-6 sm:px-10 lg:px-16">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-10">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-10 border-b border-gray-200 dark:border-gray-700 pb-6">Add New Product</h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                        {/* Title in Multiple Languages */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 shadow-md">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Product Title</h3>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Title (English)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter English title"
                                        {...register("title.en", { required: "English title is required" })}
                                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200 py-3 px-4"
                                        dir="ltr"
                                    />
                                    {errors.title?.en && (
                                        <p className="mt-1 text-sm text-red-600">{errors.title.en.message}</p>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Title (French)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter French title"
                                        {...register("title.fr", { required: "French title is required" })}
                                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200 py-3 px-4"
                                        dir="ltr"
                                    />
                                    {errors.title?.fr && (
                                        <p className="mt-1 text-sm text-red-600">{errors.title.fr.message}</p>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Title (Arabic)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="أدخل العنوان بالعربية"
                                        {...register("title.ar", { required: "Arabic title is required" })}
                                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200 py-3 px-4"
                                        dir="rtl"
                                    />
                                    {errors.title?.ar && (
                                        <p className="mt-1 text-sm text-red-600">{errors.title.ar.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Description in Multiple Languages */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 shadow-md">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Product Description</h3>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Description (English)
                                    </label>
                                    <textarea
                                        placeholder="Enter English description"
                                        {...register("description.en")}
                                        rows={5}
                                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200 py-3 px-4"
                                        dir="ltr"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Description (French)
                                    </label>
                                    <textarea
                                        placeholder="Enter French description"
                                        {...register("description.fr")}
                                        rows={5}
                                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200 py-3 px-4"
                                        dir="ltr"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Description (Arabic)
                                    </label>
                                    <textarea
                                        placeholder="أدخل الوصف بالعربية"
                                        {...register("description.ar")}
                                        rows={5}
                                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200 py-3 px-4"
                                        dir="rtl"
                                    />
                                </div>
                                {/* GoogleSheetId */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Google Sheet ID (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter Google Sheet ID"
                                        {...register("googleSheetId")}
                                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200 py-3 px-4"
                                    />
                                </div>
                                {/* GoogleSheetEmail */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Google Sheet Service Account Email
                                    </label>
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="text"
                                            readOnly
                                            value="mohda-311@mohda-440708.iam.gserviceaccount.com"
                                            className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200 py-3 px-4"
                                        />
                                        <button
                                            type="button"
                                            title="Copy Email"
                                            onClick={() => {
                                                navigator.clipboard.writeText("mohda-311@mohda-440708.iam.gserviceaccount.com");
                                                toast.success("Email copied to clipboard");
                                            }}
                                            className="p-2 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-800 transition-colors"
                                        >
                                            <HiPhotograph className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Share your Google Sheet with this email for integration.
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* Basic Information */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 shadow-md">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Product Details</h3>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Category
                                    </label>
                                    <select
                                        {...register("category", { required: "Category is required" })}
                                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200 py-3 px-4"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((category) => (
                                            <option key={category._id} value={category._id}>
                                                {category.name.en}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Base Price
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="text-gray-500 dark:text-gray-400">DH</span>
                                        </div>
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            {...register("basePrice", { required: "Base price is required", min: 0 })}
                                            className="block w-full pl-14 rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200 py-3 px-4"
                                        />
                                    </div>
                                    {errors.basePrice && (
                                        <p className="mt-1 text-sm text-red-600">{errors.basePrice.message}</p>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Price For 2 Items (Optional)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="text-gray-500 dark:text-gray-400">DH</span>
                                        </div>
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            {...register("priceFor2", { min: 0 })}
                                            className="block w-full pl-14 rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200 py-3 px-4"
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Special price when buying 2 items
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Price For 3 Items (Optional)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="text-gray-500 dark:text-gray-400">DH</span>
                                        </div>
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            {...register("priceFor3", { min: 0 })}
                                            className="block w-full pl-14 rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200 py-3 px-4"
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Special price when buying 3 items
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Discount (%)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="0"
                                            {...register("discount", { min: 0, max: 100 })}
                                            className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200 py-3 px-4"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                            <span className="text-gray-500 dark:text-gray-400">%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Product Status
                                    </label>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setValue('active', !watch('active'))}
                                            className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${watch('active') ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'
                                                }`}
                                            role="switch"
                                            aria-checked={watch('active')}
                                        >
                                            <span
                                                aria-hidden="true"
                                                className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${watch('active') ? 'translate-x-6' : 'translate-x-0'
                                                    }`}
                                            />
                                        </button>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {watch('active') ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Toggle to set product visibility in store
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Colors and Images */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 shadow-md">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Colors, Sizes and Images</h3>
                            {colorFields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="flex flex-col space-y-8 p-8 mb-8 border-2 rounded-2xl dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg"
                                >
                                    <ColorPicker index={index} />

                                    <div className="mt-4">
                                        <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">Product Images</h4>
                                        <ImageDropzone index={index} />
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => appendColor({
                                    name: { en: '', fr: '', ar: '' },
                                    colorHex: '#000000',
                                    images: [],
                                    sizes: [],
                                    tailles: []
                                })}
                                className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all duration-300 transform hover:scale-105"
                            >
                                <HiPlus className="-ml-1 mr-3 h-5 w-5" />
                                Add Another Color
                            </button>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-8">
                            <button
                                type="submit"
                                className="inline-flex justify-center py-4 px-10 border border-transparent shadow-xl text-lg font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all duration-300 transform hover:scale-105"
                            >
                                Add Product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddProduct