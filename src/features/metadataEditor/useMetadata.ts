import { useState, useCallback } from 'react';
import { getAudioMetadata, setAudioMetadata } from '../../api/metadata';
import type { MetadataStatus } from '../../types/metadata';
import { useMetadataForm, DEFAULT_METADATA_FORM_VALUES, type MetadataForm } from './useMetadataForm';

interface UseMetadataResult {
    form: ReturnType<typeof useMetadataForm>;
    status: MetadataStatus;
    error: string | null;
    coverData: string | null;
    loadMetadata: (filePath: string) => void;
    handleSave: (filePath: string) => void;
    setCoverData: (data: string | null) => void;
}

interface UseMetadataProps {
    onMetadataChange?: (artist: string, title: string) => void;
}

export function useMetadata({ onMetadataChange }: UseMetadataProps = {}): UseMetadataResult {
    const [status, setStatus] = useState<MetadataStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const [coverData, setCoverData] = useState<string | null>(null);

    const form = useMetadataForm();

    const loadMetadata = useCallback(async (filePath: string) => {
        if (filePath.startsWith('http')) {
            setStatus('idle');
            setError(null);
            form.reset(DEFAULT_METADATA_FORM_VALUES);
            setCoverData(null);
            return;
        }

        setStatus('reading');
        setError(null);
        try {
            const data = await getAudioMetadata(filePath);
            const artist = data.artist ?? '';
            const title = data.title ?? '';
            form.reset({
                title,
                artist,
                album: data.album ?? '',
                album_artist: data.album_artist ?? '',
                composer: data.composer ?? '',
                genre: data.genre ?? '',
                year: data.year?.toString() ?? '',
                track_number: data.track_number?.toString() ?? '',
                disc_number: data.disc_number?.toString() ?? '',
                is_compilation: data.is_compilation,
                comment: data.comment ?? '',
            });
            setCoverData(data.cover_image_data ?? null);

            if (artist || title) {
                onMetadataChange?.(artist, title);
            }

            setStatus('idle');
        } catch (e) {
            const message = String(e);
            if (message.includes('NoTag')) {
                form.reset(DEFAULT_METADATA_FORM_VALUES);
                setCoverData(null);
                setStatus('idle');
            } else {
                setError(message);
                setStatus('error');
            }
        }
    }, [form, onMetadataChange]);

    const handleSave = useCallback(async (filePath: string) => {
        if (filePath.startsWith('http')) {
            setError('Cannot save metadata to URL. Metadata will be applied to the output file after cutting.');
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
            return;
        }

        setStatus('writing');
        setError(null);
        try {
            const values = form.getValues();
            await setAudioMetadata({
                file_path: filePath,
                title: values.title || undefined,
                artist: values.artist || undefined,
                album: values.album || undefined,
                album_artist: values.album_artist || undefined,
                composer: values.composer || undefined,
                genre: values.genre || undefined,
                year: values.year ? parseInt(values.year, 10) : undefined,
                track_number: values.track_number ? parseInt(values.track_number, 10) : undefined,
                disc_number: values.disc_number ? parseInt(values.disc_number, 10) : undefined,
                is_compilation: values.is_compilation,
                cover_image_data: coverData ?? undefined,
                comment: values.comment || undefined,
            });
            setStatus('success');
            setTimeout(() => setStatus('idle'), 2000);
        } catch (e) {
            setError(String(e));
            setStatus('error');
        }
    }, [form, coverData]);

    return {
        form,
        status,
        error,
        coverData,
        loadMetadata,
        handleSave,
        setCoverData,
    };
}

export type { MetadataForm };
