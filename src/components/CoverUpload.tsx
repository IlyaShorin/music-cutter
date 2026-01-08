import { Box, Text, HStack, Image, GridProps } from '@chakra-ui/react';
import { Button } from './ui/Button';
import { useCoverUpload } from '../hooks/useCoverUpload';

interface CoverUploadProps {
    coverData: string | null;
    onCoverChange: (data: string | null) => void;
}

type GridColProps = {
    gridColumn?: GridProps['gridColumn'];
};

export function CoverUpload({ coverData, onCoverChange }: CoverUploadProps & GridColProps) {
    const { inputRef, handleFileChange, handleRemove, handleClick } = useCoverUpload(onCoverChange);

    return (
        <Box>
            <Text fontSize="xs" fontWeight="medium" color="fg.muted" mb={2}>
                Cover Art
            </Text>
            <HStack gap={3}>
                {coverData && (
                    <Image
                        src={coverData}
                        alt="Cover"
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
                        {coverData ? 'Change' : 'Upload'}
                    </Button>
                    {coverData && (
                        <Button
                            variant="ghost"
                            size="sm"
                            colorPalette="red"
                            onClick={handleRemove}
                        >
                            Remove
                        </Button>
                    )}
                </HStack>
            </HStack>
        </Box>
    );
}
