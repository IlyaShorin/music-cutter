export interface ParsedTrack {
    id: string;
    index: number;
    startTime: number;
    endTime: number | null;
    title: string;
    artist: string;
    coverData: string | null;
    fadeIn: boolean;
    fadeOut: boolean;
    status: 'pending' | 'processing' | 'done' | 'error';
    error?: string;
}

export interface TrackInput {
    start_time: string;
    end_time: string | null;
    title: string;
    artist: string | null;
    cover_data: string | null;
    fade_in?: boolean;
    fade_out?: boolean;
}

export interface BatchInput {
    file_path: string;
    tracks: TrackInput[];
    output_folder: string;
    default_artist: string | null;
}

export interface TrackResult {
    title: string;
    output_path: string;
    duration_seconds: number;
    success: boolean;
    error: string | null;
}

export interface BatchOutput {
    output_folder: string;
    tracks_processed: number;
    tracks_total: number;
    results: TrackResult[];
}

export interface SingleTrackInput {
    file_path: string;
    track: TrackInput;
    output_folder: string;
    default_artist: string | null;
    file_duration_seconds: number | null;
}

export interface SingleTrackOutput {
    result: TrackResult;
}
