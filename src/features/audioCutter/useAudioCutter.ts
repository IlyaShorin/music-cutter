import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { selectAudioFile, selectOutputFile, cutAudioFragment } from '../../api/commands';
import type { CutStatus } from '../../types/audio';
import { formatTimecode } from '../../utils/time';

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
}

export interface UseAudioCutterResult {
    form: ReturnType<typeof useForm<AudioCutterForm>>;
    status: CutStatus;
    error: string | null;
    inputValue: string;
    handleSelectFile: () => void;
    handleSelectOutput: () => void;
    handleInputChange: (value: string) => void;
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
            });

            setStatus('success');
        } catch (err) {
            setStatus('error');
            setError(err instanceof Error ? err.message : 'Failed to cut audio');
        }
    }

    return {
        form,
        status,
        error,
        inputValue,
        handleSelectFile,
        handleSelectOutput,
        handleInputChange,
        handleSubmit,
    };
}
