import { VStack, Text } from '@chakra-ui/react';
import { useTypedTranslation } from '@/i18n';

export function BatchCutterHeader() {
    const { t } = useTypedTranslation();

    return (
        <VStack gap={1} textAlign="center">
            <Text fontSize="lg" fontWeight="semibold" color="fg.default">
                {t('batchCutter.title')}
            </Text>
            <Text fontSize="sm" color="fg.muted">
                {t('batchCutter.subtitle')}
            </Text>
        </VStack>
    );
}
