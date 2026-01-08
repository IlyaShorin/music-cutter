import { Box, Text, Textarea, HStack } from '@chakra-ui/react';
import { Button } from './ui/Button';

interface TracklistInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    example?: string;
}

const EXAMPLE_TRACKLIST = `1:46 (Intro)
2:15 Без тебя
3:40 (Желают всего хорошего)
4:35 Афтерпати
8:00 Локд Клап`;

export function TracklistInput({ value, onChange, disabled, example = EXAMPLE_TRACKLIST }: TracklistInputProps) {
    function handleLoadExample() {
        onChange(example);
    }

    function handleClear() {
        onChange('');
    }

    const lineCount = value ? value.split('\n').length : 0;

    return (
        <Box width="100%">
            <HStack justify="space-between" mb={2}>
                <Text fontSize="sm" fontWeight="medium" color="fg.muted">
                    Tracklist (format: MM:SS Title)
                </Text>
                <HStack gap={2}>
                    {!value && (
                        <Button
                            variant="ghost"
                            size="sm"
                            colorPalette="blue"
                            onClick={handleLoadExample}
                            disabled={disabled}
                        >
                            Load Example
                        </Button>
                    )}
                    {value && (
                        <Button
                            variant="ghost"
                            size="sm"
                            colorPalette="red"
                            onClick={handleClear}
                            disabled={disabled}
                        >
                            Clear
                        </Button>
                    )}
                </HStack>
            </HStack>
            <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={`1:46 Track Title\n2:15 Another Track\n...`}
                disabled={disabled}
                rows={8}
                fontFamily="mono"
                fontSize="sm"
                resize="vertical"
            />
            {value && (
                <Text fontSize="xs" color="fg.muted" mt={1}>
                    {lineCount} line{lineCount !== 1 ? 's' : ''}
                </Text>
            )}
        </Box>
    );
}
