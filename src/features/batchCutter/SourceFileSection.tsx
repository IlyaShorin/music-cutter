import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/TextInput';
import { formatSecondsToTimecode } from '../../utils/tracklist';

interface SourceFileSectionProps {
    filePath: string;
    duration: number;
    outputFolderPath: string;
    isProcessing: boolean;
    onSelectFile: () => void;
    onSelectOutputFolder: () => void;
}

export function SourceFileSection({
    filePath,
    duration,
    outputFolderPath,
    isProcessing,
    onSelectFile,
    onSelectOutputFolder,
}: SourceFileSectionProps) {
    const folderName = outputFolderPath.split(/[/\\]/).pop() || '';

    return (
        <VStack gap={3} width="100%">
            <Box width="100%">
                <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb={2}>
                    Audio File
                </Text>
                <HStack gap={2}>
                    <TextInput
                        value={filePath}
                        placeholder="/path/to/audio.mp3"
                        disabled={isProcessing}
                        readOnly
                    />
                    <Button onClick={onSelectFile} disabled={isProcessing} colorPalette="blue">
                        Browse
                    </Button>
                </HStack>
                {duration > 0 && (
                    <Text fontSize="xs" color="fg.muted" mt={1}>
                        Duration: {formatSecondsToTimecode(duration)}
                    </Text>
                )}
            </Box>

            {filePath && (
                <Box width="100%">
                    <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb={2}>
                        Output Folder
                    </Text>
                    <HStack gap={2}>
                        <TextInput
                            value={folderName}
                            placeholder="Select folder"
                            disabled={isProcessing}
                            readOnly
                        />
                        <Button onClick={onSelectOutputFolder} disabled={isProcessing} colorPalette="blue">
                            Save As
                        </Button>
                    </HStack>
                    {outputFolderPath && (
                        <Text fontSize="xs" color="fg.muted" mt={1}>
                            {outputFolderPath}
                        </Text>
                    )}
                </Box>
            )}
        </VStack>
    );
}
