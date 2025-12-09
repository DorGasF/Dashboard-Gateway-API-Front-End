import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import pt_br from './lang/pt-br.json'
import en from './lang/en.json'
import appConfig from '@/configs/app.config'

const resources = {
    pt_br: {
        translation: pt_br,
    },
    en: {
        translation: en,
    },
}

i18n.use(initReactI18next).init({
    resources,
    fallbackLng: appConfig.locale,
    lng: appConfig.locale,
    interpolation: {
        escapeValue: false,
    },
})

export const dateLocales: {
    [key: string]: () => Promise<ILocale>
} = {
    pt_br: () => import('dayjs/locale/pt-br'),
    en: () => import('dayjs/locale/en'),
}

export default i18n
