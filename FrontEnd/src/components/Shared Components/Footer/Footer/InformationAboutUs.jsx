import React from 'react'
import { useTranslation } from 'react-i18next'

function InformationAboutUs() {
    const { t } = useTranslation()
    return (
        <div className="InformationAboutUs px-0 sm:px-5">

            <h2 className='text-lg font-bold mb-5'>{t('footer.information_about_us')}</h2>
            <ul>
                <li className='group text-[15px] font-normal mb-1'>
                    <a href="" className='group-hover:underline'>{t('footer.about_us')}</a>
                </li>
                <li className='group text-[15px] font-normal mb-1'>
                    <a href="" className='group-hover:underline'>{t('footer.faq')}</a>
                </li>
                <li className='group text-[15px] font-normal mb-1'>
                    <a href="" className='group-hover:underline'>{t('footer.return_policy')}</a>
                </li>
                <li className='group text-[15px] font-normal mb-1'>
                    <a href="" className='group-hover:underline'>{t('footer.privacy_policy')}</a>
                </li >
            </ul>

        </div>
    )
}

export default InformationAboutUs