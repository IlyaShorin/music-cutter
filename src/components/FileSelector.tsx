import { Box, Input, Text } from '@chakra-ui/react';
import { Button } from './ui/Button';

interface FileSelectorProps {
    filePath: string;
    onSelect: () => void;
    disabled?: boolean;
}

export function FileSelector({ filePath, onSelect, disabled }: FileSelectorProps) {
    return (
        <Box>
            <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb={2}>
                Audio File
            </Text>
            <Box display="flex" gap={2}>
                <Input
                    value={filePath}
                    placeholder="No file selected"
                    readOnly
                    bg="bg.subtle"
                    flex={1}
                />
                <Button onClick={onSelect} disabled={disabled} colorPalette="blue">
                    Browse
                </Button>
            </Box>
        </Box>
    );
}
