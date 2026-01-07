export interface AudioInput {
    file_path: string;
    start_time: string;
    end_time: string;
    output_path: string;
}

export interface AudioOutput {
    output_path: string;
    duration_seconds: number;
}

export interface TimecodeInput {
    hours: string;
    minutes: string;
    seconds: string;
}

export type CutStatus = 'idle' | 'cutting' | 'success' | 'error';
