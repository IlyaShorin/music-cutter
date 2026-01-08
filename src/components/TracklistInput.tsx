import { Box, Text, Textarea, HStack } from '@chakra-ui/react';
import { Button } from './ui/Button';
import { useTypedTranslation } from '@/i18n';

interface TracklistInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    example?: string;
}

const EXAMPLE_TRACKLIST = `1:46 (Intro)
2:15 Без тебя
3:40 (Желают всего хорошего)
4:35 Афтерпати
8:00 Локд Клап`;

export function TracklistInput({ value, onChange, disabled, example = EXAMPLE_TRACKLIST }: TracklistInputProps) {
    const { t } = useTypedTranslation();

    function handleLoadExample() {
        onChange(example);
    }

    function handleClear() {
        onChange('');
    }

    const lineCount = value ? value.split('\n').length : 0;
    const getLineText = (count: number): string => {
        if (count === 1) {
            return `${count} ${t('common.line')}`;
        }
        return `${count} ${t('common.lines')}`;
    };

    const getLineTextRu = (count: number): string => {
        const lastTwo = count % 100;
        const lastOne = count % 10;
        if (lastTwo >= 11 && lastTwo <= 19) {
            return `${count} ${t('common.line_5')}`;
        }
        if (lastOne === 1) {
            return `${count} ${t('common.line_1')}`;
        }
        if (lastOne >= 2 && lastOne <= 4) {
            return `${count} ${t('common.line_2')}`;
        }
        return `${count} ${t('common.line_5')}`;
    };

    const lineText = lineCount === 0 ? '' : (t('common.language') === 'Язык'
        ? getLineTextRu(lineCount)
        : getLineText(lineCount));

    return (
        <Box width="100%">
            <HStack justify="space-between" mb={2}>
                <Text fontSize="sm" fontWeight="medium" color="fg.muted">
                    {t('batchCutter.tracklistLabel')}
                </Text>
                <HStack gap={2}>
                    {!value && (
                        <Button
                            variant="ghost"
                            size="sm"
                            colorPalette="blue"
                            onClick={handleLoadExample}
                            disabled={disabled}
                        >
                            {t('batchCutter.loadExample')}
                        </Button>
                    )}
                    {value && (
                        <Button
                            variant="ghost"
                            size="sm"
                            colorPalette="red"
                            onClick={handleClear}
                            disabled={disabled}
                        >
                            {t('common.clear')}
                        </Button>
                    )}
                </HStack>
            </HStack>
            <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={t('batchCutter.tracklistPlaceholder')}
                disabled={disabled}
                rows={8}
                fontFamily="mono"
                fontSize="sm"
                resize="vertical"
            />
            {value && (
                <Text fontSize="xs" color="fg.muted" mt={1}>
                    {lineText}
                </Text>
            )}
        </Box>
    );
}
