import type { ParsedTrack } from '../types/batch';

const TRACK_LINE_REGEX = /^(\d{1,2}):(\d{2})\s+(.*)$/;

export function parseTimecode(timeStr: string): number {
    const parts = timeStr.split(':').map(Number);

    if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
    }
    if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }

    throw new Error(`Invalid timecode format: ${timeStr}`);
}

export function formatSecondsToTimecode(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function parseTracklist(input: string, fileDuration: number): ParsedTrack[] {
    const lines = input.trim().split('\n');
    const tracks: ParsedTrack[] = [];
    let trackIndex = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (!line) continue;

        const match = line.match(TRACK_LINE_REGEX);
        if (!match) continue;

        const [, minutesStr, secondsStr, title] = match;
        const startTime = parseInt(minutesStr, 10) * 60 + parseInt(secondsStr, 10);

        let endTime: number | null = null;

        const nextTrackIndex = i + 1;
        for (let j = nextTrackIndex; j < lines.length; j++) {
            const nextLine = lines[j].trim();
            if (!nextLine) continue;

            const nextMatch = nextLine.match(TRACK_LINE_REGEX);
            if (nextMatch) {
                const nextMinutes = parseInt(nextMatch[1], 10);
                const nextSeconds = parseInt(nextMatch[2], 10);
                endTime = nextMinutes * 60 + nextSeconds;
                break;
            }
        }

        if (endTime === null) {
            endTime = fileDuration;
        }

        const cleanTitle = title.trim();

        tracks.push({
            id: `${trackIndex}-${Date.now()}-${Math.random()}`,
            index: trackIndex,
            startTime,
            endTime,
            title: cleanTitle,
            artist: '',
            coverData: null,
            status: 'pending',
            fadeIn: false,
            fadeOut: false,
        });

        trackIndex++;
    }

    return tracks;
}

export function buildDefaultArtist(fileName: string): string {
    return fileName.replace(/\.(mp3|wav|m4a|flac)$/i, '');
}
