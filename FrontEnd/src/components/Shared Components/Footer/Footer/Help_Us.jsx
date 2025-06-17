import React from 'react'
import SocialMedia from "../../Header/Social Media/SocialMedia"
import { useTranslation } from 'react-i18next';

const Number=import.meta.env.VITE_NUMBER;
const gmail=import.meta.env.VITE_GMAIL;

function Help_Us() {
    const { t } = useTranslation();
    return (
        <div className="Help_Us px-0 sm:px-5">
            {/* title */}
            <h2 className='text-lg font-bold mb-5'>{t('footer.help_us')}</h2>
            <p className='text-[15px] font-normal mb-[15px]'>{t('footer.help_us_description')}</p>
            {/* extra Detail */}
            <span className='block text-[15px] font-normal'>{t('footer.email_adresse')}:<a href={`mailto:${gmail}`}>{gmail}</a></span>
            <span className='block text-[15px] font-normal mb-[15px]'>{t('footer.phone')}<a href={`tel:${Number}`}>212{Number}</a></span>
            {/* Social media component */}
            <SocialMedia className={"fill-black hover:opacity-80 duration-300"}/>
        </div>
    )
}

export default Help_Us