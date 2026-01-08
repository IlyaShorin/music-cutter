import { Text, Grid } from '@chakra-ui/react';

export function TrackListHeader() {
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
            <Text>#</Text>
            <Text>Time</Text>
            <Text>Title</Text>
            <Text>Artist</Text>
            <Text>Cover</Text>
            <Text />
            <Text />
        </Grid>
    );
}
