import { useState, useCallback } from 'react';
import { useBatchCutterForm } from './useBatchCutterForm';
import { useBatchCutterFile } from './useBatchCutterFile';
import { useBatchCutterOutput } from './useBatchCutterOutput';
import { useBatchCutterTracks } from './useBatchCutterTracks';
import { useBatchCutterProcess } from './useBatchCutterProcess';
import type { ParsedTrack, BatchOutput } from '../../types/batch';

export interface UseBatchCutterResult {
    form: ReturnType<typeof useBatchCutterForm>;
    sourceFileDuration: number;
    parsedTracks: ParsedTrack[];
    isProcessing: boolean;
    currentTrack: number;
    result: BatchOutput | null;
    error: string | null;
    setParsedTracks: (tracks: ParsedTrack[]) => void;
    onSelectFile: () => void;
    onSelectOutputFolder: () => void;
    onTracklistChange: (value: string) => void;
    onTrackChange: (id: string, field: keyof ParsedTrack, value: string | boolean) => void;
    onCoverChange: (id: string, coverData: string) => void;
    onTrackDelete: (id: string) => void;
    onProcess: () => void;
    onReset: () => void;
}

export function useBatchCutter(): UseBatchCutterResult {
    const [sourceFileDuration, setSourceFileDuration] = useState(0);
    const [parsedTracks, setParsedTracks] = useState<ParsedTrack[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(0);
    const [result, setResult] = useState<BatchOutput | null>(null);
    const [error, setError] = useState<string | null>(null);

    const form = useBatchCutterForm();

    const { handleSelectFile } = useBatchCutterFile(form, setSourceFileDuration, setParsedTracks);
    const { handleSelectOutputFolder } = useBatchCutterOutput(form);
    const { handleTracklistChange, handleTrackChange, handleCoverChange, handleTrackDelete } =
        useBatchCutterTracks(sourceFileDuration, setParsedTracks, form);
    const { handleProcess } = useBatchCutterProcess(
        form,
        parsedTracks,
        setIsProcessing,
        setCurrentTrack,
        setResult,
        setError
    );

    const handleReset = useCallback(() => {
        form.reset();
        setSourceFileDuration(0);
        setParsedTracks([]);
        setIsProcessing(false);
        setCurrentTrack(0);
        setResult(null);
        setError(null);
    }, [form]);

    return {
        form,
        sourceFileDuration,
        parsedTracks,
        isProcessing,
        currentTrack,
        result,
        error,
        setParsedTracks,
        onSelectFile: handleSelectFile,
        onSelectOutputFolder: handleSelectOutputFolder,
        onTracklistChange: handleTracklistChange,
        onTrackChange: handleTrackChange,
        onCoverChange: handleCoverChange,
        onTrackDelete: handleTrackDelete,
        onProcess: handleProcess,
        onReset: handleReset,
    };
}
