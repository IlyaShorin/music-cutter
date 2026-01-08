import { useRef, ChangeEventHandler, useCallback } from 'react';

export function useCoverUpload(onCoverChange: (data: string | null) => void) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            onCoverChange(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleRemove = useCallback(() => {
        onCoverChange(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }, [onCoverChange]);

    const handleClick = useCallback(() => {
        inputRef.current?.click();
    }, []);

    return {
        inputRef,
        handleFileChange,
        handleRemove,
        handleClick,
    };
}
