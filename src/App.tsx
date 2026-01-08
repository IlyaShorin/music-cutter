import { Box, Tabs, TabsList, TabsTrigger, TabsContent } from '@chakra-ui/react';
import { AudioCutter } from './features/audioCutter/AudioCutter';
import { BatchCutter } from './features/batchCutter/BatchCutter';

function App() {
    return (
        <Box py={10} px={20}>
            <Tabs.Root defaultValue="single" variant="enclosed" width="100%">
                <TabsList pb={0}>
                    <TabsTrigger value="single">Single Cut</TabsTrigger>
                    <TabsTrigger value="batch">Batch</TabsTrigger>
                </TabsList>
                <TabsContent value="single" p={0}>
                    <AudioCutter />
                </TabsContent>
                <TabsContent value="batch" p={0}>
                    <BatchCutter />
                </TabsContent>
            </Tabs.Root>
        </Box>
    );
}

export default App;
