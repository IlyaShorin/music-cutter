import { useForm } from 'react-hook-form';

export interface MetadataForm {
    title: string;
    artist: string;
    album: string;
    album_artist: string;
    composer: string;
    genre: string;
    year: string;
    track_number: string;
    disc_number: string;
    is_compilation: boolean;
    comment: string;
}

export const DEFAULT_METADATA_FORM_VALUES: MetadataForm = {
    title: '',
    artist: '',
    album: '',
    album_artist: '',
    composer: '',
    genre: '',
    year: '',
    track_number: '',
    disc_number: '',
    is_compilation: false,
    comment: '',
};

export function useMetadataForm() {
    return useForm<MetadataForm>({
        defaultValues: DEFAULT_METADATA_FORM_VALUES,
        mode: 'onTouched',
    });
}
