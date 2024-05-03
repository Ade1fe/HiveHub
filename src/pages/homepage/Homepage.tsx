import { Box } from '@chakra-ui/react';
import { AdvertContainer, Footer, SideContainer, TabContainer } from '../../components';

const Homepage = () => {
  return (
    <Box>
      <AdvertContainer />

      <Box className="" maxW='1340px' mx='auto' mt='20px' display={['flex']} gap='20px'>
      <Box className="" w={['65%']} >
        <TabContainer />
      </Box>

      <Box className="" w={['35%']}>
        <SideContainer />
      </Box>
      </Box>
      
      <Footer />
    </Box>
  );
}

export default Homepage;
