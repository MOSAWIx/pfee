import React from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa6';


function Tab({TabOpen, setTabOpen}) {


    return (
        <div className="Description_product">
            <div
                onClick={() => setTabOpen()}
                className={`Description_Tab flex items-center justify-between py-[14px] relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] ${TabOpen ? 'after:bg-black' : 'after:bg-[#71717A]'
                    }`}
            >
                <span className={`block text-sm ${TabOpen ? 'text-black' : 'text-[#71717A]'}`}>
                    التوصيل و الإرجاع

                </span>
                <span className="block">
                    {TabOpen ? (
                        <FaMinus className={`size-[12px] ${TabOpen ? 'text-black' : 'text-[#71717A]'}`} />
                    ) : (
                        <FaPlus className={`size-[12px]  ${TabOpen ? 'text-black' : 'text-[#71717A]'}`} />
                    )}
                </span>
            </div>
            <div
                className={`Description_Detail overflow-hidden transition-all duration-300 ease-in-out ${TabOpen ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0'
                    }`}
            >
                <div className="font-base font-normal text-[rgb(51,51,51)] mt-6 mb-10">
                    <strong className='block text-base text-[rgb(51,51,51)] mb-[14px]'>الرياض:</strong>
                    <span className='block font-base mb-[14px]'>
                    التوصيل خلال 48 ساعة
                    <br />
                    <br />
                    </span>
                    <strong className='block text-base text-[rgb(51,51,51)] mb-[14px]'>باقي المدن:</strong>
                    <p className='text-base font-normal text-[rgb(51,51,51)]'>
                        التوصيل خلال 3-5 أيام عمل
                        <br />
                        <br />
                        ارجاع مجاني للمنتجات خلال 3 أيام من تاريخ الشراء*
                        <br />
                        <br />
                        *يرجي مراجعة سياسة الاسترجاع لمزيد من التفاصيل

                    </p>

                </div>
            </div>
        </div>
    );
}

export default Tab;