import React from 'react'
import { GrPrevious} from "react-icons/gr";

function NavigationBtns({next,prev}) {
    return (
        <>
        <div className="group hidden sm:block next-swiper absolute top-1/2 right-0 transform -translate-y-1/2 z-50 cursor-pointer"
        onClick={next}
        >
            <GrPrevious className='text-[40px] origin-center rotate-180 text-white opacity-65 group-hover:opacity-100 duration-300'  />
        </div>
        <div className="group hidden sm:block prev-swiper absolute top-1/2 left-0 transform -translate-y-1/2 z-50 cursor-pointer"
        onClick={prev}
        >
            <GrPrevious className='text-[40px] text-white opacity-65 group-hover:opacity-100 duration-300'  />
        </div>
        </>
    )
}

export default NavigationBtns