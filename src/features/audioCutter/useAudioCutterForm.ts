import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
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

interface UseAudioCutterFormResult {
    form: ReturnType<typeof useForm<AudioCutterForm>>;
    metadataValues: MetadataValues | null;
    coverData: string | null;
    handleMetadataValuesChange: (values: MetadataValues, coverData: string | null) => void;
}

const DEFAULT_FORM_VALUES: AudioCutterForm = {
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
};

export function useAudioCutterForm(): UseAudioCutterFormResult {
    const [metadataValues, setMetadataValues] = useState<MetadataValues | null>(null);
    const [coverData, setCoverData] = useState<string | null>(null);

    const form = useForm<AudioCutterForm>({
        defaultValues: DEFAULT_FORM_VALUES,
        mode: 'onTouched',
    });

    const { register, setValue } = form;

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

    return {
        form,
        metadataValues,
        coverData,
        handleMetadataValuesChange,
    };
}
