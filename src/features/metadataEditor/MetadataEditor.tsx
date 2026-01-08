import { Box, Text, VStack } from '@chakra-ui/react';
import { useMetadata } from './useMetadata';
import { MetadataForm } from './MetadataForm';
import { useEffect, useRef, useCallback } from 'react';
import { useTypedTranslation } from '@/i18n';

export interface MetadataValues {
    title: string;
    artist: string;
    album: string;
    album_artist: string;
    composer: string;
    genre: string;
    year: string;
    track_number: string;
    disc_number: string;
    is_compilation: boolean;
    comment: string;
}

interface MetadataEditorProps {
    filePath: string;
    onMetadataChange?: (artist: string, title: string) => void;
    onValuesChange?: (values: MetadataValues, coverData: string | null) => void;
}

export function MetadataEditor({ filePath, onMetadataChange, onValuesChange }: MetadataEditorProps) {
    const { t } = useTypedTranslation();
    const { form, status, coverData, loadMetadata, setCoverData } = useMetadata({ onMetadataChange });

    const lastLoadedPath = useRef<string | null>(null);
    const latestCoverData = useRef<string | null>(null);
    latestCoverData.current = coverData;

    const notifyValuesChange = useCallback((values: MetadataValues) => {
        onValuesChange?.(values, latestCoverData.current);
    }, [onValuesChange]);

    useEffect(() => {
        if (filePath && filePath !== lastLoadedPath.current) {
            lastLoadedPath.current = filePath;
            loadMetadata(filePath);
        }
    }, [filePath, loadMetadata]);

    useEffect(() => {
        const subscription = form.watch((value) => {
            notifyValuesChange(value as MetadataValues);
        });
        return () => subscription.unsubscribe();
    }, [form, notifyValuesChange]);

    useEffect(() => {
        if (status === 'idle') {
            notifyValuesChange(form.getValues() as MetadataValues);
        }
    }, [coverData, status, form, notifyValuesChange]);

    if (status === 'reading') {
        return (
            <Box p={4}>
                <Text color="fg.muted">{t('common.loading')}</Text>
            </Box>
        );
    }

    return (
        <VStack gap={4} align="stretch">
            <MetadataForm
                title={form.watch('title')}
                artist={form.watch('artist')}
                album={form.watch('album')}
                albumArtist={form.watch('album_artist')}
                composer={form.watch('composer')}
                genre={form.watch('genre')}
                year={form.watch('year')}
                trackNumber={form.watch('track_number')}
                discNumber={form.watch('disc_number')}
                isCompilation={form.watch('is_compilation')}
                comment={form.watch('comment')}
                coverData={coverData}
                onFieldChange={(field, value) => form.setValue(field as never, value as never)}
                onCoverChange={setCoverData}
            />
        </VStack>
    );
}
