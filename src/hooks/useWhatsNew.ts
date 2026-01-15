import { useState, useEffect } from 'react';
import { getAppVersion } from '@/api/commands';
import { getPendingUpdate, clearPendingUpdate } from './useUpdater';

const LAST_VIEWED_VERSION_KEY = 'music-cutter-last-viewed-version';

export function useWhatsNew() {
    const [showWhatsNew, setShowWhatsNew] = useState(false);
    const [currentVersion, setCurrentVersion] = useState<string | null>(null);
    const [releaseNotes, setReleaseNotes] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function checkVersion() {
            try {
                const version = await getAppVersion();
                setCurrentVersion(version);

                const lastViewedVersion = localStorage.getItem(LAST_VIEWED_VERSION_KEY);
                const pendingUpdate = getPendingUpdate();

                if (pendingUpdate) {
                    setReleaseNotes(pendingUpdate.body);
                    setShowWhatsNew(true);
                } else if (lastViewedVersion && lastViewedVersion !== version) {
                    setShowWhatsNew(true);
                }
            } catch (error) {
                console.error('Failed to check version:', error);
                setCurrentVersion(null);
            } finally {
                setIsLoading(false);
            }
        }

        checkVersion();
    }, []);

    const markAsViewed = () => {
        if (currentVersion) {
            localStorage.setItem(LAST_VIEWED_VERSION_KEY, currentVersion);
        }
        clearPendingUpdate();
        setShowWhatsNew(false);
    };

    return {
        showWhatsNew,
        currentVersion,
        releaseNotes,
        isLoading,
        markAsViewed,
    };
}
