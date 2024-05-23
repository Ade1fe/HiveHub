import { Box ,Icon,Text} from '@chakra-ui/react'
import { HiOutlinePhone } from 'react-icons/hi';
import { MdEmail } from 'react-icons/md';
import { BiLocationPlus } from 'react-icons/bi';

const Footer = () => {
  return (
    <Box pos='static' mt={['60px', '70px', '80px', '90px']} mx='auto' mb='20px' px={[4,4,4,4,2,8]}  textAlign='center' display={['block','block', 'flex']} gap='4' justifyContent='space-between' alignItems='center' w='full'>
    <Text fontSize="sm" color="gray.500" display={['none', 'none', 'block']}>&copy; 2023 - 2024, All Rights Reserved</Text>
    <Box mt="4" display="flex" flexDirection={["column", 'row']} flexWrap='wrap'  justifyContent={['center']} alignItems="center" gap={['2', '4', '6']}>
      <Text display="flex" alignItems="center" fontSize={['sm']}>
        <Icon as={HiOutlinePhone} mr="2" boxSize='6' color='blue.200' />
        <Text as='span'>+2348146933488, +2349038257434</Text>
      </Text>
      <Text display="flex" alignItems="center">
        <Icon as={MdEmail} mr="2" boxSize='6' color='blue.200' />
        <Text as='span'>addypearl09@gmail.com, tubiobaloluwa@gmail.com</Text>
      </Text>
      <Text display="flex" alignItems="center">
        <Icon as={BiLocationPlus} mr="2" boxSize='6' color='blue.200' />
        <Text as='span'>04 Bode Edun Estate, Lagos Nigeria</Text>
      </Text>
    </Box>
    <Text fontSize="sm" color="gray.500" mt='18' display={['block', 'block', 'none']}>&copy; 2023 - 2024, All Rights Reserved</Text>
  </Box>
  )
}

export default Footer
