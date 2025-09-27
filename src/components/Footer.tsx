import { Box ,Flex,Icon,Text} from '@chakra-ui/react'
import { HiOutlinePhone } from 'react-icons/hi';
import { MdEmail } from 'react-icons/md';
import { BiLocationPlus } from 'react-icons/bi';

const Footer = () => {
  return (
    <Box as='footer' borderTop='1px solid' borderColor='gray.200' backgroundColor='gray.50' py={['6', '8']} px={['4', '8']} textAlign={{ base: 'center', md: 'left' }} w='full'>
      <Flex maxW='1340px' mx='auto' direction={{ base: 'column-reverse', md: 'row' }} justifyContent='space-between' alignItems='center' gap={['6', '8']} >
        <Text fontSize="sm" color="gray.500" flexShrink={0}>&copy; {new Date().getFullYear()}, All Rights Reserved</Text>  
        <Box display="flex" flexDirection={{ base: 'column', sm: 'row' }} flexWrap='wrap' justifyContent={{ base: 'center', md: 'flex-start' }} alignItems="center" gap={{ base: '3', sm: '6', lg: '8' }}>
          <Text display="flex" alignItems="center" fontSize='sm'>
            <Icon as={HiOutlinePhone} mr="2" boxSize='4' color='blue.500' />
            <Text as='span' whiteSpace="nowrap" color="gray.600">+2348146933488, +2349038257434</Text>
          </Text>
          <Text display="flex" alignItems="center" fontSize='sm'>
            <Icon as={MdEmail} mr="2" boxSize='4' color='blue.500' />
            <Box as='span' display='flex' gap='2'>
              <Text as='a' href='mailto:addypearl09@gmail.com' display='block'>addypearl09@gmail.com</Text>
              <Text as='a' href='mailto:tubiobaloluwa@gmail.com' display='block'>tubiobaloluwa@gmail.com</Text>
            </Box>
          </Text>
          <Text display="flex" alignItems="center" fontSize='sm'>
            <Icon as={BiLocationPlus} mr="2" boxSize='4' color='blue.500' />
            <Text as='span'>Bode Edun Estate, Lagos Nigeria</Text>
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}

export default Footer
