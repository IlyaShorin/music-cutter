import { Box, HStack } from '@chakra-ui/react';

interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

export function Checkbox({ checked, onChange, disabled }: CheckboxProps) {
    const handleToggle = () => {
        if (!disabled) {
            onChange(!checked);
        }
    };

    return (
        <HStack
            gap={2}
            cursor={disabled ? 'not-allowed' : 'pointer'}
            onClick={handleToggle}
            opacity={disabled ? 0.5 : 1}
        >
            <Box
                width="16px"
                height="16px"
                borderRadius="sm"
                border="2px solid"
                borderColor={checked ? 'blue.500' : 'fg.muted'}
                bg={checked ? 'blue.500' : 'transparent'}
                display="flex"
                alignItems="center"
                justifyContent="center"
                transition="all 0.2s"
            >
                {checked && (
                    <svg
                        width="10px"
                        height="10px"
                        viewBox="0 0 10 10"
                        fill="none"
                    >
                        <path
                            d="M1 5L3.5 7.5L9 2"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}
            </Box>
        </HStack>
    );
}
