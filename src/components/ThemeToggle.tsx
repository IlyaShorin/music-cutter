import { IconButton } from '@chakra-ui/react';
import { LuMoon, LuSun } from 'react-icons/lu';
import { useTheme } from 'next-themes';
import { useTypedTranslation } from '@/i18n';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const { t } = useTypedTranslation();
    const isDark = theme === 'dark';

    return (
        <IconButton
            aria-label={isDark ? t('themeToggle.ariaLabelLight') : t('themeToggle.ariaLabelDark')}
            variant="ghost"
            size="sm"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            colorPalette="gray"
        >
            {isDark ? <LuSun /> : <LuMoon />}
        </IconButton>
    );
}
