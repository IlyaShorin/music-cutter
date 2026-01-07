import {
    Grid,
    Checkbox,
    Text,
    Box,
} from '@chakra-ui/react';
import { MetadataField } from '../../components/MetadataField';
import { CoverUpload } from '../../components/CoverUpload';

interface MetadataFormProps {
    title: string;
    artist: string;
    album: string;
    albumArtist: string;
    composer: string;
    genre: string;
    year: string;
    trackNumber: string;
    discNumber: string;
    isCompilation: boolean;
    comment: string;
    coverData: string | null;
    onFieldChange: (field: string, value: string | boolean) => void;
    onCoverChange: (data: string | null) => void;
}

export function MetadataForm({
    title,
    artist,
    album,
    albumArtist,
    composer,
    genre,
    year,
    trackNumber,
    discNumber,
    isCompilation,
    comment,
    coverData,
    onFieldChange,
    onCoverChange,
}: MetadataFormProps) {
    return (
        <Grid templateColumns="1fr 1fr" gap={4} gapX={6}>
            <MetadataField
                label="Title"
                value={title}
                onChange={(v) => onFieldChange('title', v)}
            />
            <MetadataField
                label="Artist"
                value={artist}
                onChange={(v) => onFieldChange('artist', v)}
            />
            <MetadataField
                label="Album"
                value={album}
                onChange={(v) => onFieldChange('album', v)}
            />
            <MetadataField
                label="Album Artist"
                value={albumArtist}
                onChange={(v) => onFieldChange('albumArtist', v)}
            />
            <MetadataField
                label="Composer"
                value={composer}
                onChange={(v) => onFieldChange('composer', v)}
            />
            <MetadataField
                label="Genre"
                value={genre}
                onChange={(v) => onFieldChange('genre', v)}
            />
            <MetadataField
                label="Year"
                value={year}
                onChange={(v) => onFieldChange('year', v)}
                placeholder="—"
            />
            <MetadataField
                label="Track"
                value={trackNumber}
                onChange={(v) => onFieldChange('trackNumber', v)}
                placeholder="—"
            />
            <MetadataField
                label="Disc"
                value={discNumber}
                onChange={(v) => onFieldChange('discNumber', v)}
                placeholder="—"
            />
            <Checkbox.Root
                checked={isCompilation}
                onCheckedChange={(details) => onFieldChange('isCompilation', details.checked)}
                alignItems="center"
                minHeight="40px"
            >
                <Checkbox.HiddenInput />
                <Checkbox.Control>
                    <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Label>
                    <Text fontSize="sm" color="fg.muted">
                        Compilation
                    </Text>
                </Checkbox.Label>
            </Checkbox.Root>
            <MetadataField
                label="Comment"
                value={comment}
                onChange={(v) => onFieldChange('comment', v)}
                gridColumn="1 / -1"
            />
            <Box gridColumn="1 / -1">
                <CoverUpload
                    coverData={coverData}
                    onCoverChange={onCoverChange}
                />
            </Box>
        </Grid>
    );
}
