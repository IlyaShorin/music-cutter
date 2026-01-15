# Demucs Integration Plan

## Repository
- **Official repo:** https://github.com/adefossez/demucs
- **Status:** Officially maintained (author not actively working, but repo is alive)
- **Latest:** v4 with Hybrid Transformer architecture

## Installation

```bash
# Basic installation
python3 -m pip install -U demucs

# For MP3 output support
demucs --mp3 --mp3-bitrate 320 input.mp3
```

### Requirements
- Python 3.8+
- For training: `requirements.txt` or `environment-[cpu|cuda].yml`
- Minimal: `requirements_minimal.txt`

## Usage

### Command Line

```bash
# Basic separation
demucs PATH_TO_AUDIO_FILE

# MP3 output with bitrate
demucs --mp3 --mp3-bitrate 320 input.mp3

# Select specific model
demucs -n htdemucs input.mp3

# Two-stems separation (faster)
demucs --two-stems=vocals myfile.mp3
```

### Available Models

| Model | Description |
|-------|-------------|
| `htdemucs` | Default model, best quality |
| `htdemucs_ft` | Fine-tuned version |
| `htdemucs_6s` | 6 sources (adds guitar, piano) |
| `hdemucs_mmi` | Hybrid Demucs v3 baseline |
| `mdx` | MDX challenge model |
| `mdx_extra` | MDX extra model |
| `mdx_q` | MDX quantized |
| `mdx_extra_q` | MDX extra quantized |

### Output Structure

```
separated/
└── demucs/
    └── TRACK_NAME/
        ├── bass.wav
        ├── drums.wav
        ├── other.wav
        └── vocals.wav
```

## Python API Integration

```python
import demucs.separate

# Call programmatically
demucs.separate.main([
    '--mp3',
    '--mp3-bitrate', '320',
    '--two-stems', 'vocals',
    'file.mp3'
])
```

## Tauri Integration Strategy

### Option 1: External Process (Simple)

```rust
use std::process::Command;

#[tauri::command]
async fn separate_stems(input_path: String, output_dir: String) -> Result<String, String> {
    let output = Command::new("demucs")
        .arg("-o")
        .arg(&output_dir)
        .arg("--mp3")
        .arg("--mp3-bitrate")
        .arg("320")
        .arg(&input_path)
        .output()
        .map_err(|e| format!("Failed to execute demucs: {}", e))?;

    if output.status.success() {
        Ok(output_dir)
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}
```

### Option 2: Python via PyO3 (Advanced)

```rust
// src-tauri/Cargo.toml
[dependencies]
pyo3 = { version = "0.20", features = ["auto-initialize"] }

// src-tauri/src/python.rs
use pyo3::prelude::*;
use pyo3::types::PyList;

fn call_demucs(input_path: &str, output_dir: &str) -> PyResult<()> {
    Python::with_gil(|py| {
        let demucs = PyModule::import(py, "demucs.separate")?;
        let args = PyList::new(py, &[
            "-o", output_dir,
            "--mp3",
            "--mp3-bitrate", "320",
            input_path,
        ]);
        demucs.getattr("main")?.call1((args,))?;
        Ok(())
    })
}
```

## Performance Considerations

### Model Selection
- `htdemucs` - Best quality, slower
- `mdx_q` - Quantized, faster
- `--two-stems=vocals` - Much faster (only 2 outputs)

### Hardware Acceleration
- CUDA supported if available
- CPU fallback works but slower

## Use Case: DJ Set Crowd Noise Removal

For removing crowd noise from DJ sets:
1. Use `demucs --two-stems=vocals` to separate vocals from accompaniment
2. The "other" stem may contain crowd noise mixed with ambiance
3. No perfect solution - crowd frequencies overlap with music

## Error Handling

```rust
pub enum DemucsError {
    NotInstalled,
    ExecutionFailed(String),
    InvalidOutput,
    Timeout,
}

impl From<DemucsError> for String {
    fn from(err: DemucsError) -> Self {
        match err {
            DemucsError::NotInstalled => "Demucs not installed".to_string(),
            DemucsError::ExecutionFailed(msg) => format!("Demucs failed: {}", msg),
            DemucsError::InvalidOutput => "Invalid output".to_string(),
            DemucsError::Timeout => "Operation timed out".to_string(),
        }
    }
}
```

## Validation Steps

1. Check if demucs is installed:
   ```bash
   demucs --version
   ```

2. Test with sample file:
   ```bash
   demucs --mp3 test.mp3
   ```

3. Verify output structure exists before returning

## Sources
- https://github.com/adefossez/demucs
- https://github.com/adefossez/demucs (official)
