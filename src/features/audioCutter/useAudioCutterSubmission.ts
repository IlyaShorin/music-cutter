import { useCallback, useState } from 'react';
import { cutAudioFragment } from '../../api/commands';
import type { CutStatus } from '../../types/audio';
import { formatTimecode } from '../../utils/time';
import type { MetadataValues } from '../metadataEditor/MetadataEditor';
import type { UseFormReturn } from 'react-hook-form';
import type { AudioCutterForm } from './useAudioCutterForm';
import { useTypedTranslation } from '@/i18n';

interface UseAudioCutterSubmissionResult {
    status: CutStatus;
    error: string | null;
    handleSubmit: (
        form: UseFormReturn<AudioCutterForm>,
        metadataValues: MetadataValues | null,
        coverData: string | null
    ) => () => void;
}

export function useAudioCutterSubmission(): UseAudioCutterSubmissionResult {
    const { t } = useTypedTranslation();
    const [status, setStatus] = useState<CutStatus>('idle');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(
        (
            form: UseFormReturn<AudioCutterForm>,
            metadataValues: MetadataValues | null,
            coverData: string | null
        ) => {
            return async () => {
                const values = form.getValues();
                const { setError: setFieldError, trigger } = form;

                const startHasValue =
                    values.startTimeHours || values.startTimeMinutes || values.startTimeSeconds;
                const endHasValue = values.endTimeHours || values.endTimeMinutes || values.endTimeSeconds;

                if (!startHasValue) {
                    setFieldError('startTimeHours', { type: 'required', message: t('audioCutter.validation.timecodeRequired') });
                    return;
                }

                if (!endHasValue) {
                    setFieldError('endTimeHours', { type: 'required', message: t('audioCutter.validation.timecodeRequired') });
                    return;
                }

                const isValid = await trigger();

                if (!isValid || status === 'cutting') {
                    return;
                }

                if (!values.outputPath.trim()) {
                    setFieldError('outputPath', { type: 'required', message: t('audioCutter.validation.pleaseSelectOutput') });
                    return;
                }

                setStatus('cutting');
                setError(null);

                try {
                    const startFormatted = formatTimecode(
                        values.startTimeHours,
                        values.startTimeMinutes,
                        values.startTimeSeconds
                    );
                    const endFormatted = formatTimecode(
                        values.endTimeHours,
                        values.endTimeMinutes,
                        values.endTimeSeconds
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
            };
        },
        [status, t]
    );

    return { status, error, handleSubmit };
}
