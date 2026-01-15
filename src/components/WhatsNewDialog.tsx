import { Box, Text, Button, VStack, Dialog } from '@chakra-ui/react';
import { useTypedTranslation } from '@/i18n';

interface WhatsNewDialogProps {
    open: boolean;
    onClose: () => void;
    version: string;
    releaseNotes: string;
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
                                {releaseNotes || t('whatsNew.noNotes')}
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
