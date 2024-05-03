import { Box, Text, Button } from '@chakra-ui/react'

const navBar = () => {
  return (
    <Box display='flex' flexDir='row' w='100%' h='auto' alignItems='center' justifyContent='space-between' textAlign='center' px={[ '4px', '40px' ]} py={[ '8px', '12px' ]} borderBottom='1px' borderBottomColor='lightgray'>
        <Text as='h1' fontWeight='500' cursor='pointer'>HiveHub</Text>
        <Box display='flex' gap={[ '10px', '20px' ]}>
        <Button px={[ '5px','10px']} borderRadius='250px' variant='ghost' fontWeight='400' colorScheme='none' cursor='pointer'>Sign in</Button>
        <Button w={['120px', '150px']} px={[ '5px','10px']} borderRadius='250px' variant='solid' bg='black' color='white' colorScheme='black' fontWeight='400' cursor='pointer'>Start reading</Button>
        </Box>
    </Box>
  )
}

export default navBar