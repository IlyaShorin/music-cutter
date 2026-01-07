import { Button, Spinner } from '@chakra-ui/react';

interface CutButtonProps {
    status: 'idle' | 'cutting' | 'success' | 'error';
    onClick: () => void;
}

const labels = {
    idle: 'Cut Audio',
    cutting: 'Cutting...',
    success: '✓ Complete!',
    error: '✗ Failed - Retry',
};

const colorPalettes = {
    idle: 'green' as const,
    cutting: 'gray' as const,
    success: 'green' as const,
    error: 'red' as const,
};

function getLabel(status: CutButtonProps['status']) {
    return labels[status];
}

function getColorPalette(status: CutButtonProps['status']) {
    return colorPalettes[status];
}

export function CutButton({ status, onClick }: CutButtonProps) {
    const isLoading = status === 'cutting';

    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            colorPalette={getColorPalette(status)}
            width="100%"
            size="lg"
            fontWeight="semibold"
        >
            {isLoading && <Spinner size="sm" mr={2} />}
            {getLabel(status)}
        </Button>
    );
}
