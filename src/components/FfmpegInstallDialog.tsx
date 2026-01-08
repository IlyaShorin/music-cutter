import { Box, Text, Button, VStack, Progress, Dialog } from '@chakra-ui/react';
import { useTypedTranslation } from '@/i18n';

interface FfmpegInstallDialogProps {
    open: boolean;
    onClose: () => void;
    onInstall: () => void;
    isDownloading?: boolean;
    downloadProgress?: number;
    error?: string;
}

export function FfmpegInstallDialog({ open, onClose, onInstall, isDownloading, downloadProgress, error }: FfmpegInstallDialogProps) {
    const { t } = useTypedTranslation();

    return (
        <Dialog.Root open={open} onOpenChange={({ open }) => !open && onClose()}>
            <Dialog.Content>
                <Dialog.Header p={4}>
                    <Dialog.Title>{t('ffmpeg.title')}</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                    <VStack gap={4} align="stretch">
                        <Text>
                            {t('ffmpeg.message')}
                        </Text>
                        <Text fontSize="sm" color="fg.muted">
                            {t('ffmpeg.help')}
                        </Text>
                        {isDownloading && (
                            <Box>
                                <Text fontSize="sm" mb={2}>
                                    {t('ffmpeg.downloading', { progress: downloadProgress ?? 0 })}
                                </Text>
                                <Progress.Root value={downloadProgress}>
                                    <Progress.Track>
                                        <Progress.Range />
                                    </Progress.Track>
                                </Progress.Root>
                            </Box>
                        )}
                        {error && (
                            <Text color="colorPalette.error" fontSize="sm">{error}</Text>
                        )}
                    </VStack>
                </Dialog.Body>
                <Dialog.Footer>
                    <Button variant="ghost" onClick={onClose} disabled={isDownloading}>
                        {t('ffmpeg.cancel')}
                    </Button>
                    <Button
                        colorPalette="blue"
                        onClick={onInstall}
                        disabled={isDownloading}
                    >
                        {isDownloading ? t('ffmpeg.downloading', { progress: downloadProgress ?? 0 }) : t('ffmpeg.downloadButton')}
                    </Button>
                </Dialog.Footer>
            </Dialog.Content>
        </Dialog.Root>
    );
}
