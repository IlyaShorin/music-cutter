import { invoke } from '@tauri-apps/api/core';
import type { MetadataInput, MetadataOutput } from '../types/metadata';

export async function getAudioMetadata(filePath: string): Promise<MetadataOutput> {
    return await invoke<MetadataOutput>('get_audio_metadata', { filePath });
}

export async function setAudioMetadata(input: MetadataInput): Promise<void> {
    await invoke('set_audio_metadata', { input });
}
