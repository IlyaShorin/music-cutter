import { Box, Text, HStack } from '@chakra-ui/react';
import { TimeField } from './TimeField';

interface TimecodeInputProps {
    label: string;
    hours: string;
    minutes: string;
    seconds: string;
    onHoursChange: (value: string) => void;
    onMinutesChange: (value: string) => void;
    onSecondsChange: (value: string) => void;
    disabled?: boolean;
    error?: string;
}

export function TimecodeInput({
    label,
    hours,
    minutes,
    seconds,
    onHoursChange,
    onMinutesChange,
    onSecondsChange,
    disabled = false,
    error,
}: TimecodeInputProps) {
    return (
        <Box>
            <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb={2}>
                {label}
            </Text>
            <HStack gap={2}>
                <TimeField
                    value={hours}
                    onChange={onHoursChange}
                    disabled={disabled}
                    placeholder="HH"
                    label="HH"
                />
                <Text color="fg.muted" fontWeight="bold">
                    :
                </Text>
                <TimeField
                    value={minutes}
                    onChange={onMinutesChange}
                    disabled={disabled}
                    placeholder="MM"
                    label="MM"
                />
                <Text color="fg.muted" fontWeight="bold">
                    :
                </Text>
                <TimeField
                    value={seconds}
                    onChange={onSecondsChange}
                    disabled={disabled}
                    placeholder="SS"
                    label="SS"
                />
            </HStack>
            {error && (
                <Text fontSize="sm" color="colorPalette.error" mt={1}>
                    {error}
                </Text>
            )}
        </Box>
    );
}
