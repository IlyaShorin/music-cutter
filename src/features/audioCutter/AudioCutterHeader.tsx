import { VStack, Text } from '@chakra-ui/react';

export function AudioCutterHeader() {
    return (
        <VStack gap={1} textAlign="center">
            <Text fontSize="lg" fontWeight="semibold" color="fg.default">
                Single Cut
            </Text>
            <Text fontSize="sm" color="fg.muted">
                Cut a single fragment from an audio file
            </Text>
        </VStack>
    );
}
