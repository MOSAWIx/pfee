import React from 'react'
import SocialMedia from '../Social Media/SocialMedia'
import { useTranslation } from 'react-i18next'


function DiscountHeader() {
    const { t } = useTranslation()



    return (
        <div className="DiscountHeader bg-black">
            <div className="container flex justify-center sm:justify-between items-center">
                <SocialMedia className={"fill-white hover:opacity-80 duration-300"} />
                <p className='text-sm text-white my-3 font-normal text-center'>
                    {t("DiscountHeader.title")}
                </p>
                <span></span>
            </div>
        </div>
    )
}

export default DiscountHeader