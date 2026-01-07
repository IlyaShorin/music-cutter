import {
    VStack,
    Text,
} from '@chakra-ui/react';
import { MetadataEditor } from '../metadataEditor/MetadataEditor';

interface AudioCutterMetadataProps {
    filePath: string;
    onMetadataLoaded?: (artist: string, title: string) => void;
}

export function AudioCutterMetadata({
    filePath,
    onMetadataLoaded,
}: AudioCutterMetadataProps) {
    return (
        <VStack gap={2} width="100%" align="stretch">
            <Text fontSize="sm" fontWeight="medium" color="fg.muted">
                Metadata
            </Text>
            <MetadataEditor filePath={filePath} onMetadataChange={onMetadataLoaded} />
        </VStack>
    );
}
