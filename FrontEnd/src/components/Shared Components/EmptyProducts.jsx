import { IoStorefrontOutline, IoSearchOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import React from "react";

export const EmptyState = ({ setShowMobileFilter }) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <IoStorefrontOutline size={40} className="text-gray-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                    <IoSearchOutline size={16} className="text-blue-500" />
                </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
                {t('emptyProducts.title')}
            </h2>
            
            <p className="text-gray-500 text-lg mb-6 max-w-md leading-relaxed">
                {t("emptyProducts.description")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
                <button 
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
                    onClick={() => window.location.reload()}
                >
                    {t('emptyProducts.refreshPage')}
                </button>
                <button 
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                    onClick={() => setShowMobileFilter(true)}
                >
                    {t('emptyProducts.tryDifferentFilters')}
                </button>
            </div>
            
            <div className="mt-8 text-sm text-gray-400">
                <p>{t('emptyProducts.contactSupport')}</p>
            </div>
        </div>
    );
};