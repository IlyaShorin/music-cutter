import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { useAudioCutter } from './useAudioCutter';
import { AudioCutterForm } from './AudioCutterForm';

export function AudioCutter() {
    const {
        form,
        status,
        error,
        inputValue,
        handleSelectFile,
        handleSelectOutput,
        handleInputChange,
        handleSubmit,
    } = useAudioCutter();

    return (
        <Box minH="100vh" bg="bg.canvas" py={8} px={6}>
            <VStack gap={6} maxW="lg" mx="auto">
                <VStack gap={1} textAlign="center">
                    <Heading size="lg" color="fg.default">
                        Music Cutter
                    </Heading>
                    <Text color="fg.muted">Cut audio fragments from MP3 files</Text>
                </VStack>

                <AudioCutterForm
                    form={form}
                    status={status}
                    error={error}
                    inputValue={inputValue}
                    onSelectFile={handleSelectFile}
                    onSelectOutput={handleSelectOutput}
                    onInputChange={handleInputChange}
                    onSubmit={handleSubmit}
                />
            </VStack>
        </Box>
    );
}
