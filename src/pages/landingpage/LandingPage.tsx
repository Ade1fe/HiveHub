import { Box, Button, Image, keyframes, Text } from "@chakra-ui/react"
import { AnimatePresence, motion, Transition } from "framer-motion";
import reader from '../../assets/woman-using-digital-tablet-technology.png'

const animation = keyframes`
    initial={{ opacity: 1, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 1, y: -20 }}
`

const LandingPage = () => {
const bounceAnimation = `${animation} infinity 1.5s easeInOut reverse`

  return (
    <Box display='flex' flexDir='column' w='100%' alignItems='center' justifyContent='center' gap='50px'>
      <Box display='flex' flexDir='row' w='100%' h='auto' alignItems='center' justifyContent='space-between' textAlign='center' px='40px' py='12px' borderBottom='1px' borderBottomColor='lightgray'>
        <Text as='h1' fontWeight='500' cursor='pointer'>HiveHub</Text>
        <Box display='flex' gap='20px'>
          <Button px='10px' borderRadius='250px' variant='ghost' fontWeight='400' colorScheme='none' cursor='pointer'>Sign in</Button>
          <Button px='10px' borderRadius='250px' variant='solid' bg='black' color='white' colorScheme='black' fontWeight='400' cursor='pointer'>Start reading</Button>
        </Box>
      </Box>

      <Box display='flex' flexDir='row' w='95%' marginX='auto' alignItems='center' justifyContent='space-between' px={['', '3%']} py={['', '7%']} gap='60px'>
        <Box boxSize='75%' display='flex' flexDir='column' gap='10px'>
          <Text as='h3' fontSize='58px' fontWeight='600' lineHeight='50px' wordBreak='keep-all'>
            Embark on an Adventure
          </Text>
          <Text as='p' fontSize='larger' fontWeight='500' textColor='GrayText'>
            Dive into Stories, Discover Insights, and Get Entertained!
          </Text>

          <Button w='150px' px='10px' borderRadius='250px' variant='solid' bg='black' color='white' colorScheme='black' fontWeight='400' cursor='pointer'>Start reading</Button>
        </Box>

        <AnimatePresence>
          <motion.div initial={{ opacity: 1, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 1, y: -20 }} transition={{ duration: 3.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} className="stupidChakraUI" >
            <Image src={reader} objectFit='cover' alt='reader' />
          </motion.div>
        </AnimatePresence>
        
        <Box></Box>
      </Box>
    </Box>
  )
}

export default LandingPage