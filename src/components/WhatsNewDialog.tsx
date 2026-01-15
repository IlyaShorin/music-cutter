import { Box, Text, Button, VStack, Dialog } from '@chakra-ui/react';
import { useTypedTranslation } from '@/i18n';

interface WhatsNewDialogProps {
    open: boolean;
    onClose: () => void;
    version: string;
    releaseNotes: string;
}

function formatReleaseNotes(notes: string): string {
    if (!notes) return '';

    let formatted = notes;

    formatted = formatted.replace(/##\s+\[?\d+\.\d+\.\d+\]?.*?\n+/g, '');
    formatted = formatted.replace(/###\s+[^\n]+\n*/g, '');
    formatted = formatted.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    formatted = formatted.replace(/`([^`]+)`/g, '$1');
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '$1');
    formatted = formatted.replace(/^\*\s+/gm, '• ');
    formatted = formatted.replace(/\s*\([a-f0-9]{7}\)\s*$/gm, '');
    formatted = formatted.replace(/\n{3,}/g, '\n\n');

    return formatted.trim();
}

export function WhatsNewDialog({ open, onClose, version, releaseNotes }: WhatsNewDialogProps) {
    const { t } = useTypedTranslation();

    return (
        <Dialog.Root open={open} onOpenChange={({ open }) => !open && onClose()}>
            <Dialog.Content>
                <Dialog.Header p={4}>
                    <Dialog.Title>{t('whatsNew.title', { version })}</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                    <VStack gap={4} align="stretch">
                        <Text>{t('whatsNew.subtitle')}</Text>
                        <Box
                            p={4}
                            bg="bg.subtle"
                            borderRadius="md"
                            maxH="300px"
                            overflowY="auto"
                        >
                            <Text fontSize="sm" whiteSpace="pre-wrap">
                                {releaseNotes ? formatReleaseNotes(releaseNotes) : t('whatsNew.noNotes')}
                            </Text>
                        </Box>
                    </VStack>
                </Dialog.Body>
                <Dialog.Footer>
                    <Button
                        colorPalette="blue"
                        onClick={onClose}
                    >
                        {t('whatsNew.close')}
                    </Button>
                </Dialog.Footer>
            </Dialog.Content>
        </Dialog.Root>
    );
}
