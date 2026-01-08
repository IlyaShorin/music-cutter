import { useCallback } from 'react';
import type { ParsedTrack } from '../../types/batch';
import type { UseFormReturn } from 'react-hook-form';
import type { BatchCutterForm } from './useBatchCutterForm';
import { parseTracklist } from '../../utils/tracklist';

export function useBatchCutterTracks(
    sourceFileDuration: number,
    setParsedTracks: (tracks: ParsedTrack[] | ((prev: ParsedTrack[]) => ParsedTrack[])) => void,
    form: UseFormReturn<BatchCutterForm>
) {
    const { setValue } = form;

    const handleTracklistChange = useCallback((value: string) => {
        setValue('rawTracklist', value);

        if (sourceFileDuration > 0 && value.trim()) {
            const tracks = parseTracklist(value, sourceFileDuration);
            setParsedTracks(tracks);
        } else {
            setParsedTracks([]);
        }
    }, [sourceFileDuration, setValue, setParsedTracks]);

    const handleTrackChange = useCallback((id: string, field: keyof ParsedTrack, value: string | boolean) => {
        setParsedTracks((prev) =>
            prev.map((track) =>
                track.id === id ? { ...track, [field]: value } : track
            )
        );
    }, [setParsedTracks]);

    const handleCoverChange = useCallback((id: string, coverData: string) => {
        setParsedTracks((prev) =>
            prev.map((track) =>
                track.id === id ? { ...track, coverData } : track
            )
        );
    }, [setParsedTracks]);

    const handleTrackDelete = useCallback((id: string) => {
        setParsedTracks((prev) => prev.filter((track) => track.id !== id));
    }, [setParsedTracks]);

    return {
        handleTracklistChange,
        handleTrackChange,
        handleCoverChange,
        handleTrackDelete,
    };
}
