import React from 'react'
import Subscribe from './Subscribe'
import Help_Us from './Help_Us'
import Orders from './Orders'
import InformationAboutUs from './InformationAboutUs'

function Footer() {
    return (
        <footer className='Footer py-10 sm:py-16 bg-[#dfe3e8]'>
            <div className="container grid grid-cols-1 md:grid-cols-4 gap-5">
                <Subscribe />
                <Help_Us />
                <Orders />
                <InformationAboutUs />
            </div>

        </footer>
    )
}

export default Footer