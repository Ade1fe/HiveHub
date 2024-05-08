import { Box, Text, Button } from '@chakra-ui/react'
// import { useState } from 'react';

const Header = ({ toggleModal }: any) => {
  
  return (
    <Box display='flex' flexDir='row' w='100%' h='auto' alignItems='center' justifyContent='space-between' textAlign='center' px={[ '4px', '40px' ]} py={[ '8px', '12px' ]} borderBottom='1px' borderBottomColor='lightgray'>
        <Text as='h1' fontWeight='500' cursor='pointer'>HiveHub</Text>
        <Box display='flex' gap={[ '10px', '20px' ]} textAlign='center'>
          <Box textAlign='center' alignItems='center' display='flex'>
            <Button px={[ '5px','15px']} fontWeight='500' variant='ghost' textAlign='center' cursor='pointer' _hover={{ color: 'black' }} onClick={() => toggleModal('signin')}>Sign in</Button>
          </Box>
          
          <Button px={[ '10px','15px']} borderRadius='250px' variant='solid' bg='black' color='white' colorScheme='black' fontWeight='400' cursor='pointer' fontSize={['12px', '15px']} textAlign='center' onClick={() => toggleModal('signup')}>Start reading</Button>
        </Box>

    </Box>
  )
}

export default Header

