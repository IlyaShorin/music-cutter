use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct AudioInput {
    pub file_path: String,
    pub start_time: String,
    pub end_time: String,
    pub output_path: String,
    pub title: Option<String>,
    pub artist: Option<String>,
    pub album: Option<String>,
    pub album_artist: Option<String>,
    pub composer: Option<String>,
    pub genre: Option<String>,
    pub year: Option<u32>,
    pub track_number: Option<u32>,
    pub total_tracks: Option<u32>,
    pub disc_number: Option<u32>,
    pub total_discs: Option<u32>,
    pub is_compilation: Option<bool>,
    pub comment: Option<String>,
    pub cover_image_data: Option<String>,
    pub fade_in: Option<bool>,
    pub fade_out: Option<bool>,
}

#[derive(Debug, Clone, Serialize)]
pub struct AudioOutput {
    pub output_path: String,
    pub duration_seconds: u64,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct TrackInput {
    pub start_time: String,
    pub end_time: Option<String>,
    pub title: String,
    pub artist: Option<String>,
    pub cover_data: Option<String>,
    pub fade_in: Option<bool>,
    pub fade_out: Option<bool>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct BatchInput {
    pub file_path: String,
    pub tracks: Vec<TrackInput>,
    pub output_folder: String,
    pub default_artist: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct TrackResult {
    pub title: String,
    pub output_path: String,
    pub duration_seconds: u64,
    pub success: bool,
    pub error: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct BatchOutput {
    pub output_folder: String,
    pub tracks_processed: usize,
    pub tracks_total: usize,
    pub results: Vec<TrackResult>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct SingleTrackInput {
    pub file_path: String,
    pub track: TrackInput,
    pub output_folder: String,
    pub default_artist: Option<String>,
    pub file_duration_seconds: Option<u64>,
}

#[derive(Debug, Clone, Serialize)]
pub struct SingleTrackOutput {
    pub result: TrackResult,
}
