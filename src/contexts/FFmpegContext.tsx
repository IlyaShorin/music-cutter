import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { checkFFmpegStatus, downloadAndInstallFFmpeg } from '../api/ffmpeg';
import type { FFmpegStatus } from '../types/ffmpeg';

interface FFmpegContextValue {
    status: FFmpegStatus | null;
    isLoading: boolean;
    isDownloading: boolean;
    downloadProgress: number;
    check: () => Promise<void>;
    download: () => Promise<void>;
}

const FFmpegContext = createContext<FFmpegContextValue | null>(null);

const FALLBACK_STATUS: FFmpegStatus = {
    installed: false,
    source: 'Bundled',
};

export function FFmpegProvider({ children }: { children: ReactNode }) {
    const [status, setStatus] = useState<FFmpegStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [checkTrigger, setCheckTrigger] = useState(0);

    const check = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await checkFFmpegStatus();
            setStatus(result);
        } catch (e) {
            console.error('Failed to check FFmpeg status:', e);
            setStatus(FALLBACK_STATUS);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const download = useCallback(async () => {
        setIsDownloading(true);
        setDownloadProgress(0);
        try {
            await downloadAndInstallFFmpeg((progress) => {
                setDownloadProgress(progress);
            });
            setCheckTrigger(prev => prev + 1);
        } finally {
            setIsDownloading(false);
        }
    }, []);

    useEffect(() => {
        check();
    }, [check, checkTrigger]);

    return (
        <FFmpegContext.Provider value={{ status, isLoading, isDownloading, downloadProgress, check, download }}>
            {children}
        </FFmpegContext.Provider>
    );
}

export function useFFmpeg(): FFmpegContextValue {
    const context = useContext(FFmpegContext);
    if (!context) {
        throw new Error('useFFmpeg must be used within FFmpegProvider');
    }
    return context;
}
