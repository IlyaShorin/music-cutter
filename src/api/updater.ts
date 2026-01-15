import { check, type Update } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

export interface UpdateInfo {
    version: string;
    date: string;
    body: string;
}

let cachedUpdate: Update | null = null;

export async function checkForUpdates(): Promise<UpdateInfo | null> {
    try {
        const update = await check();

        if (!update) {
            cachedUpdate = null;
            return null;
        }

        cachedUpdate = update;

        return {
            version: update.version,
            date: update.date ?? '',
            body: update.body ?? '',
        };
    } catch (error) {
        console.error('[Updater] Failed to check for updates:', error);
        cachedUpdate = null;
        return null;
    }
}

export async function downloadAndInstallUpdate(
    onProgress?: (progress: { downloaded: number; total: number }) => void
): Promise<void> {
    const update = cachedUpdate ?? await check();

    if (!update) {
        throw new Error('No update available');
    }

    let downloaded = 0;
    let contentLength = 0;

    await update.downloadAndInstall((event) => {
        switch (event.event) {
            case 'Started':
                contentLength = event.data.contentLength ?? 0;
                onProgress?.({ downloaded: 0, total: contentLength });
                break;
            case 'Progress':
                downloaded += event.data.chunkLength;
                onProgress?.({ downloaded, total: contentLength });
                break;
            case 'Finished':
                onProgress?.({ downloaded: contentLength, total: contentLength });
                break;
        }
    });
}

export async function relaunchApp(): Promise<void> {
    await relaunch();
}
