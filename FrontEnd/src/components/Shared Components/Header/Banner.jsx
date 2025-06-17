import React from 'react'
import { useTranslation } from 'react-i18next'

function Banner() {
    const { t } = useTranslation()
    return (
        <div className="banner bg-[#dfe3e8]">
            <div className="container flex items-center justify-center sm:justify-between text-xs text-black ">
                <p className='py-3 hidden sm:block'>{t("Banner.title")}</p>
                <p className='py-3 hidden sm:block'>{t("Banner.description")}</p>
                <p className='py-3'>{t("Banner.button")}</p>
            </div>
        </div>
    )
}

export default Banner