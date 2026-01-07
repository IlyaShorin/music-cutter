export const TIMECODE_REGEX = /^(?:[0-9]{1,2}):(?:[0-9]{1,2}):(?:[0-9]{1,2})$/;

export function formatTimecode(hours: string, minutes: string, seconds: string): string {
    const h = hours.padStart(2, '0');
    const m = minutes.padStart(2, '0');
    const s = seconds.padStart(2, '0');
    return `${h}:${m}:${s}`;
}

export function parseTimecode(input: string): { hours: string; minutes: string; seconds: string } | null {
    if (!TIMECODE_REGEX.test(input)) {
        return null;
    }

    const [hours, minutes, seconds] = input.split(':');
    return { hours, minutes, seconds };
}

export function validateTimefield(value: string, max: number): boolean {
    const num = Number.parseInt(value, 10);
    if (Number.isNaN(num)) {
        return false;
    }
    return num >= 0 && num <= max;
}

export function timecodeToSeconds(hours: string, minutes: string, seconds: string): number {
    const h = Number.parseInt(hours, 10) || 0;
    const m = Number.parseInt(minutes, 10) || 0;
    const s = Number.parseInt(seconds, 10) || 0;
    return h * 3600 + m * 60 + s;
}
