import { Box } from '@chakra-ui/react';
import { AdvertContainer, SideContainer } from '../../components';
import { MainLayout } from '..';
import TabsCard from '../../components/tabs/TabsCard';

const Homepage = () => {
  
  return (
    <MainLayout>
      <AdvertContainer />

      <Box maxW='1340px' mx='auto' mt='20px' display='flex' flexDirection={['column', 'row']} gap='20px'>
        <Box flex={1} w={['100%', '100%', '65%']} >
          <TabsCard />
        </Box>

        <Box flex={1} display={['none', 'none', 'flex']} w={['100%', '100%', '35%']} >
          <SideContainer />
        </Box>
      </Box>
    </MainLayout>
  );
}

export default Homepage;
