import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from '../../context/language'

function SwitchLanguage() {
    const { t } = useTranslation()
    const { language, setLanguage } = useContext(LanguageContext)
    const [isOpen, setIsOpen] = useState(false)

    const languages = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'ar', name: 'العربية', flag: '🇸🇦' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' }
    ]

    const getCurrentLanguage = () => {
        return languages.find(lang => lang.code === language) || languages[0]
    }

    return (
        <div className="relative z-[999999]">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-black transition-colors"
            >
                <span>{getCurrentLanguage().flag}</span>
                <span className=''>{getCurrentLanguage().name}</span>
                <svg 
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className={`absolute top-full  mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[150px] ${getCurrentLanguage().code === 'ar' ? 'left-0' : 'right-0'}`}>
                    {languages
                        .filter(lang => lang.code !== language)
                        .map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    setLanguage(lang.code)
                                    setIsOpen(false)
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors"
                            >
                                <span>{lang.flag}</span>
                                <span>{lang.name}</span>
                            </button>
                        ))
                    }
                </div>
            )}
        </div>
    )
}

export default SwitchLanguage