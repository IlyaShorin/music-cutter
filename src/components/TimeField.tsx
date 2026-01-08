import { Box, Input, Text } from '@chakra-ui/react';

interface TimeFieldProps {
    value: string;
    onChange: (value: string) => void;
    disabled: boolean;
    placeholder: string;
}

export function TimeField({ value, onChange, disabled, placeholder }: TimeFieldProps) {
    return (
        <Box flex={1}>
            <Text
                fontSize="xs"
                color="fg.muted"
                mb={0.5}
                textAlign="left"
            >
                {placeholder}
            </Text>
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value.slice(0, 2))}
                disabled={disabled}
                placeholder="00"
                textAlign="center"
                maxLength={2}
            />
        </Box>
    );
}
