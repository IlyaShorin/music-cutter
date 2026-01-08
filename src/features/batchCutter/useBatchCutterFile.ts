import { useCallback } from 'react';
import { selectAudioFile } from '../../api/commands';
import { getAudioDuration } from '../../api/batch';
import { buildDefaultArtist } from '../../utils/tracklist';
import type { ParsedTrack } from '../../types/batch';
import type { BatchCutterForm } from './useBatchCutterForm';
import type { UseFormReturn } from 'react-hook-form';

export function useBatchCutterFile(
    form: UseFormReturn<BatchCutterForm>,
    setSourceFileDuration: (duration: number) => void,
    setParsedTracks: (tracks: ParsedTrack[]) => void
) {
    const { watch, setValue } = form;
    const rawTracklist = watch('rawTracklist');

    const handleSelectFile = useCallback(async () => {
        try {
            const path = await selectAudioFile();
            setValue('sourceFilePath', path);
            setValue('defaultArtist', buildDefaultArtist(path.split('/').pop() || path));

            const durationStr = await getAudioDuration(path);
            const parts = durationStr.split(':').map(Number);
            const duration = parts[0] * 3600 + parts[1] * 60 + parts[2];
            setSourceFileDuration(duration);

            if (rawTracklist) {
                const { parseTracklist } = await import('../../utils/tracklist');
                const tracks = parseTracklist(rawTracklist, duration);
                setParsedTracks(tracks);
            }
        } catch (e) {
            throw e;
        }
    }, [rawTracklist, setValue, setSourceFileDuration, setParsedTracks]);

    return { handleSelectFile };
}
