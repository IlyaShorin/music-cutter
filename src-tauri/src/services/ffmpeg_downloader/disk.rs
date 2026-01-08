use std::path::Path;

const MIN_DISK_SPACE_MB: u64 = 300;

pub fn check_disk_space(path: &Path) -> Result<(), String> {
    let required_bytes = MIN_DISK_SPACE_MB * 1024 * 1024;

    #[cfg(unix)]
    {
        let check_path = if path.exists() {
            path.to_path_buf()
        } else {
            path.ancestors()
                .find(|p| p.exists())
                .ok_or("Cannot find valid path for disk check")?
                .to_path_buf()
        };

        let path_bytes = check_path.to_str()
            .ok_or("Invalid path")?
            .as_bytes();

        let mut stat: libc::statvfs = unsafe { std::mem::zeroed() };

        unsafe {
            if libc::statvfs(path_bytes.as_ptr() as *const i8, &mut stat) != 0 {
                return Err("Failed to get disk space information".to_string());
            }
        }

        let available = (stat.f_bavail as u64) * stat.f_frsize;

        if available < required_bytes {
            return Err(format!(
                "Insufficient disk space. Required: {} MB, Available: {} MB",
                MIN_DISK_SPACE_MB,
                available / (1024 * 1024)
            ));
        }
    }

    #[cfg(windows)]
    {
        let _ = path;
        let _ = required_bytes;
    }

    Ok(())
}
