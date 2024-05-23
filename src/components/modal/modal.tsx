import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, FormControl, Box, Text, Input, InputGroup, InputRightElement, IconButton } from '@chakra-ui/react';
import { useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import '../../index.css'

// @ts-ignore
const modal = ({ isOpen, onClose, onSubmit = () => {}, modalConfig, emailConfig, toggleModal, googleSignUp, facebookSignUp, subtitleText, modalContext, showEmailSignUp, createReader, readReader }: any) => {

    const [formData, setFormData] = useState({ email: '', password: '', username:  '' });

    const [showPassword, setShowPassword] = useState(false); 

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (modalContext === 'signup') {
          await createReader(formData.username, formData.email, formData.password, onSubmit);

          // onSubmit(formData);
          resetForm();
        }
        if (modalContext === 'signin') {
          await readReader(formData.email, formData.password, onSubmit);

          resetForm();
        }
        
    };

    const resetForm = () => {
        setFormData({ email: '', password: '', username: '' });
    };

    // const { getSubtitleAndContext } = emailConfig;

    // if (getSubtitleAndContext && typeof getSubtitleAndContext === 'function') {
    //   const { subtitleText, modalContext } = getSubtitleAndContext(modalConfig);
    //   console.log("Subtitle Text:", subtitleText);
    //   console.log("Modal Context:", modalContext);
    // }




    const renderModalContent = () => {
      // const { subtitleText, modalContext } = emailConfig;
        if (showEmailSignUp) {
          // Render email sign-up content
          return (
            <ModalBody pb={6} display='flex' flexDir='column' gap='35px' w='100%' alignItems='center' justifyContent='center' >
              <ModalHeader fontSize={['medium', 'x-large']} mt='20px'>{modalContext === 'signin' ? 'Sign in with Email' : 'Sign up with Email'}</ModalHeader>
              <FormControl display='flex' flexDir='column' gap='20px' w='100%' alignItems='center' justifyContent='center'>
                <Text as='p'>{subtitleText}</Text>
                <Box display='flex' flexDir='column' gap='15px' w={['100%', '80%']} mx='auto'>
                  {modalContext === 'signup' && (
                    <Input variant='outline' type='text' id='Username' placeholder='Your username' width={['100%', '80%']} margin='auto' textAlign='center' focusBorderColor='whiteAlpha' _hover={{ outline: 'none', border: 'none' }} _focus={{ outline: 'none', background: 'transparent', }} _focusWithin={{ outline: 'none', background: 'transparent', }} _active={{ outline: 'none', background: 'transparent', }} autoComplete="one-time-code" onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                  )}
                  <Input variant='outline' type='email' id='Email' placeholder='Your email' width={['100%', '80%']} margin='auto' textAlign='center' focusBorderColor='whiteAlpha' _hover={{ outline: 'none', border: 'none' }} _focus={{ outline: 'none', background: 'transparent', }} _focusWithin={{ outline: 'none', background: 'transparent', }} _active={{ outline: 'none', background: 'transparent', }} autoComplete="one-time-code" onChange={(e) => setFormData({ ...formData, email: e.target.value })} ></Input>
                  <InputGroup width={['100%', '80%']} display='flex' gap='2px' margin='auto' >
                    <Input variant='outline' type={showPassword ? 'text' : 'password'} id='Password' placeholder='Your password' w='100%'  textAlign='center' focusBorderColor='whiteAlpha' _hover={{ outline: 'none', border: 'none' }} _focus={{ outline: 'none', background: 'transparent' }} _autofill={{ outline: 'none', background: 'transparent' }} autoComplete="one-time-code" onChange={(e) => setFormData({ ...formData, password: e.target.value })} ></Input> 
                    <InputRightElement border='0'><IconButton  aria-label={showPassword ? "Show password" : "Hide password"} icon={showPassword ? <PiEyeClosed /> : <PiEye />} onClick={togglePasswordVisibility} variant="ghost" color="gray" border='0px' _hover={{ border: '0px',}} _active={{ border: '0px',}} /></InputRightElement>
                  </InputGroup>
                  <Text as='p' color='green' fontSize={['smaller', 'small']} textAlign='left' ml={['0px', '35px']} >Password must be at least 8 characters long</Text>
                  <Button w={['80%', '60%']} mx='auto' background='blue' textColor='white' rounded='20px' _hover={{ background: 'blue.300' }} onClick={handleSubmit}>Continue</Button>
                </Box>
                <Text as='p'  mx='auto' display='flex' gap='5px' color='green' alignItems='center' textAlign='center' cursor='pointer' onClick={() => toggleModal(modalContext === "signin" ? "signin" : "signup")}><IoIosArrowBack /> {modalContext === 'signin' ? 'All sign in options' : 'All sign up options'}</Text>
              </FormControl>
            </ModalBody>
            
          );
        } else {
            // const { buttons, texts } = modalConfig;

          return (
            <ModalBody pb={6} display='flex' flexDir='column' gap='35px' w='100%' alignItems='center' justifyContent='center' >
              <ModalHeader fontSize={['medium', 'x-large']} mt='20px'>{modalConfig.title}</ModalHeader>
              <FormControl display='flex' flexDir='column' gap='10px' w='100%' alignItems='center' justifyContent='center'>
                {modalConfig.buttons && modalConfig.buttons.map((button: any, index: number) => (
                  <Button 
                    key={index} 
                    type='submit' 
                    onClick={() => {switch (button.text) {
                      case 'Google':
                        googleSignUp();
                        break;
                      case 'Facebook':
                        facebookSignUp();
                        break;
                      case 'Email':
                        toggleModal('emailSignUp'); // Handle email sign-up separately
                        break;
                      default:
                        break;
                    }}} 
                    background='transparent' 
                    border='1px' 
                    borderColor='grey' 
                    width={['95%', '70%']} 
                    borderRadius='50px' 
                    display='flex' 
                    gap='15px' 
                  >
                    <Box gap='10px' display='flex' flexDir='row' alignItems='center' justifyContent='space-between'>
                      {button.icon}
                      <Text as='span'>{button.text}</Text>
                    </Box>
                  </Button>
                ))}
                {modalConfig.texts && modalConfig.texts.map((text: any, index: number) => (
                  <Text key={index} dangerouslySetInnerHTML={{ __html: text.content }} style={text.textStyles} onClick={() => toggleModal(text.configType)} />
                ))}
              </FormControl>
            </ModalBody>
            
          );
        }
      };





  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size={['xs', 'md', 'lg']} >
            <ModalOverlay backgroundColor='white' />
                <ModalContent boxShadow='dark-lg' gap='15px' alignItems='center' textAlign='center'> 
                    <ModalCloseButton />
                    {renderModalContent()}
            </ModalContent>
        </Modal>
    </div>
  )
}

export default modal