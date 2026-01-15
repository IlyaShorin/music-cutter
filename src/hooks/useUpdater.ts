import { useState, useEffect, useCallback, useRef } from 'react';
import { checkForUpdates, downloadAndInstallUpdate, relaunchApp, type UpdateInfo } from '@/api/updater';

const PENDING_UPDATE_KEY = 'music-cutter-pending-update';

interface UseUpdaterResult {
    updateInfo: UpdateInfo | null;
    isUpdateAvailable: boolean;
    isDownloading: boolean;
    downloadProgress: { downloaded: number; total: number } | null;
    error: string | null;
    installUpdate: () => Promise<void>;
    skipUpdate: () => void;
}

export function useUpdater(checkOnMount = true): UseUpdaterResult {
    const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState<{ downloaded: number; total: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const isInstallingRef = useRef(false);

    const installUpdate = useCallback(async () => {
        if (!updateInfo || isInstallingRef.current) return;

        isInstallingRef.current = true;

        try {
            setError(null);
            setIsDownloading(true);
            setDownloadProgress({ downloaded: 0, total: 0 });

            await downloadAndInstallUpdate((progress) => {
                setDownloadProgress(progress);
            });

            localStorage.setItem(PENDING_UPDATE_KEY, JSON.stringify(updateInfo));
            setIsDownloading(false);
            await relaunchApp();
        } catch (e) {
            setIsDownloading(false);
            setError(e instanceof Error ? e.message : 'Failed to install update');
        } finally {
            isInstallingRef.current = false;
        }
    }, [updateInfo]);

    const skipUpdate = useCallback(() => {
        setUpdateInfo(null);
        setError(null);
    }, []);

    useEffect(() => {
        if (!checkOnMount) return;

        async function check() {
            try {
                setError(null);
                const info = await checkForUpdates();
                setUpdateInfo(info);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Failed to check for updates');
            }
        }

        check();
    }, []);

    return {
        updateInfo,
        isUpdateAvailable: updateInfo !== null,
        isDownloading,
        downloadProgress,
        error,
        installUpdate,
        skipUpdate,
    };
}

export function getPendingUpdate(): UpdateInfo | null {
    const pending = localStorage.getItem(PENDING_UPDATE_KEY);
    if (!pending) return null;

    try {
        return JSON.parse(pending) as UpdateInfo;
    } catch (error) {
        console.error('Failed to parse pending update:', error);
        return null;
    }
}

export function clearPendingUpdate(): void {
    localStorage.removeItem(PENDING_UPDATE_KEY);
}
