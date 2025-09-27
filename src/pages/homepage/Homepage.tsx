import { Box } from '@chakra-ui/react';
import { AdvertContainer, SideContainer } from '../../components';
import { MainLayout } from '..';
import TabsCard from '../../components/tabs/TabsCard';
import { showToastMessage } from '../../utils/helpers';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Homepage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.toastMessage) {
      const { toastMessage, toastType } = location.state;

      showToastMessage(toastMessage, toastType);

      window.history.replaceState({}, document.title, window.location.pathname);
      
    }
  }, [location]);

  return (
    <MainLayout>
      <AdvertContainer />

      <Box maxW='1340px' mx='auto' mt='40px' px={['4', '6', '8']} display='flex' flexDirection={['column', null, 'row']} gap='8'>
        <Box flex={{ base: '1', lg: '2' }} w={['100%', '100%', '65%']} >
          <TabsCard />
        </Box>

        <Box flex={{ base: '1', lg: '1' }} display={['none', null, 'block']} w={['100%', '100%', '35%']} >
          <SideContainer />
        </Box>
      </Box>
    </MainLayout>
  );
}

export default Homepage;
