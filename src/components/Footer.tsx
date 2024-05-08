import { Box } from '@chakra-ui/react'

const Footer = () => {
  return (
    <Box w='100%'>
      <footer>  
        <Box className="copyright">
          <p>&copy 2024 - HiveHub</p>
        </Box>
        <Box className="social">
          <a href="#" className="support">Contact Us</a>
          <a href="#" className="face">f</a>
          <a href="#" className="tweet">t</a>
          <a href="#" className="linked">in</a>
        </Box>
      </footer>
    </Box>
  )
}

export default Footer
