import { Box, Text, VStack, HStack } from '@chakra-ui/react';
import type { UseAudioCutterResult } from './useAudioCutter';
import { TimecodeInput } from '../../components/TimecodeInput';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/TextInput';
import { Checkbox } from '../../components/ui/Checkbox';
import { CutButton } from '../../components/CutButton';
import { StatusAlert } from '../../components/StatusAlert';
import { AudioCutterMetadata } from './AudioCutterMetadata';
import { useTypedTranslation } from '@/i18n';

interface AudioCutterFormProps {
    form: UseAudioCutterResult['form'];
    status: UseAudioCutterResult['status'];
    error: UseAudioCutterResult['error'];
    inputValue: UseAudioCutterResult['inputValue'];
    onSelectFile: () => void;
    onSelectOutput: () => void;
    onInputChange: (value: string) => void;
    onMetadataValuesChange: UseAudioCutterResult['handleMetadataValuesChange'];
    onSubmit: () => void;
}

export function AudioCutterForm({
    form,
    status,
    error,
    inputValue,
    onSelectFile,
    onSelectOutput,
    onInputChange,
    onMetadataValuesChange,
    onSubmit,
}: AudioCutterFormProps) {
    const { t } = useTypedTranslation();
    const filePath = form.watch('filePath');
    const outputPath = form.watch('outputPath');
    const outputFileName = form.watch('outputFileName');

    function getError(keys: (keyof import('./useAudioCutter').AudioCutterForm)[]): string | undefined {
        for (const key of keys) {
            const msg = (form.formState.errors[key] as { message?: string })?.message;
            if (msg) return msg;
        }
        return undefined;
    }

    const startTimeError = getError(['startTimeHours', 'startTimeMinutes', 'startTimeSeconds']);
    const endTimeError = getError(['endTimeHours', 'endTimeMinutes', 'endTimeSeconds']);
    const filePathError = (form.formState.errors.filePath as { message?: string })?.message;
    const outputPathError = (form.formState.errors.outputPath as { message?: string })?.message;

    function handleMetadataLoaded(artist: string, title: string) {
        const suggestedName = `${artist} - ${title}`.trim();
        form.setValue('outputFileName', suggestedName);
    }

    function handleClick() {
        onSubmit();
    }

    return (
        <VStack gap={5} width="100%">
            <Box width="100%">
                <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb={2}>
                    {t('audioCutter.audioFile')}
                </Text>
                <HStack gap={2}>
                    <TextInput
                        value={inputValue}
                        placeholder={t('audioCutter.placeholder')}
                        disabled={status === 'cutting'}
                        onChange={onInputChange}
                    />
                    <Button onClick={onSelectFile} disabled={status === 'cutting'} colorPalette="blue">
                        {t('common.browse')}
                    </Button>
                </HStack>
                {filePathError && (
                    <Text fontSize="xs" color="fg.critical" mt={1}>
                        {filePathError}
                    </Text>
                )}
            </Box>

            <TimecodeInput
                label={t('audioCutter.startTime')}
                hours={form.watch('startTimeHours')}
                minutes={form.watch('startTimeMinutes')}
                seconds={form.watch('startTimeSeconds')}
                onHoursChange={(v) => form.setValue('startTimeHours', v)}
                onMinutesChange={(v) => form.setValue('startTimeMinutes', v)}
                onSecondsChange={(v) => form.setValue('startTimeSeconds', v)}
                disabled={status === 'cutting'}
                error={startTimeError}
            />

            <TimecodeInput
                label={t('audioCutter.endTime')}
                hours={form.watch('endTimeHours')}
                minutes={form.watch('endTimeMinutes')}
                seconds={form.watch('endTimeSeconds')}
                onHoursChange={(v) => form.setValue('endTimeHours', v)}
                onMinutesChange={(v) => form.setValue('endTimeMinutes', v)}
                onSecondsChange={(v) => form.setValue('endTimeSeconds', v)}
                disabled={status === 'cutting'}
                error={endTimeError}
            />

            {filePath && <AudioCutterMetadata filePath={filePath} onMetadataLoaded={handleMetadataLoaded} onValuesChange={onMetadataValuesChange} />}

            <Box width="100%">
                <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb={2}>
                    {t('audioCutter.outputFile')}
                </Text>
                <HStack gap={2}>
                    <TextInput
                        value={outputFileName}
                        placeholder={t('audioCutter.placeholderFragment')}
                        disabled={status === 'cutting'}
                        onChange={(v) => form.setValue('outputFileName', v)}
                    />
                    <Button onClick={onSelectOutput} disabled={status === 'cutting'} colorPalette="blue">
                        {t('common.saveAs')}
                    </Button>
                </HStack>
                {outputPath && (
                    <Text fontSize="xs" color="fg.muted" mt={1}>
                        {outputPath}
                    </Text>
                )}
                {outputPathError && (
                    <Text fontSize="xs" color="fg.critical" mt={1}>
                        {outputPathError}
                    </Text>
                )}
            </Box>

            <Box width="100%">
                <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb={2}>
                    {t('audioCutter.audioEffects')}
                </Text>
                <HStack gap={4}>
                    <HStack gap={2}>
                        <Checkbox
                            checked={form.watch('fadeIn')}
                            onChange={(v) => form.setValue('fadeIn', v)}
                            disabled={status === 'cutting'}
                        />
                        <Text fontSize="sm" color="fg.muted">
                            {t('audioCutter.fadeIn')}
                        </Text>
                    </HStack>
                    <HStack gap={2}>
                        <Checkbox
                            checked={form.watch('fadeOut')}
                            onChange={(v) => form.setValue('fadeOut', v)}
                            disabled={status === 'cutting'}
                        />
                        <Text fontSize="sm" color="fg.muted">
                            {t('audioCutter.fadeOut')}
                        </Text>
                    </HStack>
                </HStack>
            </Box>

            <CutButton status={status} onClick={handleClick} />

            {error && <StatusAlert message={error} type="error" />}

            {status === 'success' && (
                <StatusAlert message={t('audioCutter.success')} type="success" />
            )}
        </VStack>
    );
}
