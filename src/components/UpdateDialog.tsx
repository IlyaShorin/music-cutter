import { Box, Text, Button, VStack, Progress, Dialog } from '@chakra-ui/react';
import { useTypedTranslation } from '@/i18n';
import type { UpdateInfo } from '@/api/updater';

interface UpdateDialogProps {
    open: boolean;
    onClose: () => void;
    onUpdate: () => void;
    updateInfo: UpdateInfo | null;
    isDownloading?: boolean;
    downloadProgress?: { downloaded: number; total: number };
    error?: string;
}

export function UpdateDialog({
    open,
    onClose,
    onUpdate,
    updateInfo,
    isDownloading,
    downloadProgress,
    error,
}: UpdateDialogProps) {
    const { t } = useTypedTranslation();

    const progressPercent = downloadProgress && downloadProgress.total > 0
        ? Math.round((downloadProgress.downloaded / downloadProgress.total) * 100)
        : 0;

    return (
        <Dialog.Root open={open} closeOnInteractOutside={false}>
            <Dialog.Content>
                <Dialog.Header p={4}>
                    <Dialog.Title>{t('updater.title')}</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                    <VStack gap={4} align="stretch">
                        <Text>
                            {t('updater.newVersionAvailable', { version: updateInfo?.version })}
                        </Text>
                        {updateInfo?.body && (
                            <Box
                                p={3}
                                bg="bg.subtle"
                                borderRadius="md"
                                maxH="200px"
                                overflowY="auto"
                            >
                                <Text fontSize="sm" whiteSpace="pre-wrap">
                                    {updateInfo.body}
                                </Text>
                            </Box>
                        )}
                        {isDownloading && downloadProgress && (
                            <Box>
                                <Text fontSize="sm" mb={2}>
                                    {t('updater.downloading', { progress: progressPercent })}
                                </Text>
                                <Progress.Root value={progressPercent}>
                                    <Progress.Track>
                                        <Progress.Range />
                                    </Progress.Track>
                                </Progress.Root>
                                <Text fontSize="xs" color="fg.muted" mt={1}>
                                    {t('updater.downloadSize', {
                                        current: formatBytes(downloadProgress.downloaded),
                                        total: formatBytes(downloadProgress.total),
                                    })}
                                </Text>
                            </Box>
                        )}
                        {error && (
                            <Text color="colorPalette.error" fontSize="sm">
                                {t('updater.error', { error })}
                            </Text>
                        )}
                    </VStack>
                </Dialog.Body>
                <Dialog.Footer>
                    <Button variant="ghost" onClick={onClose} disabled={isDownloading}>
                        {t('updater.skip')}
                    </Button>
                    <Button
                        colorPalette="blue"
                        onClick={onUpdate}
                        disabled={isDownloading}
                    >
                        {isDownloading
                            ? t('updater.downloading', { progress: progressPercent })
                            : t('updater.update')}
                    </Button>
                </Dialog.Footer>
            </Dialog.Content>
        </Dialog.Root>
    );
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
