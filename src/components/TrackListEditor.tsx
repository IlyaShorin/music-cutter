import { Box, Text } from '@chakra-ui/react';
import { TrackRow } from './TrackRow';
import { TrackListHeader } from './TrackListHeader';
import { Button } from './ui/Button';
import type { ParsedTrack } from '../types/batch';

interface TrackListEditorProps {
    tracks: ParsedTrack[];
    onTrackChange: (id: string, field: keyof ParsedTrack, value: string | boolean) => void;
    onCoverChange: (id: string, coverData: string) => void;
    onTrackDelete?: (id: string) => void;
    onApplyArtistToAll?: () => void;
    onApplyCoverToAll?: () => void;
    onApplyFadeInToAll?: () => void;
    onApplyFadeOutToAll?: () => void;
    disabled?: boolean;
}

export function TrackListEditor({
    tracks,
    onTrackChange,
    onCoverChange,
    onTrackDelete,
    onApplyArtistToAll,
    onApplyCoverToAll,
    onApplyFadeInToAll,
    onApplyFadeOutToAll,
    disabled,
}: TrackListEditorProps) {
    if (tracks.length === 0) {
        return null;
    }

    return (
        <Box width="100%">
            <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb={2}>
                Parsed Tracks ({tracks.length})
            </Text>
            <Box display="flex" gap={4} alignItems="flex-start">
                <Box
                    borderWidth="1px"
                    borderRadius="md"
                    overflow="hidden"
                    maxHeight="400px"
                    overflowY="auto"
                    flex={1}
                >
                    <TrackListHeader />
                    {tracks.map((track) => (
                        <TrackRow
                            key={track.id}
                            track={track}
                            onTrackChange={onTrackChange}
                            onCoverChange={onCoverChange}
                            onTrackDelete={onTrackDelete}
                            disabled={disabled}
                        />
                    ))}
                </Box>
                {(onApplyArtistToAll || onApplyCoverToAll || onApplyFadeInToAll || onApplyFadeOutToAll) && (
                    <Box display="flex" flexDirection="column" gap={2} paddingTop={3}>
                        {onApplyArtistToAll && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onApplyArtistToAll}
                                disabled={disabled}
                            >
                                Apply Artist to all
                            </Button>
                        )}
                        {onApplyCoverToAll && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onApplyCoverToAll}
                                disabled={disabled}
                            >
                                Apply Cover to all
                            </Button>
                        )}
                        {onApplyFadeInToAll && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onApplyFadeInToAll}
                                disabled={disabled}
                            >
                                Apply Fade In to all
                            </Button>
                        )}
                        {onApplyFadeOutToAll && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onApplyFadeOutToAll}
                                disabled={disabled}
                            >
                                Apply Fade Out to all
                            </Button>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
}
