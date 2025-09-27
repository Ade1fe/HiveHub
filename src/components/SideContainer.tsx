
import { Box, Heading, Text, Button, Image, Card, Stack, Flex } from '@chakra-ui/react';

// Reusable component for the Promotional Cards (Fashion, Sports, Gossip)
const PromoCard = ({ title, tips, colorScheme }: { title: string; tips: string[]; colorScheme: string }) => {
  return (
    <Card 
      p='6' 
      bg={`${colorScheme}.500`} 
      textColor='white' 
      borderRadius='xl' 
      shadow='lg'
    >
      <Heading as="h2" size="md" mb="3" fontWeight="extrabold">{title}</Heading>
      <Stack spacing={1}>
        {tips.map((tip, index) => (
          <Text key={index} fontSize="sm" opacity={0.9}>• {tip}</Text>
        ))}
      </Stack>
    </Card>
  );
};


const WhoToFollow = () => {
  // Mock data for followers
  const followers = [
    { 
      id: 1, 
      name: "Alex Mathers", 
      bio: "Helping you develop mental strength and write better.", 
      link: "https://www.untetheredmind.co/",
      image: 'https://images5.alphacoders.com/810/thumbbig-810547.webp'
    },
    { 
      id: 2, 
      name: "Jane Doe", 
      bio: "Insights on modern web development and design trends.", 
      link: "https://www.untetheredmind.co/",
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBvcnRyYWl0JTIwb2YlMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'
    },
    { 
      id: 3, 
      name: "Chris Evans", 
      bio: "Tips for staying active and fit with busy schedule.", 
      link: "https://www.untetheredmind.co/",
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60'
    },
  ];

  return (
    <Box mt='8'>
      <Heading as="h2" size="md" mb='4' borderBottom="2px solid" borderColor="gray.100" pb="2">Who to follow</Heading>
      
      <Stack spacing={4}>
        {followers.map(follower => (
          <Flex 
            key={follower.id} 
            alignItems='center' 
            justifyContent='space-between' 
            gap='4'
            p='3'
            borderRadius='md'
            _hover={{ bg: 'gray.50' }}
          >
            <Flex alignItems='center' gap='3' flex='1'>
              <Image boxSize='12' borderRadius='full' objectFit="cover" src={follower.image} alt={follower.name} />
              <Box flex='1' minW={0}>
                <Text fontSize="md" fontWeight="bold" noOfLines={1}>{follower.name}</Text>
                <Text fontSize="xs" color="gray.600" noOfLines={1}>
                  {follower.bio}
                </Text>
              </Box>
            </Flex>
            
            <Button 
              size='sm' 
              borderRadius='full' 
              variant='outline'
              colorScheme='blue'
              onClick={(e) => { e.stopPropagation(); console.log(`Following ${follower.name}`); }}
            >
              Follow
            </Button>
          </Flex>
        ))}
      </Stack>
    </Box>
  );
};


const SideContainer = () => {
  return (
    <Box w='100%'>
      <PromoCard 
        title="Trending Fashion" 
        tips={["Latest fashion tips", "Hottest trends", "Seasonal styles", "Get inspired!"]}
        colorScheme="blue" 
      />
      <WhoToFollow />
      <Box mt='8'>
        <PromoCard 
          title="Sports Highlights" 
          tips={["Latest match updates", "Player performances", "Upcoming fixtures", "Stay ahead in the game!"]}
          colorScheme="green" 
        />
      </Box>
      <Box mt='8'>
        <PromoCard 
          title="Entertainment Gossip" 
          tips={["Celebrity news", "Hollywood rumors", "Red carpet events", "Stay updated on the buzz!"]}
          colorScheme="pink" 
        />
      </Box>
    </Box>
  );
};

// const WhoToFollow = () => {
//   return (
//     <Box mt={['2rem']}>
//       <Heading as="h2" size="md" mb='2'>Who to follow</Heading>
//       <Box mb="4" display={['flex']} gap='10px' alignItems='center'>
//         <Image boxSize='50px' borderRadius='50%' src='https://images5.alphacoders.com/810/thumbbig-810547.webp' />
//         <div className="">
//         <Text fontSize="lg" fontWeight="bold">Alex Mathers</Text>
//         <Text>
//           Helping you develop mental strength and write better. Regular tips: <a href="https://www.untetheredmind.co/">https://www.untetheredmind.co/</a>
//         </Text>
//         </div>
//         <Button borderRadius='100px' w="150px" colorScheme="white" color='black' border='1px' borderColor='red.600'>Follow</Button>
//       </Box>
//       <Box mb="4" display={['flex']} gap='10px' alignItems='center'>
//         <Image boxSize='50px' borderRadius='50%' src='https://images5.alphacoders.com/810/thumbbig-810547.webp' />
//         <div className="">
//         <Text fontSize="lg" fontWeight="bold">Alex Mathers</Text>
//         <Text>
//           Helping you develop mental strength and write better. Regular tips: <a href="https://www.untetheredmind.co/">https://www.untetheredmind.co/</a>
//         </Text>
//         </div>
//         <Button borderRadius='100px' w="150px" colorScheme="white" color='black' border='1px' borderColor='red.600'>Follow</Button>
//       </Box>
//       <Box mb="4" display={['flex']} gap='10px' alignItems='center'>
//         <Image boxSize='50px' borderRadius='50%' src='https://images5.alphacoders.com/810/thumbbig-810547.webp' />
//         <div className="">
//         <Text fontSize="lg" fontWeight="bold">Alex Mathers</Text>
//         <Text>
//           Helping you develop mental strength and write better. Regular tips: <a href="https://www.untetheredmind.co/">https://www.untetheredmind.co/</a>
//         </Text>
//         </div>
//         <Button borderRadius='100px' w="150px" colorScheme="white" color='black' border='1px' borderColor='red.600'>Follow</Button>
//       </Box>
//     </Box>
//   );
// };



// const SportsSideContainer = () => {
//   return (
//     <Card mt={['2rem']}  w={['fit-content', "300px"]} >
//       <Card p='1rem' bg='green.200'>
//         <Heading as="h2" size="md" mb="4">Sports Highlights</Heading>
//         <Text>Latest match updates</Text>
//         <Text>Player performances</Text>
//         <Text>Upcoming fixtures</Text>
//         <Text>Stay ahead in the game!</Text>
//       </Card>
//     </Card>
//   );
// };


// const GossipSideContainer = () => {
//   return (
//     <Card mt={['2rem']}  w={['fit-content', "300px"]} >
//     <Card p='1rem' bg='pink.200'>
//       <Heading as="h2" size="md" mb="4">Entertainment Gossip</Heading>
//       <Text>Celebrity news</Text>
//       <Text>Hollywood rumors</Text>
//       <Text>Red carpet events</Text>
//       <Text>Stay updated on the buzz!</Text>
//     </Card>
//   </Card>
//   );
// };

export default SideContainer;
