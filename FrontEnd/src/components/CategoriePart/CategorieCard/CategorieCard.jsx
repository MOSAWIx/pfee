import React from 'react'

function CategorieCard({image="https://fashion.sa/cdn/shop/files/app_en_copy_6-03.jpg?v=1739224039&width=480"}) {
    return (
        <div className='Categorie-Card relative after:absolute after:inset-0 after:bg-[rgba(0,0,0,0.12)] after:z-10 cursor-pointer '>
            
                <img
                    src={image}
                    alt='Categorie-Card-Image'
                    className='w-full h-full object-cover'/>
        </div>
    )
}

export default CategorieCard