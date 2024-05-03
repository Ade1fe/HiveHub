import { Box, Button, Image, Text, useBreakpointValue } from "@chakra-ui/react"
import { AnimatePresence, motion } from "framer-motion";
import reader from '../../assets/woman-using-digital-tablet-technology.png'
import { Header } from "../../components";
// import reader2 from '../../assets/woman-using-digital-tablet-technology.png'

const LandingPage = () => {
  const initialWidth = useBreakpointValue({ base: '25px', md: '35px' });
  const exitWidth = useBreakpointValue({ base: '25px', md: '35px' });
  const animateWidth = useBreakpointValue({ base: '50%', md: '25%' });
  const initialHeight = useBreakpointValue({ base: '25px', md: '25px' });
  const exitHeight = useBreakpointValue({ base: '25px', md: '25px' });
  const animateHeight = useBreakpointValue({ base: '25px', md: '25px' });

  return (
    <Box display='flex' flexDir='column' w='100%' alignItems='center' justifyContent='center' gap={['20px', '30px']}>
      <Header />

      <Box display='flex' flexDir={['column', 'row']} w={['100%', '95%']} marginX='auto' pos='relative' alignItems='center' justifyContent={['center', 'space-between']} px={['2%', '3%']} py={['2%', '7%']} gap={['40px', '60px']} overflow='hidden'>
        <motion.div initial={{ opacity: 1, y: -20, background: '#e5989b' }} animate={{ opacity: 0.5, y: 0, background: '#0077b6' }} exit={{ opacity: 1, y: -20, background: '#cdb4db' }} transition={{ type: 'tween', duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} className="ball" ></motion.div>
        <motion.div initial={{ opacity: 1, background: '#656d4a', width: initialWidth, height: initialHeight, borderRadius: '50%' }} animate={{ opacity: 0.5, background: '#b5179e', width: animateWidth, height: animateHeight, borderRadius: '10px' }} exit={{ opacity: 1, background: '#455e89', width: exitWidth, height: exitHeight, borderRadius: '50%' }} transition={{ type: 'tween', duration: 2.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} className="sphere" ></motion.div>

        <Box w={[ '100%', '75%' ]} display='flex' flexDir='column' gap='10px' className="text">
          <Text as='h3' fontSize={['40px', '50px']} fontWeight='600' lineHeight={['35px', '50px']}>
            Embark on an Adventure
          </Text>
          <Text as='p' fontSize='larger' fontWeight='500' textColor='GrayText' lineHeight={['20px']}>
            Dive into Captivating Stories, Discover Hidden Insights, and Immerse Yourself in Endless Entertainment!
          </Text>

          <Button w={['120px', '150px']} px='5px' borderRadius='250px' variant='solid' bg='black' color='white' colorScheme='black' fontWeight='400' cursor='pointer'>Start reading</Button>
        </Box>

        <AnimatePresence>
          <motion.div initial={{ opacity: 1, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 1, y: -5 }} transition={{ duration: 3.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} className="stupidChakraUI">
            <Image src={reader} objectFit='cover' w='100%' h='auto' alt='reader' />
          </motion.div>
        </AnimatePresence>
        

        <motion.div initial={{ opacity: 1, y: -20, background: '#aec3b0' }} animate={{ opacity: 0.5, y: 0, background: '#ff206e' }} exit={{ opacity: 1, y: -20, background: '#ff1654' }} transition={{ type: 'tween', duration: 1.6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} className="ball1" ></motion.div>
        <motion.div initial={{ opacity: 1, x: -20, background: '#ff1654' }} animate={{ opacity: 0.5, x: 0, background: '#e6ebe0' }} exit={{ opacity: 1, x: -20, background: '#6d2e46' }} transition={{ type: 'tween', duration: 1.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} className="ball2" ></motion.div>
        <motion.div initial={{ opacity: 1, y: -20, background: '#7ae582' }} animate={{ opacity: 0.5, y: 0, background: '#9db4c0' }} exit={{ opacity: 1, y: -20, background: '#fbff12' }} transition={{ type: 'tween', duration: 1.9, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} className="ball3" ></motion.div>
        <motion.div initial={{ opacity: 1, y: -20, background: '#fbff12', clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }} animate={{ opacity: 0.5, y: 0, background: '#0077b6' }} exit={{ opacity: 1, y: -20, background: '#3f4238' }} transition={{ type: 'tween', duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} className="star"></motion.div>
        <motion.div initial={{ opacity: 1, background: '#d8e2dc', width: '25px', height: initialWidth, borderRadius: '50%' }} animate={{ opacity: 0.5, background: '#b5179e', width: '25px', height: '60%', borderRadius: '10px' }} exit={{ opacity: 1, background: '#cdb4db', width: '25px', height: exitWidth, borderRadius: '50%' }} transition={{ type: 'tween', duration: 2.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} className="sphere1" ></motion.div>


        

        <motion.div initial={{ opacity: 1, y: -20, background: '#e5989b' }} animate={{ opacity: 0.5, y: 0, background: '#affc41' }} exit={{ opacity: 1, y: -20, background: '#ff1654' }} transition={{ type: 'tween', duration: 2.0, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} className="ball4" ></motion.div>
        <motion.div initial={{ opacity: 1, x: -20, background: '#ee6055', clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }} animate={{ opacity: 0.5, x: 0, background: '#fbff12' }} exit={{ opacity: 1, x: -20, background: '#662e9b' }} transition={{ type: 'tween', duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} className="star1"></motion.div>
      </Box>

      {/* <Box>

      </Box> */}
    </Box>
  )
}

export default LandingPage