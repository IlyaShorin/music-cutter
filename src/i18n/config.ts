import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { en, ru } from '@/locales'

const STORAGE_KEY = 'music-cutter-language'

const savedLanguage = localStorage.getItem(STORAGE_KEY) as 'en' | 'ru' | null

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        ru: { translation: ru },
    },
    lng: savedLanguage || 'en',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
})

export const setLanguage = (lang: 'en' | 'ru') => {
    i18n.changeLanguage(lang)
    localStorage.setItem(STORAGE_KEY, lang)
}

export const getLanguage = (): 'en' | 'ru' => {
    return i18n.language as 'en' | 'ru'
}

export default i18n
