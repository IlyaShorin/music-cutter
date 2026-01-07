import { Box, Text, VStack, HStack, Separator } from '@chakra-ui/react';
import { useMetadata } from './useMetadata';
import { MetadataForm } from './MetadataForm';
import { Button } from '../../components/ui/Button';
import { useEffect, useRef } from 'react';

interface MetadataEditorProps {
    filePath: string;
    onClose?: () => void;
    onMetadataChange?: (artist: string, title: string) => void;
}

export function MetadataEditor({ filePath, onClose, onMetadataChange }: MetadataEditorProps) {
    const {
        form,
        status,
        error,
        coverData,
        loadMetadata,
        handleSave,
        setCoverData,
    } = useMetadata({ onMetadataChange });

    const lastLoadedPath = useRef<string | null>(null);

    useEffect(() => {
        if (filePath && filePath !== lastLoadedPath.current) {
            lastLoadedPath.current = filePath;
            loadMetadata(filePath);
        }
    }, [filePath, loadMetadata]);

    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name === 'artist' || name === 'title') {
                const artist = value.artist || '';
                const title = value.title || '';
                if (artist || title) {
                    onMetadataChange?.(artist, title);
                }
            }
        });
        return () => subscription.unsubscribe();
    }, [form, onMetadataChange]);

    if (status === 'reading') {
        return (
            <Box p={4}>
                <Text color="fg.muted">Loading metadata...</Text>
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

            <Separator />

            <HStack gap={2} width="100%">
                <Button
                    onClick={() => handleSave(filePath)}
                    isLoading={status === 'writing'}
                    colorPalette={status === 'success' ? 'green' : 'blue'}
                    width="100%"
                >
                    {status === 'success' ? 'Saved!' : 'Save Metadata'}
                </Button>
                {onClose && (
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                )}
            </HStack>

            {error && (
                <Text color="red.500" fontSize="sm">
                    {error}
                </Text>
            )}
        </VStack>
    );
}
