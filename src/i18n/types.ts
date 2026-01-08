import type { Translations } from '@/locales'

export type { Translations }

declare module 'i18next' {
    interface CustomTypeOptions {
        resources: {
            translation: Translations
        }
    }
}
