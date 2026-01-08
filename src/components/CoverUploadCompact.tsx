import { Image } from '@chakra-ui/react';
import { Button } from './ui/Button';
import { useCoverUpload } from '../hooks/useCoverUpload';
import { useTypedTranslation } from '@/i18n';

interface CoverUploadCompactProps {
    coverData: string | null;
    onCoverChange: (data: string | null) => void;
    disabled?: boolean;
}

export function CoverUploadCompact({ coverData, onCoverChange, disabled }: CoverUploadCompactProps) {
    const { t } = useTypedTranslation();
    const { inputRef, handleFileChange, handleClick } = useCoverUpload(onCoverChange);

    const isDisabled = disabled ?? false;

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
            {coverData ? (
                <Image
                    src={coverData}
                    alt={t('metadata.cover')}
                    boxSize="32px"
                    objectFit="cover"
                    borderRadius="sm"
                    cursor={isDisabled ? 'not-allowed' : 'pointer'}
                    onClick={() => !isDisabled && handleClick()}
                    opacity={isDisabled ? 0.5 : 1}
                />
            ) : (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClick}
                    disabled={isDisabled}
                    width="32px"
                    height="32px"
                    padding={0}
                >
                    +
                </Button>
            )}
        </>
    );
}
