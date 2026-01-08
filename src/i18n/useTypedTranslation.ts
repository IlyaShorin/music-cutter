import { useTranslation as useI18n } from 'react-i18next'

export function useTypedTranslation() {
    const { t, ...rest } = useI18n()

    return {
        t,
        ...rest,
    }
}
