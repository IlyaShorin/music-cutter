export interface AudioInput {
    file_path: string;
    start_time: string;
    end_time: string;
    output_path: string;
    title?: string;
    artist?: string;
    album?: string;
    album_artist?: string;
    composer?: string;
    genre?: string;
    year?: number;
    track_number?: number;
    total_tracks?: number;
    disc_number?: number;
    total_discs?: number;
    is_compilation?: boolean;
    comment?: string;
    cover_image_data?: string;
    fade_in?: boolean;
    fade_out?: boolean;
}

export interface AudioOutput {
    output_path: string;
    duration_seconds: number;
}

export interface TimecodeInput {
    hours: string;
    minutes: string;
    seconds: string;
}

export type CutStatus = 'idle' | 'cutting' | 'success' | 'error';
