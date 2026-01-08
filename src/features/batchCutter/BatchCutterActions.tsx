import { HStack } from '@chakra-ui/react';
import { Button } from '../../components/ui/Button';

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
    return (
        <HStack gap={3}>
            <Button
                onClick={onProcess}
                disabled={isProcessing || !hasFile || !hasTracks}
                colorPalette="blue"
                isLoading={isProcessing}
            >
                Process All Tracks
            </Button>
            {hasResult && (
                <Button
                    onClick={onReset}
                    disabled={isProcessing}
                    variant="outline"
                >
                    Start New
                </Button>
            )}
        </HStack>
    );
}
