import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import type { FFmpegStatus, DownloadProgress } from '../types/ffmpeg';

export async function checkFFmpegStatus(): Promise<FFmpegStatus> {
    return await invoke<FFmpegStatus>('check_ffmpeg_status');
}

export async function downloadAndInstallFFmpeg(onProgress: (progress: number) => void): Promise<void> {
    const unlisten = await listen<DownloadProgress>('ffmpeg-download-progress', (event) => {
        onProgress(event.payload.percentage);
    });

    try {
        await invoke('download_and_install_ffmpeg_command');
    } finally {
        unlisten();
    }
}
