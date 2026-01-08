import { Box, VStack } from '@chakra-ui/react';
import { useBatchCutter } from './useBatchCutter';
import { TracklistInput } from '../../components/TracklistInput';
import { TrackListEditor } from '../../components/TrackListEditor';
import { BatchProgress } from '../../components/BatchProgress';
import { StatusAlert } from '../../components/StatusAlert';
import { BatchCutterHeader } from './BatchCutterHeader';
import { SourceFileSection } from './SourceFileSection';
import { BatchCutterActions } from './BatchCutterActions';

function getOutputSubfolderName(sourceFilePath: string | undefined): string {
    if (!sourceFilePath) return '';
    const fileName = sourceFilePath.split(/[/\\]/).pop() || '';
    const baseName = fileName.replace(/\.(mp3|wav|m4a|flac)$/i, '');
    return `${baseName}_tracks`;
}

function getFullOutputPath(baseFolder: string, sourceFilePath: string): string {
    const subfolderName = getOutputSubfolderName(sourceFilePath);
    const separator = baseFolder.includes('\\') ? '\\' : '/';
    return [baseFolder, subfolderName].join(separator);
}

export function BatchCutter() {
    const {
        form,
        sourceFileDuration,
        parsedTracks,
        isProcessing,
        currentTrack,
        result,
        error,
        onSelectFile,
        onSelectOutputFolder,
        onTracklistChange,
        onTrackChange,
        onCoverChange,
        onTrackDelete,
        onProcess,
        onReset,
    } = useBatchCutter();

    const { watch } = form;
    const sourceFilePath = watch('sourceFilePath');
    const baseOutputFolder = watch('baseOutputFolder');
    const rawTracklist = watch('rawTracklist');

    const hasTracks = parsedTracks.length > 0;
    const hasFile = Boolean(sourceFilePath);

    const fullOutputPath = baseOutputFolder && sourceFilePath
        ? getFullOutputPath(baseOutputFolder, sourceFilePath)
        : baseOutputFolder;

    return (
        <Box minH="calc(100vh - 80px)" bg="bg.canvas">
            <VStack gap={5} width="100%">
                <BatchCutterHeader />

                <SourceFileSection
                    filePath={sourceFilePath}
                    duration={sourceFileDuration}
                    outputFolderPath={fullOutputPath}
                    isProcessing={isProcessing}
                    onSelectFile={onSelectFile}
                    onSelectOutputFolder={onSelectOutputFolder}
                />

                {hasFile && (
                    <TracklistInput
                        value={rawTracklist}
                        onChange={onTracklistChange}
                        disabled={isProcessing}
                    />
                )}

                {hasTracks && (
                    <TrackListEditor
                        tracks={parsedTracks}
                        onTrackChange={onTrackChange}
                        onCoverChange={onCoverChange}
                        onTrackDelete={onTrackDelete}
                        onApplyArtistToAll={() => {
                            const firstTrack = parsedTracks[0];
                            if (firstTrack.artist) {
                                parsedTracks.forEach((t) => onTrackChange(t.id, 'artist', firstTrack.artist));
                            }
                        }}
                        onApplyCoverToAll={() => {
                            const firstTrackWithCover = parsedTracks.find((t) => t.coverData);
                            const coverToApply = firstTrackWithCover?.coverData ?? null;
                            if (coverToApply) {
                                parsedTracks.forEach((t) => onCoverChange(t.id, coverToApply));
                            }
                        }}
                        onApplyFadeInToAll={() => {
                            parsedTracks.forEach((t) => onTrackChange(t.id, 'fadeIn', true));
                        }}
                        onApplyFadeOutToAll={() => {
                            parsedTracks.forEach((t) => onTrackChange(t.id, 'fadeOut', true));
                        }}
                        disabled={isProcessing}
                    />
                )}

                {hasTracks && (
                    <BatchCutterActions
                        isProcessing={isProcessing}
                        hasFile={hasFile}
                        hasTracks={hasTracks}
                        hasResult={Boolean(result)}
                        onProcess={onProcess}
                        onReset={onReset}
                    />
                )}

                <BatchProgress
                    isProcessing={isProcessing}
                    currentTrack={currentTrack}
                    totalTracks={parsedTracks.length}
                    result={result}
                />

                {error && <StatusAlert message={error} type="error" />}

                {result?.results.every((r) => r.success) && (
                    <StatusAlert
                        message={`Successfully processed ${result.tracks_processed} tracks to: ${result.output_folder}`}
                        type="success"
                    />
                )}
            </VStack>
        </Box>
    );
}
