import { Text, Grid } from '@chakra-ui/react';
import { useTypedTranslation } from '@/i18n';

export function TrackListHeader() {
    const { t } = useTypedTranslation();

    return (
        <Grid
            templateColumns="40px 70px 1fr 1fr 40px 40px 40px"
            gap={2}
            p={3}
            bg="bg.subtle"
            fontWeight="medium"
            fontSize="xs"
            position="sticky"
            top={0}
            zIndex={1}
            alignItems="center"
        >
            <Text>{t('batchCutter.headers.number')}</Text>
            <Text>{t('batchCutter.headers.time')}</Text>
            <Text>{t('batchCutter.headers.title')}</Text>
            <Text>{t('batchCutter.headers.artist')}</Text>
            <Text>{t('batchCutter.headers.cover')}</Text>
            <Text />
            <Text />
        </Grid>
    );
}
