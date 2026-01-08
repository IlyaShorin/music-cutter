use std::path::Path;
use zip::ZipArchive;
use std::fs::File;

pub fn extract_zip(zip_path: &Path, dest_dir: &Path) -> Result<(), String> {
    let zip_file = File::open(zip_path)
        .map_err(|e| format!("Failed to open zip file: {}", e))?;

    let mut archive = ZipArchive::new(zip_file)
        .map_err(|e| format!("Failed to read zip archive: {}", e))?;

    if cfg!(target_os = "windows") {
        extract_zip_windows(&mut archive, dest_dir)?;
    } else {
        extract_zip_flat(&mut archive, dest_dir)?;
    }

    Ok(())
}

fn extract_zip_windows(archive: &mut ZipArchive<File>, dest_dir: &Path) -> Result<(), String> {
    for i in 0..archive.len() {
        let mut file = archive.by_index(i)
            .map_err(|e| format!("Failed to get file {}: {}", i, e))?;

        let entry_path = file.mangled_name();

        if entry_path.is_dir() {
            continue;
        }

        let file_name = entry_path.file_name()
            .ok_or("Invalid file name in archive")?;

        let ffmpeg_bin = "ffmpeg.exe";
        let ffprobe_bin = "ffprobe.exe";

        if file_name == ffmpeg_bin || file_name == ffprobe_bin {
            let out_path = dest_dir.join(file_name);

            let mut outfile = File::create(&out_path)
                .map_err(|e| format!("Failed to create file {}: {}", out_path.display(), e))?;

            std::io::copy(&mut file, &mut outfile)
                .map_err(|e| format!("Failed to extract file: {}", e))?;
        }
    }

    Ok(())
}

fn extract_zip_flat(archive: &mut ZipArchive<File>, dest_dir: &Path) -> Result<(), String> {
    for i in 0..archive.len() {
        let mut file = archive.by_index(i)
            .map_err(|e| format!("Failed to get file {}: {}", i, e))?;

        let path = dest_dir.join(file.mangled_name().file_name()
            .ok_or("Invalid file name in archive")?);

        if file.mangled_name().is_dir() {
            continue;
        }

        if file.is_file() {
            if let Some(parent) = path.parent() {
                std::fs::create_dir_all(parent)
                    .map_err(|e| format!("Failed to create directory: {}", e))?;
            }

            let mut outfile = File::create(&path)
                .map_err(|e| format!("Failed to create file {}: {}", path.display(), e))?;

            std::io::copy(&mut file, &mut outfile)
                .map_err(|e| format!("Failed to extract file: {}", e))?;

            #[cfg(unix)]
            {
                use std::os::unix::fs::PermissionsExt;
                if let Some(mode) = file.unix_mode() {
                    let mut perms = std::fs::metadata(&path)
                        .map_err(|e| format!("Failed to get permissions: {}", e))?
                        .permissions();
                    perms.set_mode(mode);
                    std::fs::set_permissions(&path, perms)
                        .map_err(|e| format!("Failed to set permissions: {}", e))?;
                }
            }
        }
    }

    Ok(())
}
