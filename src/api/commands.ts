import { invoke } from '@tauri-apps/api/core';
import type { AudioInput, AudioOutput } from '../types/audio';

export async function selectAudioFile(): Promise<string> {
    return await invoke<string>('select_audio_file');
}

export async function selectOutputFile(defaultName: string): Promise<string> {
    return await invoke<string>('select_output_file', { defaultName });
}

export async function cutAudioFragment(input: AudioInput): Promise<AudioOutput> {
    return await invoke<AudioOutput>('cut_audio_fragment', { input });
}
