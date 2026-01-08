import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ThemeProvider } from 'next-themes';
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>
        <ThemeProvider attribute="class" storageKey="music-cutter-theme" defaultTheme="light">
            <ChakraProvider value={defaultSystem}>
                <App />
            </ChakraProvider>
        </ThemeProvider>
    </StrictMode>,
);
