import { Box, Text, HStack } from '@chakra-ui/react';
import { TextInput } from './ui/TextInput';
import { CoverUpload } from './CoverUpload';

interface BatchMetadataPanelProps {
    defaultArtist: string;
    applyArtistToAll: boolean;
    onDefaultArtistChange: (value: string) => void;
    onApplyArtistToAllChange: (checked: boolean) => void;
    defaultCover: string | null;
    applyCoverToAll: boolean;
    onDefaultCoverChange: (value: string | null) => void;
    onApplyCoverToAllChange: (checked: boolean) => void;
    disabled?: boolean;
}

function Checkbox({ checked, onChange, disabled, label }: { checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean; label: string }) {
    return (
        <HStack gap={2} cursor={disabled ? 'not-allowed' : 'pointer'} onClick={() => !disabled && onChange(!checked)}>
            <Box
                width={4}
                height={4}
                borderRadius="sm"
                borderWidth="1px"
                borderColor={checked ? 'bg.emphasized' : 'border.default'}
                bg={checked ? 'bg.emphasized' : 'transparent'}
                display="flex"
                alignItems="center"
                justifyContent="center"
                transition="all 0.2s"
            >
                {checked && (
                    <svg
                        width={10}
                        height={10}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                )}
            </Box>
            <Text fontSize="sm" color="fg.muted" userSelect="none">
                {label}
            </Text>
        </HStack>
    );
}

export function BatchMetadataPanel({
    defaultArtist,
    applyArtistToAll,
    onDefaultArtistChange,
    onApplyArtistToAllChange,
    defaultCover,
    applyCoverToAll,
    onDefaultCoverChange,
    onApplyCoverToAllChange,
    disabled,
}: BatchMetadataPanelProps) {
    return (
        <Box width="100%">
            <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb={3}>
                Apply to all tracks
            </Text>

            <HStack gap={6} alignItems="flex-start">
                <Box flex={1}>
                    <Checkbox
                        checked={applyArtistToAll}
                        onChange={onApplyArtistToAllChange}
                        disabled={disabled}
                        label="Artist"
                    />
                    <Box mt={2}>
                        <TextInput
                            value={defaultArtist}
                            onChange={onDefaultArtistChange}
                            disabled={disabled || !applyArtistToAll}
                            placeholder="Artist name"
                        />
                    </Box>
                </Box>

                <Box flex={1}>
                    <Checkbox
                        checked={applyCoverToAll}
                        onChange={onApplyCoverToAllChange}
                        disabled={disabled}
                        label="Cover"
                    />
                    <CoverUpload
                        coverData={applyCoverToAll ? defaultCover : null}
                        onCoverChange={onDefaultCoverChange}
                    />
                </Box>
            </HStack>
        </Box>
    );
}
