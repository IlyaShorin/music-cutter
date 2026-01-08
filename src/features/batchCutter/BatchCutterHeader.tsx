import { VStack, Text } from '@chakra-ui/react';

export function BatchCutterHeader() {
    return (
        <VStack gap={1} textAlign="center">
            <Text fontSize="lg" fontWeight="semibold" color="fg.default">
                Batch Cutter
            </Text>
            <Text fontSize="sm" color="fg.muted">
                Cut multiple tracks from a single audio file
            </Text>
        </VStack>
    );
}
