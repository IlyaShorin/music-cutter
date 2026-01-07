import { Box, Text } from '@chakra-ui/react';

interface StatusAlertProps {
    message: string;
    type: 'error' | 'success';
}

function getColors(type: StatusAlertProps['type']) {
    return type === 'error'
        ? { bg: 'red.50', border: 'red.200', text: 'red.600' }
        : { bg: 'green.50', border: 'green.200', text: 'green.600' };
}

export function StatusAlert({ message, type }: StatusAlertProps) {
    const colors = getColors(type);

    return (
        <Box p={3} bg={colors.bg} border="1px" borderColor={colors.border} rounded="lg">
            <Text fontSize="sm" color={colors.text}>
                {message}
            </Text>
        </Box>
    );
}
