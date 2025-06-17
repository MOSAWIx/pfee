import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

function BannerCard({ BannerCardData }) {
    const { t } = useTranslation()
    return (
        <motion.div
            className="BannerCard flex flex-col items-center mb-5 sm:mb-0"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <div className="icon mb-1">
                {BannerCardData.icon}
            </div>
            <h4 className='text-base sm:text-lg font-bold text-center'>
                {t(`BannerFooter.card${BannerCardData.id}.title`)}
            </h4>
            <p className='text-[15px] font-normal text-center'>
                {t(`BannerFooter.card${BannerCardData.id}.description`)}
            </p>
        </motion.div>
    )
}

export default BannerCard