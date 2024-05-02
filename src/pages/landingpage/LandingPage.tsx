import { Box, Button, Image, Text, useBreakpointValue } from "@chakra-ui/react"
import { AnimatePresence, motion } from "framer-motion";
import reader from '../../assets/woman-using-digital-tablet-technology.jpg'
// import reader2 from '../../assets/woman-using-digital-tablet-technology.png'

const LandingPage = () => {
  const initialWidth = useBreakpointValue({ base: '25px', md: '35px' });
  const exitWidth = useBreakpointValue({ base: '25px', md: '35px' });
  const animateWidth = useBreakpointValue({ base: '50%', md: '35%' });
  const initialHeight = useBreakpointValue({ base: '25px', md: '35px' });
  const exitHeight = useBreakpointValue({ base: '25px', md: '35px' });
  const animateHeight = useBreakpointValue({ base: '25px', md: '35%' });

  return (
    <Box display='flex' flexDir='column' w='100%' alignItems='center' justifyContent='center' gap={['20px', '50px']}>
      <Box display='flex' flexDir='row' w='100%' h='auto' alignItems='center' justifyContent='space-between' textAlign='center' px={[ '4px', '40px' ]} py={[ '8px', '12px' ]} borderBottom='1px' borderBottomColor='lightgray'>
        <Text as='h1' fontWeight='500' cursor='pointer'>HiveHub</Text>
        <Box display='flex' gap={[ '10px', '20px' ]}>
          <Button px={[ '5px','10px']} borderRadius='250px' variant='ghost' fontWeight='400' colorScheme='none' cursor='pointer'>Sign in</Button>
          <Button px={[ '5px','10px']} borderRadius='250px' variant='solid' bg='black' color='white' colorScheme='black' fontWeight='400' cursor='pointer'>Start reading</Button>
        </Box>
      </Box>

      <Box display='flex' flexDir='row' w={['100%', '95%']} marginX='auto' pos='relative' alignItems='center' justifyContent={['center', 'space-between']} px={['2%', '3%']} py={['2%', '7%']} gap={['none', '60px']} >
        <motion.div initial={{ opacity: 1, y: -20, background: '#e5989b' }} animate={{ opacity: 0.5, y: 0, background: '#0077b6' }} exit={{ opacity: 1, y: -20, background: '#cdb4db' }} transition={{ type: 'tween', duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} className="ball" ></motion.div>
        <motion.div initial={{ opacity: 1, background: '#d8e2dc', width: initialWidth, height: initialHeight, borderRadius: '50%' }} animate={{ opacity: 0.5, background: '#b5179e', width: animateWidth, height: animateHeight, borderRadius: '10px' }} exit={{ opacity: 1, background: '#cdb4db', width: exitWidth, height: exitHeight, borderRadius: '50%' }} transition={{ type: 'tween', duration: 2.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} className="sphere" ></motion.div>
        <Box w={[ '100%', '75%' ]} display='flex' flexDir='column' gap='10px'>
          <Text as='h3' fontSize={['30px', '50px']} fontWeight='600' lineHeight='50px'>
            Embark on an Adventure
          </Text>
          <Text as='p' fontSize='larger' fontWeight='500' textColor='GrayText' lineHeight={['20px']}>
            Dive into Stories, Discover Insights, and Get Entertained!
          </Text>

          <Button w={['120px', '150px']} px='5px' borderRadius='250px' variant='solid' bg='black' color='white' colorScheme='black' fontWeight='400' cursor='pointer'>Start reading</Button>
        </Box>

        <AnimatePresence>
          <motion.div initial={{ opacity: 1, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 1, y: -5 }} transition={{ duration: 3.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} className="stupidChakraUI" >
            <Image src={reader} objectFit='cover' w='100%' h='auto' alt='reader' />
            {/* <Image src={reader2} objectFit='cover' alt="reader2"  /> */}
          </motion.div>
        </AnimatePresence>
        
        <Box></Box>
      </Box>
    </Box>
  )
}

export default LandingPage