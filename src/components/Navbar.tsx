import React, { useEffect, useState } from 'react';
import { Box, Text, Button, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Avatar } from '@chakra-ui/react';
import { auth } from '../firebase'; 
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  toggleModal: (modal: 'signin' | 'signup') => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleModal }) => {
  const [user, setUser] = useState<{ email: string | null, photoURL: string | null }>({ email: null, photoURL: null });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setUser({ email: user.email, photoURL: user.photoURL });
      } else {
        setUser({ email: null, photoURL: null });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); 
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const getMessage = () => {
    if (user.email === 'addypearl09@gmail.com' || user.email === 'tubi@gmail.com') {
      return 'Welcome admin';
    }
    return `Welcome ${user.email}`;
  };

  return (
    <Box display='flex' flexDir='row' w='100%' h='auto' alignItems='center' justifyContent='space-between' textAlign='center' px={['4px', '40px']} py={['8px', '12px']} borderBottom='1px' borderBottomColor='lightgray'>
      <Text as='h1' fontWeight='500' cursor='pointer'>HiveHub</Text>
      <Box display='flex' gap={['10px', '20px']} textAlign='center'>
        {user.email ? (
          <Menu>
            <MenuButton as={Button} variant='ghost' _hover={{ color: 'black' }}>
              <Box display='flex' alignItems='center' gap='10px'>
                {user.photoURL && <Avatar src={user.photoURL} size='sm' />}
                {getMessage()}
              </Box>
            </MenuButton>
            <MenuList>
              <MenuItem>{user.email}</MenuItem>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <Box display='flex' gap={['10px', '20px']} textAlign='center'>
            <Button px={['5px', '15px']} fontWeight='500' variant='ghost' textAlign='center' cursor='pointer' _hover={{ color: 'black' }} onClick={() => toggleModal('signin')}>Sign in</Button>
            <Button px={['10px', '15px']} borderRadius='250px' variant='solid' bg='black' color='white' colorScheme='black' fontWeight='400' cursor='pointer' fontSize={['12px', '15px']} textAlign='center' onClick={() => toggleModal('signup')}>Start reading</Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Navbar;
