import { Box, Button, Image, Text } from "@chakra-ui/react"
import { motion } from "framer-motion";
import reader from '../../assets/portrait-young-african-woman-with-laptop-white.png'


const LandingPage = () => {
  return (
    <Box display='flex' flexDir='column' w='100%' alignItems='center' justifyContent='center' gap='50px'>
      <Box display='flex' flexDir='row' w='100%' h='auto' alignItems='center' justifyContent='space-between' textAlign='center' px='40px' py='12px' borderBottom='1px' borderBottomColor='lightgray'>
        <Text as='h1' fontWeight='500' cursor='pointer'>HiveHub</Text>
        <Box display='flex' gap='20px'>
          <Button px='10px' borderRadius='250px' variant='ghost' fontWeight='400' colorScheme='none' cursor='pointer'>Sign in</Button>
          <Button px='10px' borderRadius='250px' variant='solid' bg='black' color='white' colorScheme='black' fontWeight='400' cursor='pointer'>Start reading</Button>
        </Box>
      </Box>

      <Box display='flex' flexDir='row' w='95%' marginX='auto' alignItems='center' justifyContent='space-between' px={['', '150px']} py={['', '90px']} gap='50px'>
        <Box boxSize='60%'>
          <Text as='h3' fontSize='xxx-large' fontWeight='600'>
            Embark on an Adventure
          </Text>
          <Text as='p' fontSize='larger' fontWeight='500'>
            Dive into Stories, Discover Insights, and Get Entertained!
          </Text>
        </Box>

        <Box as={motion.div} animate={{ y: [-10, 10, -10], repeatCount: '1000000000' }} transition='1.5s ease-in-out infinte' boxSize='sm' h='auto' alignItems='center' justifyContent='center'>
          <Image src={reader} objectFit='cover' alt='reader' />
        </Box>
        
        <Box></Box>
      </Box>
    </Box>
  )
}

export default LandingPage