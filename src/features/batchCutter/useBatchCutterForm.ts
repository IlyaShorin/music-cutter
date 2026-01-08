import { useForm } from 'react-hook-form';

export interface BatchCutterForm {
    sourceFilePath: string;
    rawTracklist: string;
    baseOutputFolder: string;
    defaultArtist: string;
    applyArtistToAll: boolean;
    applyCoverToAll: boolean;
}

export function useBatchCutterForm() {
    const form = useForm<BatchCutterForm>({
        defaultValues: {
            sourceFilePath: '',
            rawTracklist: '',
            baseOutputFolder: '',
            defaultArtist: '',
            applyArtistToAll: false,
            applyCoverToAll: false,
        },
        mode: 'onTouched',
    });

    return form;
}
