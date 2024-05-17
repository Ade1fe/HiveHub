import { Box } from '@chakra-ui/react';
import { AdvertContainer, SideContainer, TabContainer } from '../../components';
import { MainLayout } from '..';

const Homepage = () => {
  
  return (
    <MainLayout>
      <AdvertContainer />

      <Box className="" maxW='1340px' mx='auto' mt='20px' display={['flex']} gap='20px'>
      <Box className="" w={['65%']} >
        <TabContainer />
      </Box>

      <Box className="" w={['35%']}>
        <SideContainer />
      </Box>
      </Box>
    </MainLayout>
  );
}

export default Homepage;
