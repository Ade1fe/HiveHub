
import { Box, Heading, Text, Button, Image } from '@chakra-ui/react';

const SideContainer = () => {
  return (
    <Box mt={['2rem']}>
      
      <Box w={['fit-content', "300px"]} p='1rem' bg='blue.200'>
      <Heading as="h2" size="md" mb="4">Writing on Medium</Heading>
        <Text>New writer FAQ</Text>
        <Text>Expert writing advice</Text>
        <Text>Grow your readership</Text>
        <Text>Start writing</Text>
      </Box>
      <WhoToFollow />
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

export default SideContainer;
