import React from 'react'
import { useTranslation } from 'react-i18next';

function Orders() {
    const { t } = useTranslation();
    return (
        <div className="Orders px-0 sm:px-5">
            <h2 className='text-lg font-bold mb-5'>{t('footer.quick_links')}</h2>
            <ul>
                <li className='group text-[15px] font-normal mb-1'>
                    <a href="" className='group-hover:underline'>{t('footer.home')}</a>
                </li>
                <li className='group text-[15px] font-normal mb-1'>
                    <a href="" className='group-hover:underline'>{t('footer.products')}</a>
                </li>
                <li className='group text-[15px] font-normal'>
                    <a href="" className='group-hover:underline'>{t('footer.contact_us')}</a>
                </li>
            </ul>



        </div>
    )
}

export default Orders