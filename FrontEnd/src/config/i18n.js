import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import en from '../../public/locales/en/en.json';
import ar from '../../public/locales/ar/ar.json';
import fr from '../../public/locales/fr/fr.json';

i18n.use(initReactI18next).init({
    lng: 'en', // default language
    fallbackLng: 'en', // fallback language
    supportedLngs: ['en', 'ar', 'fr'],

    resources: {
        en: {
            translation: en
        },
        ar: {
            translation: ar
        },
        fr: {
            translation: fr
        }
    },

    interpolation: {
        escapeValue: false // React already escapes values
    },

    // Handle RTL languages
    react: {
        useSuspense: true
    }
});

export default i18n;
