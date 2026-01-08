import { VStack, Text } from '@chakra-ui/react';
import { useTypedTranslation } from '@/i18n';

export function AudioCutterHeader() {
    const { t } = useTypedTranslation();

    return (
        <VStack gap={1} textAlign="center">
            <Text fontSize="lg" fontWeight="semibold" color="fg.default">
                {t('audioCutter.title')}
            </Text>
            <Text fontSize="sm" color="fg.muted">
                {t('audioCutter.subtitle')}
            </Text>
        </VStack>
    );
}
