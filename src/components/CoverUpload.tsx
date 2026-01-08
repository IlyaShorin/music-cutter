import { Box, Text, HStack, Image, GridProps } from '@chakra-ui/react';
import { Button } from './ui/Button';
import { useCoverUpload } from '../hooks/useCoverUpload';
import { useTypedTranslation } from '@/i18n';

interface CoverUploadProps {
    coverData: string | null;
    onCoverChange: (data: string | null) => void;
}

type GridColProps = {
    gridColumn?: GridProps['gridColumn'];
};

export function CoverUpload({ coverData, onCoverChange }: CoverUploadProps & GridColProps) {
    const { t } = useTypedTranslation();
    const { inputRef, handleFileChange, handleRemove, handleClick } = useCoverUpload(onCoverChange);

    return (
        <Box>
            <Text fontSize="xs" fontWeight="medium" color="fg.muted" mb={2}>
                {t('metadata.coverArt')}
            </Text>
            <HStack gap={3}>
                {coverData && (
                    <Image
                        src={coverData}
                        alt={t('metadata.cover')}
                        boxSize="60px"
                        objectFit="cover"
                        borderRadius="md"
                    />
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                <HStack gap={2}>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClick}
                    >
                        {coverData ? t('coverUpload.change') : t('coverUpload.upload')}
                    </Button>
                    {coverData && (
                        <Button
                            variant="ghost"
                            size="sm"
                            colorPalette="red"
                            onClick={handleRemove}
                        >
                            {t('common.remove')}
                        </Button>
                    )}
                </HStack>
            </HStack>
        </Box>
    );
}
