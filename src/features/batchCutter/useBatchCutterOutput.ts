import { useCallback } from 'react';
import { selectOutputFolderAs } from '../../api/commands';
import type { UseFormReturn } from 'react-hook-form';
import type { BatchCutterForm } from './useBatchCutterForm';

function extractFolderNameFromPath(fullPath: string): string {
    const separator = fullPath.includes('\\') ? '\\' : '/';
    return fullPath.split(separator).pop() || '';
}

export function useBatchCutterOutput(
    form: UseFormReturn<BatchCutterForm>
) {
    const { setValue, watch } = form;
    const sourceFilePath = watch('sourceFilePath');

    const handleSelectOutputFolder = useCallback(async () => {
        const fileName = sourceFilePath?.split(/[/\\]/).pop()?.replace(/\.(mp3|wav|m4a|flac)$/i, '') || 'output';
        const folderName = `${fileName}_tracks`;
        const fullPath = await selectOutputFolderAs(folderName);
        const subfolderName = extractFolderNameFromPath(fullPath);
        const separator = fullPath.includes('\\') ? '\\' : '/';
        const basePath = fullPath.substring(0, fullPath.lastIndexOf(separator));
        setValue('baseOutputFolder', basePath);
        setValue('outputSubfolderName', subfolderName);
    }, [setValue, sourceFilePath]);

    return { handleSelectOutputFolder };
}
