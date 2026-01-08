import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ThemeProvider } from 'next-themes';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>
        <I18nextProvider i18n={i18n}>
            <ThemeProvider attribute="class" storageKey="music-cutter-theme" defaultTheme="light">
                <ChakraProvider value={defaultSystem}>
                    <App />
                </ChakraProvider>
            </ThemeProvider>
        </I18nextProvider>
    </StrictMode>,
);
