import { IconButton } from '@chakra-ui/react';
import { LuMoon, LuSun } from 'react-icons/lu';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <IconButton
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            variant="ghost"
            size="sm"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            colorPalette="gray"
        >
            {isDark ? <LuSun /> : <LuMoon />}
        </IconButton>
    );
}
