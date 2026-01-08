import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import type { MetadataValues } from '../metadataEditor/MetadataEditor';
import { useTypedTranslation } from '@/i18n';
import type { TFunction } from 'i18next';

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

function validateHours(value: string, t: TFunction) {
    if (!value) return true;
    const num = Number.parseInt(value, 10);
    if (Number.isNaN(num)) return t('audioCutter.validation.mustBeNumber');
    if (num < 0 || num > 99) return t('audioCutter.validation.mustBeNumber');
    return true;
}

function validateMinutesOrSeconds(value: string, t: TFunction) {
    if (!value) return true;
    const num = Number.parseInt(value, 10);
    if (Number.isNaN(num)) return t('audioCutter.validation.mustBeNumber');
    if (num < 0 || num > 59) return t('audioCutter.validation.mustBeNumber');
    return true;
}

export function useAudioCutterForm(): UseAudioCutterFormResult {
    const { t } = useTypedTranslation();
    const [metadataValues, setMetadataValues] = useState<MetadataValues | null>(null);
    const [coverData, setCoverData] = useState<string | null>(null);

    const form = useForm<AudioCutterForm>({
        defaultValues: DEFAULT_FORM_VALUES,
        mode: 'onTouched',
    });

    const { register, setValue } = form;

    register('filePath', { required: t('audioCutter.validation.pleaseSelectFile') });
    register('outputPath', { required: t('audioCutter.validation.pleaseSelectOutput') });
    register('startTimeHours', { validate: (v) => validateHours(v, t) });
    register('startTimeMinutes', { validate: (v) => validateMinutesOrSeconds(v, t) });
    register('startTimeSeconds', { validate: (v) => validateMinutesOrSeconds(v, t) });
    register('endTimeHours', { validate: (v) => validateHours(v, t) });
    register('endTimeMinutes', { validate: (v) => validateMinutesOrSeconds(v, t) });
    register('endTimeSeconds', { validate: (v) => validateMinutesOrSeconds(v, t) });

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
