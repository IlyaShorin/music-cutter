import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { selectAudioFile, selectOutputFile, cutAudioFragment } from '../../api/commands';
import type { CutStatus } from '../../types/audio';
import { formatTimecode } from '../../utils/time';
import type { MetadataValues } from '../metadataEditor/MetadataEditor';

export interface AudioCutterForm {
    filePath: string;
    startTimeHours: string;
    startTimeMinutes: string;
    startTimeSeconds: string;
    endTimeHours: string;
    endTimeMinutes: string;
    endTimeSeconds: string;
    outputPath: string;
    outputFileName: string;
    fadeIn: boolean;
    fadeOut: boolean;
}

export interface UseAudioCutterResult {
    form: ReturnType<typeof useForm<AudioCutterForm>>;
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

function validateHours(value: string) {
    if (!value) return true;
    const num = Number.parseInt(value, 10);
    if (Number.isNaN(num)) return 'Must be a number';
    if (num < 0 || num > 99) return 'Must be between 0 and 99';
    return true;
}

function validateMinutesOrSeconds(value: string) {
    if (!value) return true;
    const num = Number.parseInt(value, 10);
    if (Number.isNaN(num)) return 'Must be a number';
    if (num < 0 || num > 59) return 'Must be between 0 and 59';
    return true;
}

export function useAudioCutter(): UseAudioCutterResult {
    const [status, setStatus] = useState<CutStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [metadataValues, setMetadataValues] = useState<MetadataValues | null>(null);
    const [coverData, setCoverData] = useState<string | null>(null);

    const form = useForm<AudioCutterForm>({
        defaultValues: {
            filePath: '',
            startTimeHours: '',
            startTimeMinutes: '',
            startTimeSeconds: '',
            endTimeHours: '',
            endTimeMinutes: '',
            endTimeSeconds: '',
            outputPath: '',
            outputFileName: '',
            fadeIn: false,
            fadeOut: false,
        },
        mode: 'onTouched',
    });

    const { register, watch, setValue, setError: setFieldError, clearErrors, trigger } = form;

    register('filePath', { required: 'Please select an audio file' });
    register('outputPath', { required: 'Please select output location' });
    register('startTimeHours', { validate: validateHours });
    register('startTimeMinutes', { validate: validateMinutesOrSeconds });
    register('startTimeSeconds', { validate: validateMinutesOrSeconds });
    register('endTimeHours', { validate: validateHours });
    register('endTimeMinutes', { validate: validateMinutesOrSeconds });
    register('endTimeSeconds', { validate: validateMinutesOrSeconds });

    const handleMetadataValuesChange = useCallback((values: MetadataValues, cover: string | null) => {
        setMetadataValues(values);
        setCoverData(cover);

        const suggestedName = `${values.artist} - ${values.title}`.trim();
        if (suggestedName && suggestedName !== ' - ') {
            setValue('outputFileName', suggestedName);
        }
    }, [setValue]);

    async function handleSelectFile() {
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
        } catch {
            setError('Failed to select file');
        }
    }

    async function handleSelectOutput() {
        try {
            const fileName = watch('outputFileName') || 'output';
            const path = await selectOutputFile(fileName);
            setValue('outputPath', path);
            clearErrors('outputPath');
            setError(null);

            const actualFileName = path.split('/').pop()?.replace(/\.[^.]*$/, '') || '';
            setValue('outputFileName', actualFileName);
        } catch {
            setError('Failed to select output location');
        }
    }

    function handleInputChange(value: string) {
        setInputValue(value);
        setValue('filePath', value);
    }

    async function handleSubmit() {
        const values = form.getValues();

        const startHasValue = values.startTimeHours || values.startTimeMinutes || values.startTimeSeconds;
        const endHasValue = values.endTimeHours || values.endTimeMinutes || values.endTimeSeconds;

        if (!startHasValue) {
            setFieldError('startTimeHours', { type: 'required', message: 'Timecode is required' });
            return;
        }

        if (!endHasValue) {
            setFieldError('endTimeHours', { type: 'required', message: 'Timecode is required' });
            return;
        }

        const isValid = await trigger();

        if (!isValid || status === 'cutting') {
            return;
        }

        if (!values.outputPath.trim()) {
            setFieldError('outputPath', { type: 'required', message: 'Please select output location' });
            return;
        }

        setStatus('cutting');
        setError(null);

        try {
            const startFormatted = formatTimecode(
                values.startTimeHours,
                values.startTimeMinutes,
                values.startTimeSeconds,
            );
            const endFormatted = formatTimecode(
                values.endTimeHours,
                values.endTimeMinutes,
                values.endTimeSeconds,
            );

            await cutAudioFragment({
                file_path: values.filePath,
                start_time: startFormatted,
                end_time: endFormatted,
                output_path: values.outputPath,
                title: metadataValues?.title || undefined,
                artist: metadataValues?.artist || undefined,
                album: metadataValues?.album || undefined,
                album_artist: metadataValues?.album_artist || undefined,
                composer: metadataValues?.composer || undefined,
                genre: metadataValues?.genre || undefined,
                year: metadataValues?.year ? parseInt(metadataValues.year, 10) : undefined,
                track_number: metadataValues?.track_number ? parseInt(metadataValues.track_number, 10) : undefined,
                total_tracks: undefined,
                disc_number: metadataValues?.disc_number ? parseInt(metadataValues.disc_number, 10) : undefined,
                total_discs: undefined,
                is_compilation: metadataValues?.is_compilation,
                comment: metadataValues?.comment || undefined,
                cover_image_data: coverData || undefined,
                fade_in: values.fadeIn,
                fade_out: values.fadeOut,
            });

            setStatus('success');
        } catch (err) {
            setStatus('error');
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(errorMessage);
        }
    }

    return {
        form,
        status,
        error,
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
