import { Input as ChakraInput } from '@chakra-ui/react';

interface TextInputProps {
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    error?: boolean;
}

export function TextInput({
    value,
    placeholder,
    disabled = false,
    readOnly = false,
    onChange,
    onBlur,
    error = false,
}: TextInputProps) {
    return (
        <ChakraInput
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            onChange={(e) => onChange?.(e.target.value)}
            onBlur={onBlur}
            borderColor={error ? 'red.500' : undefined}
        />
    );
}
