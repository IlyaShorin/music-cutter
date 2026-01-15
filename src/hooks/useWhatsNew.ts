import { useState, useEffect } from 'react';
import { getAppVersion } from '@/api/commands';
import { getPendingUpdate, clearPendingUpdate } from './useUpdater';

const LAST_VIEWED_VERSION_KEY = 'music-cutter-last-viewed-version';
const RELEASE_NOTES_KEY = 'music-cutter-release-notes';

async function fetchReleaseNotesFromGitHub(version: string): Promise<string> {
    try {
        console.log('[WhatsNew] Fetching release notes for version:', version);
        const response = await fetch(`https://api.github.com/repos/IlyaShorin/music-cutter/releases/tags/v${version}`);
        if (!response.ok) {
            console.error('[WhatsNew] GitHub API response not OK:', response.status, response.statusText);
            return '';
        }
        const data = await response.json();
        console.log('[WhatsNew] GitHub response body length:', data.body?.length || 0);
        return data.body || '';
    } catch (error) {
        console.error('[WhatsNew] Failed to fetch release notes:', error);
        return '';
    }
}

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
                const savedReleaseNotes = localStorage.getItem(RELEASE_NOTES_KEY);

                if (pendingUpdate) {
                    const notes = await fetchReleaseNotesFromGitHub(pendingUpdate.version);
                    if (notes) {
                        setReleaseNotes(notes);
                        localStorage.setItem(RELEASE_NOTES_KEY, notes);
                        setShowWhatsNew(true);
                    }
                } else if (savedReleaseNotes && lastViewedVersion && lastViewedVersion !== version) {
                    if (savedReleaseNotes.trim().length > 0) {
                        setReleaseNotes(savedReleaseNotes);
                        setShowWhatsNew(true);
                    }
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
        localStorage.removeItem(RELEASE_NOTES_KEY);
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
