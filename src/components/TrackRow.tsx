import { Box, Text, Grid } from '@chakra-ui/react';
import { TextInput } from './ui/TextInput';
import { CoverUploadCompact } from './CoverUploadCompact';
import type { ParsedTrack } from '../types/batch';
import { formatSecondsToTimecode } from '../utils/tracklist';

interface TrackRowProps {
    track: ParsedTrack;
    onTrackChange: (id: string, field: keyof ParsedTrack, value: string | boolean) => void;
    onCoverChange: (id: string, coverData: string) => void;
    onTrackDelete?: (id: string) => void;
    disabled?: boolean;
}

export function TrackRow({
    track,
    onTrackChange,
    onCoverChange,
    onTrackDelete,
    disabled,
}: TrackRowProps) {
    const handleCoverChange = (data: string | null) => {
        if (data !== null) {
            onCoverChange(track.id, data);
        }
    };

    const isDisabled = disabled ?? false;

    return (
        <Grid
            templateColumns="40px 70px 1fr 1fr 40px 40px 40px"
            gap={2}
            p={3}
            borderBottomWidth="1px"
            _last={{ borderBottomWidth: 0 }}
            alignItems="center"
        >
            <Text fontSize="xs" color="fg.muted">
                {track.index + 1}
            </Text>
            <Text fontSize="xs" fontFamily="mono">
                {formatSecondsToTimecode(track.startTime)}
            </Text>
            <TextInput
                value={track.title}
                onChange={(v) => onTrackChange(track.id, 'title', v)}
                disabled={isDisabled}
            />
            <TextInput
                value={track.artist}
                onChange={(v) => onTrackChange(track.id, 'artist', v)}
                disabled={isDisabled}
                placeholder="Artist"
            />
            <CoverUploadCompact
                coverData={track.coverData}
                onCoverChange={handleCoverChange}
                disabled={isDisabled}
            />
            {track.coverData && (
                <Box
                    as="button"
                    fontSize="xs"
                    color="fg.critical"
                    onClick={() => onCoverChange(track.id, '')}
                    cursor={isDisabled ? 'not-allowed' : 'pointer'}
                    opacity={isDisabled ? 0.5 : 1}
                >
                    ✕
                </Box>
            )}
            {onTrackDelete && (
                <Box
                    as="button"
                    fontSize="sm"
                    color="fg.critical"
                    onClick={() => onTrackDelete(track.id)}
                    cursor={isDisabled ? 'not-allowed' : 'pointer'}
                    opacity={isDisabled ? 0.5 : 1}
                >
                    🗑
                </Box>
            )}
        </Grid>
    );
}
