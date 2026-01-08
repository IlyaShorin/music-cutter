import { Box, Input, Text } from '@chakra-ui/react';
import { Button } from './ui/Button';
import { useTypedTranslation } from '@/i18n';

interface FileSelectorProps {
    filePath: string;
    onSelect: () => void;
    disabled?: boolean;
}

export function FileSelector({ filePath, onSelect, disabled }: FileSelectorProps) {
    const { t } = useTypedTranslation();

    return (
        <Box>
            <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb={2}>
                {t('audioCutter.audioFile')}
            </Text>
            <Box display="flex" gap={2}>
                <Input
                    value={filePath}
                    placeholder={t('common.noFileSelected')}
                    readOnly
                    bg="bg.subtle"
                    flex={1}
                />
                <Button onClick={onSelect} disabled={disabled} colorPalette="blue">
                    {t('common.browse')}
                </Button>
            </Box>
        </Box>
    );
}
