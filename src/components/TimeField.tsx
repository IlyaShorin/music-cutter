import { Box, Input, Text } from '@chakra-ui/react';

interface TimeFieldProps {
    value: string;
    onChange: (value: string) => void;
    disabled: boolean;
    placeholder: string;
    label: string;
}

export function TimeField({ value, onChange, disabled, placeholder, label }: TimeFieldProps) {
    return (
        <Box position="relative" flex={1}>
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value.slice(0, 2))}
                disabled={disabled}
                placeholder={placeholder}
                textAlign="center"
                maxLength={2}
            />
            <Text
                position="absolute"
                right={2}
                top="50%"
                transform="translateY(-50%)"
                fontSize="xs"
                color="fg.muted"
                pointerEvents="none"
            >
                {label}
            </Text>
        </Box>
    );
}
