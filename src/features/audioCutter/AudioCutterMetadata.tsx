import {
    VStack,
    Text,
} from '@chakra-ui/react';
import { MetadataEditor, type MetadataValues } from '../metadataEditor/MetadataEditor';
import { useTypedTranslation } from '@/i18n';

interface AudioCutterMetadataProps {
    filePath: string;
    onMetadataLoaded?: (artist: string, title: string) => void;
    onValuesChange?: (values: MetadataValues, coverData: string | null) => void;
}

export function AudioCutterMetadata({
    filePath,
    onMetadataLoaded,
    onValuesChange,
}: AudioCutterMetadataProps) {
    const { t } = useTypedTranslation();

    return (
        <VStack gap={2} width="100%" align="stretch">
            <Text fontSize="sm" fontWeight="medium" color="fg.muted">
                {t('audioCutter.metadata')}
            </Text>
            <MetadataEditor filePath={filePath} onMetadataChange={onMetadataLoaded} onValuesChange={onValuesChange} />
        </VStack>
    );
}
