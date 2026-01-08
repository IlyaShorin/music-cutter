export type FFmpegSource = 'System' | 'Bundled';

export interface FFmpegStatus {
    installed: boolean;
    source: FFmpegSource;
}

export interface FFmpegConfig {
    ffmpeg_path: string | null;
    ffprobe_path: string | null;
    source: FFmpegSource;
}

export interface DownloadProgress {
    current: number;
    total: number;
    percentage: number;
}
