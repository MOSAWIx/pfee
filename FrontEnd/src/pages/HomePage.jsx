import React from 'react'
import HeroSection from '../components/HeroSection/HeroSection'
import CollectionComponent from '../components/Shared Components/CollectionComponents/CollectionComponent'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Infinity from '../components//InfinityLogos/Infinity'
import FastShiping from '../components/FastShiping/FastShiping'
import { useDispatch, useSelector } from 'react-redux'
import { getCollections } from '../Features/Collection/CollectionAction'
import CollectionSkeleton from '../components/ui/Skeleton/CollectionSkeleton'



function HomePage() {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    
    const collections = useSelector((state) => state.root.collections.items || []);
    const loading = useSelector(state => state.root.collections.loading);
    
    const BestSeller = collections.bestSelling || [];
    const NewArrivals = collections.newArrivals || [];

    useEffect(() => {
        dispatch(getCollections())
    }, [dispatch])

    return (
        <>


            <HeroSection />
            {/* best sellers */}
            <div className='container mt-section-padding'>
                {loading ? (
                    <CollectionSkeleton />
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        viewport={{ once: true, amount: 0.2 }}
                        className='w-full'
                    >
                        <CollectionComponent title={t("collection.bestSellers")} products={BestSeller} />
                    </motion.div>
                )}
            </div>
            {/* new arrivals */}
            <div className='container mt-section-padding'>
                {loading ? (
                    <CollectionSkeleton />
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        viewport={{ once: true, amount: 0.2 }}
                        className='w-full'
                    >
                        <CollectionComponent title={t("collection.newArrivals")} products={NewArrivals} />
                    </motion.div>
                )}

            </div>
            <div className=' mt-section-padding'>
                <Infinity />
            </div>
            {/* fast shipping */}
            <div className='container mt-section-padding'>
                <FastShiping />
            </div>
        </>
    )
}

export default HomePage