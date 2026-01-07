use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct AudioInput {
    pub file_path: String,
    pub start_time: String,
    pub end_time: String,
    pub output_path: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct AudioOutput {
    pub output_path: String,
    pub duration_seconds: u64,
}
