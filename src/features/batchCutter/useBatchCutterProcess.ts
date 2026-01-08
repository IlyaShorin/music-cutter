import { useCallback } from 'react';
import { cutSingleTrack } from '../../api/batch';
import type { ParsedTrack, SingleTrackInput } from '../../types/batch';
import type { BatchCutterForm } from './useBatchCutterForm';
import type { UseFormReturn } from 'react-hook-form';
import { formatSecondsToTimecode } from '../../utils/tracklist';
import type { BatchOutput } from '../../types/batch';
import { invoke } from '@tauri-apps/api/core';

function getOutputSubfolderName(sourceFilePath: string): string {
    const fileName = sourceFilePath.split(/[/\\]/).pop() || '';
    const baseName = fileName.replace(/\.(mp3|wav|m4a|flac)$/i, '');
    return `${baseName}_tracks`;
}

function getOutputFolderPath(baseFolder: string, sourceFilePath: string): string {
    const subfolderName = getOutputSubfolderName(sourceFilePath);
    const separator = baseFolder.includes('\\') ? '\\' : '/';
    return [baseFolder, subfolderName].join(separator);
}

export function useBatchCutterProcess(
    form: UseFormReturn<BatchCutterForm>,
    parsedTracks: ParsedTrack[],
    setIsProcessing: (processing: boolean) => void,
    setCurrentTrack: (track: number) => void,
    setResult: (result: BatchOutput | null) => void,
    setError: (error: string | null) => void
) {
    const { getValues } = form;

    const handleProcess = useCallback(async () => {
        const values = getValues();

        if (!values.sourceFilePath || parsedTracks.length === 0) {
            setError('Please select a file and parse tracklist');
            return;
        }

        if (!values.baseOutputFolder) {
            setError('Please select output folder');
            return;
        }

        setIsProcessing(true);
        setError(null);
        setResult(null);

        const outputFolder = getOutputFolderPath(values.baseOutputFolder, values.sourceFilePath);

        try {
            await invoke('clear_output_folder', { path: outputFolder });
        } catch (e) {
            setError(`Failed to clear output folder: ${e}`);
            setIsProcessing(false);
            return;
        }

        const results: BatchOutput['results'] = [];

        for (let i = 0; i < parsedTracks.length; i++) {
            setCurrentTrack(i + 1);

            const track = parsedTracks[i];
            const singleTrackInput: SingleTrackInput = {
                file_path: values.sourceFilePath,
                track: {
                    start_time: formatSecondsToTimecode(track.startTime),
                    end_time: track.endTime ? formatSecondsToTimecode(track.endTime) : null,
                    title: track.title,
                    artist: track.artist || null,
                    cover_data: track.coverData || null,
                    fade_in: track.fadeIn,
                    fade_out: track.fadeOut,
                },
                output_folder: outputFolder,
                default_artist: null,
                file_duration_seconds: null,
            };

            try {
                const trackResult = await cutSingleTrack(singleTrackInput);
                results.push(trackResult.result);
            } catch (e) {
                results.push({
                    title: track.title,
                    output_path: '',
                    duration_seconds: 0,
                    success: false,
                    error: String(e),
                });
            }
        }

        setResult({
            output_folder: outputFolder,
            tracks_processed: results.length,
            tracks_total: parsedTracks.length,
            results,
        });
        setIsProcessing(false);
    }, [parsedTracks, getValues, setIsProcessing, setCurrentTrack, setResult, setError]);

    return { handleProcess };
}
