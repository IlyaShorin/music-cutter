import { HStack } from '@chakra-ui/react';
import { Button } from '../../components/ui/Button';
import { useTypedTranslation } from '@/i18n';

interface BatchCutterActionsProps {
    isProcessing: boolean;
    hasFile: boolean;
    hasTracks: boolean;
    hasResult: boolean;
    onProcess: () => void;
    onReset: () => void;
}

export function BatchCutterActions({
    isProcessing,
    hasFile,
    hasTracks,
    hasResult,
    onProcess,
    onReset,
}: BatchCutterActionsProps) {
    const { t } = useTypedTranslation();

    return (
        <HStack gap={3}>
            <Button
                onClick={onProcess}
                disabled={isProcessing || !hasFile || !hasTracks}
                colorPalette="blue"
                isLoading={isProcessing}
            >
                {t('batchCutter.processAllTracks')}
            </Button>
            {hasResult && (
                <Button
                    onClick={onReset}
                    disabled={isProcessing}
                    variant="outline"
                >
                    {t('common.startNew')}
                </Button>
            )}
        </HStack>
    );
}
