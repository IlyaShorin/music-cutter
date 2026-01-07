import { ProgressRoot, ProgressRange } from '@chakra-ui/react';

interface ProgressBarProps {
    progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
    if (progress === 0) {
        return null;
    }

    return (
        <ProgressRoot value={progress} colorPalette="blue">
            <ProgressRange />
        </ProgressRoot>
    );
}
