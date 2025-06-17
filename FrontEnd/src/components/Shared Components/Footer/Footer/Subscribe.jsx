import React from 'react'
import { useTranslation } from 'react-i18next'

function Subscribe() {
    const { t } = useTranslation();
    return (
        <div className="Subscribe_us px-0 sm:px-5">
            <h2 className='mb-[10px] sm:mb-5 text-lg font-bold'>{t('footer.subscribe')}</h2>
            <p className='mb-[30px] text-[15px] font-normal'>{t('footer.subscribe_description')}</p>
            <form className='flex flex-col gap-4'>
                <input className='px-4 py-[13px] rounded-[3px] border border-[rgb(204,204,204)] text-[rgb(51,51,51)] font-normal text-[16px] max-w-full placeholder:text-black ' type="email" placeholder={t('footer.email')}/>
                <button className='px-6 py-4 border-black rounded-[3px]  font-normal text-white bg-black w-fit appearance-none hover:opacity-80 duration-300  '>{t('footer.subscribe')}</button>
            </form>
        </div>
    )
}

export default Subscribe