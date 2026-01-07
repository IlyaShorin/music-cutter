import { Box, Text, GridProps } from '@chakra-ui/react';
import { TextInput } from './ui/TextInput';

interface MetadataFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
    gridColumn?: GridProps['gridColumn'];
}

export function MetadataField({
    label,
    value,
    onChange,
    disabled = false,
    placeholder,
    gridColumn,
}: MetadataFieldProps) {
    return (
        <Box gridColumn={gridColumn}>
            <Text fontSize="xs" fontWeight="medium" color="fg.muted" mb={1}>
                {label}
            </Text>
            <TextInput
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
            />
        </Box>
    );
}
