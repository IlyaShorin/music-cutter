import { Box, Text, VStack, HStack } from '@chakra-ui/react';
import { ProgressBar } from './ProgressBar';
import type { BatchOutput } from '../types/batch';
import { useTypedTranslation } from '@/i18n';

interface BatchProgressProps {
    isProcessing: boolean;
    currentTrack: number;
    totalTracks: number;
    result: BatchOutput | null;
}

export function BatchProgress({ isProcessing, currentTrack, totalTracks, result }: BatchProgressProps) {
    const { t } = useTypedTranslation();

    if (!isProcessing && !result) {
        return null;
    }

    const progress = isProcessing ? (currentTrack / totalTracks) * 100 : 100;

    return (
        <Box width="100%">
            <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb={2}>
                {isProcessing
                    ? t('batchCutter.processing', { current: currentTrack, total: totalTracks })
                    : t('common.complete')}
            </Text>
            <ProgressBar progress={progress} />

            {result && (
                <VStack gap={2} mt={4} alignItems="flex-start">
                    {result.results.map((trackResult, idx) => (
                        <HStack
                            key={idx}
                            gap={3}
                            width="100%"
                            p={2}
                            borderRadius="md"
                            bg={trackResult.success ? 'bg.subtle' : 'bg.error'}
                        >
                            <Box
                                width={4}
                                height={4}
                                borderRadius="full"
                                bg={trackResult.success ? 'fg.success' : 'fg.critical'}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Text
                                    fontSize="xs"
                                    color="white"
                                    lineHeight={1}
                                >
                                    {trackResult.success ? '✓' : '✕'}
                                </Text>
                            </Box>
                            <Text fontSize="xs" flex={1}>
                                {trackResult.title}
                            </Text>
                            {trackResult.error && (
                                <Text fontSize="xs" color="fg.critical">
                                    {trackResult.error}
                                </Text>
                            )}
                        </HStack>
                    ))}
                </VStack>
            )}
        </Box>
    );
}
