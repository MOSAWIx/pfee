import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../context/language';
import { useContext } from 'react';


function OrderSuccess() {
    const { t } = useTranslation();
    const { language } = useContext(LanguageContext);
    const navigate = useNavigate();




    return (
        <div className="bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4 py-24">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.2
                    }}
                    className="flex justify-center mb-6"
                >
                    <CheckCircle2 className="w-24 h-24 text-green-500" />
                </motion.div>

                <motion.h1 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl font-bold text-gray-800 mb-4"
                >
                    {t('order_success.order_successful')}
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-gray-600 mb-8"
                >
                    {t('order_success.thank_you_for_your_purchase')}
                </motion.p>

                <div className="relative">
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-medium hover:bg-green-600 transition-colors"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        {t('order_success.continue_shopping')}
                    </motion.button>

                    
                </div>
            </motion.div>
        </div>
    );
}

export default OrderSuccess;
