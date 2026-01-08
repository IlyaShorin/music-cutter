import { Box, Text, HStack } from '@chakra-ui/react';
import { TimeField } from './TimeField';
import { useTypedTranslation } from '@/i18n';

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
    const { t } = useTypedTranslation();

    return (
        <Box width="100%">
            <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb={0.5}>
                {label}
            </Text>
            <HStack gap={2} width="100%">
                <TimeField
                    value={hours}
                    onChange={onHoursChange}
                    disabled={disabled}
                    placeholder={t('audioCutter.timeFormat.hours')}
                />
                <Text color="fg.muted" fontWeight="bold" paddingTop={4}>
                    :
                </Text>
                <TimeField
                    value={minutes}
                    onChange={onMinutesChange}
                    disabled={disabled}
                    placeholder={t('audioCutter.timeFormat.minutes')}
                />
                <Text color="fg.muted" fontWeight="bold" paddingTop={4}>
                    :
                </Text>
                <TimeField
                    value={seconds}
                    onChange={onSecondsChange}
                    disabled={disabled}
                    placeholder={t('audioCutter.timeFormat.seconds')}
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
