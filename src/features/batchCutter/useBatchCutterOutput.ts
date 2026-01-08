import { useCallback } from 'react';
import { selectOutputFolderAs } from '../../api/commands';
import type { UseFormReturn } from 'react-hook-form';
import type { BatchCutterForm } from './useBatchCutterForm';

export function useBatchCutterOutput(
    form: UseFormReturn<BatchCutterForm>
) {
    const { setValue, watch } = form;
    const sourceFilePath = watch('sourceFilePath');

    const handleSelectOutputFolder = useCallback(async () => {
        const fileName = sourceFilePath?.split('/').pop()?.replace(/\.(mp3|wav|m4a|flac)$/i, '') || 'output';
        const folderName = `${fileName}_tracks`;
        const path = await selectOutputFolderAs(folderName);
        setValue('baseOutputFolder', path);
    }, [setValue, sourceFilePath]);

    return { handleSelectOutputFolder };
}
