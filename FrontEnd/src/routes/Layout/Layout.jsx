import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import HeaderContent from '../../components/Shared Components/Header/HeaderContent'
import FooterContainer from '../../components/Shared Components/Footer/FooterContainer'
import { LanguageContext } from '../../context/language'
import { actGetAllCategory } from '../../Features/Category/CategoryAction'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function Layout() {
    const { language } = useContext(LanguageContext)
    const dispatch = useDispatch()
    const location = useLocation()
    useEffect(() => {
        dispatch(actGetAllCategory())
    }, [dispatch])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [location.pathname])
    return (
        <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <HeaderContent />
            <Outlet />
            <FooterContainer />
        </div>
    )
}

export default Layout