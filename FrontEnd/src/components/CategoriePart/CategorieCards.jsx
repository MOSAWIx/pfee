import React from 'react'
import CategorieCard from './CategorieCard/CategorieCard'

function CategorieCards() {
    return (
        <div className='Categorie-Cards grid grid-cols-2  md:grid-cols-4 gap-5 '>
            {Array(4).fill().map((_, i) => (
                <CategorieCard key={i}/>
            ))}
        </div>
    )
}

export default CategorieCards