import { useEffect, useState } from 'react';
import { Box, Flex, Tabs, TabsList, TabsTrigger, TabsContent } from '@chakra-ui/react';
import { FFmpegProvider, useFFmpeg } from './contexts/FFmpegContext';
import { FfmpegInstallDialog } from './components/FfmpegInstallDialog';
import { LanguageToggle } from './components/LanguageToggle';
import { ThemeToggle } from './components/ThemeToggle';
import { AudioCutter } from './features/audioCutter/AudioCutter';
import { BatchCutter } from './features/batchCutter/BatchCutter';
import { useTypedTranslation } from '@/i18n';

function AppContent() {
    const { t } = useTypedTranslation();
    const { status, isLoading, check, download, isDownloading, downloadProgress } = useFFmpeg();
    const [showInstallDialog, setShowInstallDialog] = useState(false);
    const [hasCheckedOnMount, setHasCheckedOnMount] = useState(false);
    const [error, setError] = useState<string>();

    useEffect(() => {
        let cancelled = false;
        check().then(() => {
            if (!cancelled) setHasCheckedOnMount(true);
        });
        return () => { cancelled = true; };
    }, [check]);

    useEffect(() => {
        if (!hasCheckedOnMount) return;

        const shouldShowDialog = !status || !status.installed;
        setShowInstallDialog(shouldShowDialog);
    }, [status, hasCheckedOnMount]);

    const handleInstall = async () => {
        setError(undefined);
        try {
            await download();
            setShowInstallDialog(false);
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        }
    };

    const handleCloseDialog = () => setShowInstallDialog(false);

    if (isLoading && !hasCheckedOnMount) {
        return <Box py={10} px={20}>Loading...</Box>;
    }

    return (
        <Box py={10} px={20}>
            <Flex justify="end" mb={2} gap={2}>
                <LanguageToggle />
                <ThemeToggle />
            </Flex>
            <FfmpegInstallDialog
                open={showInstallDialog}
                onClose={handleCloseDialog}
                onInstall={handleInstall}
                isDownloading={isDownloading}
                downloadProgress={downloadProgress}
                error={error}
            />
            <Tabs.Root defaultValue="single" variant="enclosed" width="100%">
                <TabsList pb={0}>
                    <TabsTrigger value="single">{t('tabs.singleCut')}</TabsTrigger>
                    <TabsTrigger value="batch">{t('tabs.batch')}</TabsTrigger>
                </TabsList>
                <TabsContent value="single" p={0}>
                    <AudioCutter />
                </TabsContent>
                <TabsContent value="batch" p={0}>
                    <BatchCutter />
                </TabsContent>
            </Tabs.Root>
        </Box>
    );
}

function App() {
    return (
        <FFmpegProvider>
            <AppContent />
        </FFmpegProvider>
    );
}

export default App;
