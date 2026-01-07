export interface MetadataInput {
    file_path: string;
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
    cover_image_data?: string;
    comment?: string;
}

export interface MetadataOutput {
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
    is_compilation: boolean;
    cover_image_data?: string;
    comment?: string;
}

export type MetadataStatus = 'idle' | 'reading' | 'writing' | 'success' | 'error';
