import { useState, useCallback } from 'react';
import { selectAudioFile, selectOutputFile } from '../../api/commands';
import { useAudioCutterForm } from './useAudioCutterForm';
import { useAudioCutterSubmission } from './useAudioCutterSubmission';
import type { AudioCutterForm } from './useAudioCutterForm';
import type { CutStatus } from '../../types/audio';
import type { MetadataValues } from '../metadataEditor/MetadataEditor';

export interface UseAudioCutterResult {
    form: ReturnType<typeof useAudioCutterForm>['form'];
    status: CutStatus;
    error: string | null;
    inputValue: string;
    metadataValues: MetadataValues | null;
    coverData: string | null;
    handleSelectFile: () => void;
    handleSelectOutput: () => void;
    handleInputChange: (value: string) => void;
    handleMetadataValuesChange: (values: MetadataValues, coverData: string | null) => void;
    handleSubmit: () => void;
}

export function useAudioCutter(): UseAudioCutterResult {
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState<string | null>(null);

    const { form, metadataValues, coverData, handleMetadataValuesChange } = useAudioCutterForm();
    const { status, error: submitError, handleSubmit: createSubmitHandler } = useAudioCutterSubmission();

    const { watch, setValue, clearErrors } = form;

    const handleSelectFile = useCallback(async () => {
        try {
            const path = await selectAudioFile();
            setInputValue(path);
            setValue('filePath', path);
            clearErrors('filePath');
            setError(null);

            const currentFileName = watch('outputFileName');
            if (!currentFileName) {
                const fileName = path.split('/').pop()?.replace(/\.[^.]*$/, '') || 'output';
                setValue('outputFileName', fileName);
            }
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            setError(`Failed to select file: ${message}`);
        }
    }, [watch, setValue, clearErrors]);

    const handleSelectOutput = useCallback(async () => {
        try {
            const fileName = watch('outputFileName') || 'output';
            const path = await selectOutputFile(fileName);
            setValue('outputPath', path);
            clearErrors('outputPath');
            setError(null);

            const actualFileName = path.split('/').pop()?.replace(/\.[^.]*$/, '') || '';
            setValue('outputFileName', actualFileName);
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            setError(`Failed to select output location: ${message}`);
        }
    }, [watch, setValue, clearErrors]);

    const handleInputChange = useCallback((value: string) => {
        setInputValue(value);
        setValue('filePath', value);
    }, [setValue]);

    const handleSubmit = createSubmitHandler(form, metadataValues, coverData);

    return {
        form,
        status: status,
        error: submitError || error,
        inputValue,
        metadataValues,
        coverData,
        handleSelectFile,
        handleSelectOutput,
        handleInputChange,
        handleMetadataValuesChange,
        handleSubmit,
    };
}

export type { AudioCutterForm };
