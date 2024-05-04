
import { Box, Heading, Text, Button, Image, Card } from '@chakra-ui/react';

const SideContainer = () => {
  return (
    <Box mt={['2rem']}>
      
      <Card w={['fit-content', "300px"]} p='1rem' bg='blue.200'>
        <Heading as="h2" size="md" mb="4">Trending Fashion</Heading>
        <Text>Latest fashion tips</Text>
        <Text>Hottest trends</Text>
        <Text>Seasonal styles</Text>
        <Text>Get inspired!</Text>
      </Card>
      <WhoToFollow />
      <SportsSideContainer />
      <GossipSideContainer />
    </Box>
  );
};

const WhoToFollow = () => {
  return (
    <Box mt={['2rem']}>
      <Heading as="h2" size="md" mb='2'>Who to follow</Heading>
      <Box mb="4" display={['flex']} gap='10px' alignItems='center'>
        <Image boxSize='50px' borderRadius='50%' src='https://images5.alphacoders.com/810/thumbbig-810547.webp' />
        <div className="">
        <Text fontSize="lg" fontWeight="bold">Alex Mathers</Text>
        <Text>
          Helping you develop mental strength and write better. Regular tips: <a href="https://www.untetheredmind.co/">https://www.untetheredmind.co/</a>
        </Text>
        </div>
        <Button borderRadius='100px' w="150px" colorScheme="white" color='black' border='1px' borderColor='red.600'>Follow</Button>
      </Box>
      <Box mb="4" display={['flex']} gap='10px' alignItems='center'>
        <Image boxSize='50px' borderRadius='50%' src='https://images5.alphacoders.com/810/thumbbig-810547.webp' />
        <div className="">
        <Text fontSize="lg" fontWeight="bold">Alex Mathers</Text>
        <Text>
          Helping you develop mental strength and write better. Regular tips: <a href="https://www.untetheredmind.co/">https://www.untetheredmind.co/</a>
        </Text>
        </div>
        <Button borderRadius='100px' w="150px" colorScheme="white" color='black' border='1px' borderColor='red.600'>Follow</Button>
      </Box>
      <Box mb="4" display={['flex']} gap='10px' alignItems='center'>
        <Image boxSize='50px' borderRadius='50%' src='https://images5.alphacoders.com/810/thumbbig-810547.webp' />
        <div className="">
        <Text fontSize="lg" fontWeight="bold">Alex Mathers</Text>
        <Text>
          Helping you develop mental strength and write better. Regular tips: <a href="https://www.untetheredmind.co/">https://www.untetheredmind.co/</a>
        </Text>
        </div>
        <Button borderRadius='100px' w="150px" colorScheme="white" color='black' border='1px' borderColor='red.600'>Follow</Button>
      </Box>
    </Box>
  );
};



const SportsSideContainer = () => {
  return (
    <Card mt={['2rem']}  w={['fit-content', "300px"]} >
      <Card p='1rem' bg='green.200'>
        <Heading as="h2" size="md" mb="4">Sports Highlights</Heading>
        <Text>Latest match updates</Text>
        <Text>Player performances</Text>
        <Text>Upcoming fixtures</Text>
        <Text>Stay ahead in the game!</Text>
      </Card>
    </Card>
  );
};


const GossipSideContainer = () => {
  return (
    <Card mt={['2rem']}  w={['fit-content', "300px"]} >
    <Card p='1rem' bg='pink.200'>
      <Heading as="h2" size="md" mb="4">Entertainment Gossip</Heading>
      <Text>Celebrity news</Text>
      <Text>Hollywood rumors</Text>
      <Text>Red carpet events</Text>
      <Text>Stay updated on the buzz!</Text>
    </Card>
  </Card>
  );
};

export default SideContainer;
