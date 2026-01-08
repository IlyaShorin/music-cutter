import { Box, Text, Button, VStack, Progress, Dialog } from '@chakra-ui/react';

interface FfmpegInstallDialogProps {
    open: boolean;
    onClose: () => void;
    onInstall: () => void;
    isDownloading?: boolean;
    downloadProgress?: number;
    error?: string;
}

export function FfmpegInstallDialog({ open, onClose, onInstall, isDownloading, downloadProgress, error }: FfmpegInstallDialogProps) {
    return (
        <Dialog.Root open={open} onOpenChange={({ open }) => !open && onClose()}>
            <Dialog.Content>
                <Dialog.Title>FFmpeg Required</Dialog.Title>
                <Dialog.Body>
                    <VStack gap={4} align="stretch">
                        <Text>
                            FFmpeg is not installed on your system. This app requires FFmpeg to cut audio files.
                        </Text>
                        <Text fontSize="sm" color="fg.muted">
                            You can install FFmpeg manually or download it automatically.
                        </Text>
                        {isDownloading && (
                            <Box>
                                <Text fontSize="sm" mb={2}>Downloading... {downloadProgress}%</Text>
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
                        Cancel
                    </Button>
                    <Button
                        colorPalette="blue"
                        onClick={onInstall}
                        disabled={isDownloading}
                    >
                        {isDownloading ? 'Downloading...' : 'Download FFmpeg'}
                    </Button>
                </Dialog.Footer>
            </Dialog.Content>
        </Dialog.Root>
    );
}
