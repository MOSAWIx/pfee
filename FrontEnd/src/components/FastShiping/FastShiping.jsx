import React from 'react'
import { FastShiping as FastShipingImage } from '../../assets/images/images'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

function FastShiping() {
    const { t } = useTranslation()
    return (
        <motion.div 
            className='md:py-8 '
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <motion.div 
                className='bg-gradient-to-b from-[#F5F8F9] to-white rounded-3xl p-4 flex flex-col items-center text-center transition-all duration-500'
                transition={{ duration: 0.4 }}
            >
                <motion.div
                    className="space-y-3 mb-4"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.h3 
                        className='text-xl md:text-2xl font-bold text-gray-800 mb-2'
                        transition={{ duration: 0.2 }}
                    >
                        {t("FastShipingTitle")}
                    </motion.h3>
                    <motion.div 
                        className='h-1 w-16 bg-blue-500 mx-auto rounded-full'
                        initial={{ width: 0 }}
                        whileInView={{ width: 64 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    />
                </motion.div>
                
                <motion.div 
                    className='relative w-full md:max-w-[70%] mx-auto'
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                        duration: 0.7,
                        delay: 0.3,
                        ease: [0.23, 1, 0.32, 1]
                    }}
                >
                    <motion.div
                        className='relative overflow-hidden'
                    >
                        <motion.img 
                            src={FastShipingImage} 
                            alt="Fast Shipping" 
                            className='w-full h-auto object-contain min-h-[120px]'
                            
                        />
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}

export default FastShiping