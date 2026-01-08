import { Button, Flex } from '@chakra-ui/react';
import { LuGlobe } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { setLanguage } from '@/i18n';

export function LanguageToggle() {
    const { i18n, t } = useTranslation();
    const currentLang = i18n.language as 'en' | 'ru';

    const toggleLanguage = () => {
        const newLang = currentLang === 'en' ? 'ru' : 'en';
        setLanguage(newLang);
    };

    return (
        <Button
            aria-label={t('languageToggle.ariaLabel')}
            onClick={toggleLanguage}
            variant="ghost"
            size="sm"
            colorPalette="gray"
        >
            <Flex gap="1" align="center">
                <LuGlobe />
                {currentLang.toUpperCase()}
            </Flex>
        </Button>
    );
}
