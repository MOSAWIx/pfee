import React from 'react'
import BannerCard from './BannerCard'
import { BannerFooterData } from '../../../../Data/BannerFooterData'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

function BannerFooter() {
    const { t } = useTranslation()
    return (
        <motion.div
            className="bannerFooter py-5 bg-[#f5f8f9] mt-section-padding"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <div className="container grid gap-4 grid-cols-2 lg:grid-cols-4">
                {/* BannerFooter */}
                {BannerFooterData.map((BannerCardData) => {
                    return <BannerCard key={BannerCardData.id} BannerCardData={BannerCardData} />
                })}
            </div>
        </motion.div>
    )
}

export default BannerFooter