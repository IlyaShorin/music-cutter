import { Box, Text, VStack, HStack } from '@chakra-ui/react';
import type { UseAudioCutterResult } from './useAudioCutter';
import { TimecodeInput } from '../../components/TimecodeInput';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/TextInput';
import { CutButton } from '../../components/CutButton';
import { StatusAlert } from '../../components/StatusAlert';
import { AudioCutterMetadata } from './AudioCutterMetadata';

interface AudioCutterFormProps {
    form: UseAudioCutterResult['form'];
    status: UseAudioCutterResult['status'];
    error: UseAudioCutterResult['error'];
    inputValue: UseAudioCutterResult['inputValue'];
    onSelectFile: () => void;
    onSelectOutput: () => void;
    onInputChange: (value: string) => void;
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
    onSubmit,
}: AudioCutterFormProps) {
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
        if (status === 'error') {
            form.reset(form.getValues());
            form.setValue('filePath', form.watch('filePath'));
            form.setValue('outputFileName', form.watch('outputFileName'));
        } else {
            onSubmit();
        }
    }

    return (
        <VStack gap={5} width="100%">
            <Box width="100%">
                <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb={2}>
                    Audio File
                </Text>
                <HStack gap={2}>
                    <TextInput
                        value={inputValue}
                        placeholder="/path/to/audio.mp3"
                        disabled={status === 'cutting'}
                        onChange={onInputChange}
                    />
                    <Button onClick={onSelectFile} disabled={status === 'cutting'} colorPalette="blue">
                        Browse
                    </Button>
                </HStack>
                {filePathError && (
                    <Text fontSize="xs" color="fg.critical" mt={1}>
                        {filePathError}
                    </Text>
                )}
            </Box>

            <TimecodeInput
                label="Start Time"
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
                label="End Time"
                hours={form.watch('endTimeHours')}
                minutes={form.watch('endTimeMinutes')}
                seconds={form.watch('endTimeSeconds')}
                onHoursChange={(v) => form.setValue('endTimeHours', v)}
                onMinutesChange={(v) => form.setValue('endTimeMinutes', v)}
                onSecondsChange={(v) => form.setValue('endTimeSeconds', v)}
                disabled={status === 'cutting'}
                error={endTimeError}
            />

            {filePath && <AudioCutterMetadata filePath={filePath} onMetadataLoaded={handleMetadataLoaded} />}

            <Box width="100%">
                <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb={2}>
                    Output File
                </Text>
                <HStack gap={2}>
                    <TextInput
                        value={outputFileName}
                        placeholder="fragment"
                        disabled={status === 'cutting'}
                        onChange={(v) => form.setValue('outputFileName', v)}
                    />
                    <Button onClick={onSelectOutput} disabled={status === 'cutting'} colorPalette="blue">
                        Save As
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

            <CutButton status={status} onClick={handleClick} />

            {error && <StatusAlert message={error} type="error" />}

            {status === 'success' && (
                <StatusAlert message="Audio fragment saved successfully!" type="success" />
            )}
        </VStack>
    );
}
