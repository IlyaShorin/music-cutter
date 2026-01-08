import { invoke } from '@tauri-apps/api/core';
import type { BatchInput, BatchOutput, SingleTrackInput, SingleTrackOutput } from '../types/batch';

export async function getAudioDuration(filePath: string): Promise<string> {
    return await invoke<string>('get_audio_duration_command', { filePath });
}

export async function cutAudioBatch(input: BatchInput): Promise<BatchOutput> {
    return await invoke<BatchOutput>('cut_audio_batch', { input });
}

export async function cutSingleTrack(input: SingleTrackInput): Promise<SingleTrackOutput> {
    return await invoke<SingleTrackOutput>('cut_single_track', { input });
}
