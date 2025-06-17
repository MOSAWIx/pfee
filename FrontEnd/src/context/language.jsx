import React, { createContext, useState, useEffect } from "react";
import i18n from "../config/i18n";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem("lang") || "en");

    useEffect(() => {
        i18n.changeLanguage(language);
        document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
        localStorage.setItem("lang", language);
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};