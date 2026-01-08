import { Box, VStack } from '@chakra-ui/react';
import { useAudioCutter } from './useAudioCutter';
import { AudioCutterForm } from './AudioCutterForm';
import { AudioCutterHeader } from './AudioCutterHeader';

export function AudioCutter() {
    const {
        form,
        status,
        error,
        inputValue,
        handleSelectFile,
        handleSelectOutput,
        handleInputChange,
        handleMetadataValuesChange,
        handleSubmit,
    } = useAudioCutter();

    return (
        <Box minH="calc(100vh - 80px)" bg="bg.canvas">
            <VStack gap={5} width="100%">
                <AudioCutterHeader />

                <AudioCutterForm
                    form={form}
                    status={status}
                    error={error}
                    inputValue={inputValue}
                    onSelectFile={handleSelectFile}
                    onSelectOutput={handleSelectOutput}
                    onInputChange={handleInputChange}
                    onMetadataValuesChange={handleMetadataValuesChange}
                    onSubmit={handleSubmit}
                />
            </VStack>
        </Box>
    );
}
