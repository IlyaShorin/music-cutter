import { Button, Spinner } from '@chakra-ui/react';
import { useTypedTranslation } from '@/i18n';

interface CutButtonProps {
    status: 'idle' | 'cutting' | 'success' | 'error';
    onClick: () => void;
}

const colorPalettes = {
    idle: 'green' as const,
    cutting: 'gray' as const,
    success: 'green' as const,
    error: 'red' as const,
};

function getColorPalette(status: CutButtonProps['status']) {
    return colorPalettes[status];
}

export function CutButton({ status, onClick }: CutButtonProps) {
    const { t } = useTypedTranslation();
    const isLoading = status === 'cutting';

    const getLabel = () => {
        switch (status) {
            case 'idle':
                return t('audioCutter.cut.idle');
            case 'cutting':
                return t('audioCutter.cut.cutting');
            case 'success':
                return t('audioCutter.cut.success');
            case 'error':
                return t('audioCutter.cut.error');
        }
    };

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
            {getLabel()}
        </Button>
    );
}
