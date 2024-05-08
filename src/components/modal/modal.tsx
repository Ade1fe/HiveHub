import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, FormControl, Box, Text } from '@chakra-ui/react';
import { useState } from 'react';

const modal = ({ isOpen, onClose, onSubmit, modalConfig, toggleModal  }: any) => {

    const { title, buttons, texts } = modalConfig;

    const [formData, setFormData] = useState({});

    const handleSubmit = (e: any) => {
        e.preventDefault();
        onSubmit(formData);

        resetForm();
    };

    const resetForm = () => {
        setFormData({});
    };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size={['xs', 'md', 'lg']} >
            <ModalOverlay backgroundColor='white' />
                <ModalContent boxShadow='dark-lg' gap='15px' alignItems='center' textAlign='center'>
                    
                    <ModalCloseButton />
                    <ModalBody pb={6} display='flex' flexDir='column' gap='35px' w='100%' alignItems='center' justifyContent='center' >
                        <ModalHeader fontSize={['medium', 'x-large']} mt='20px'>{title}</ModalHeader>
                        <FormControl display='flex' flexDir='column' gap='5px' w='100%' alignItems='center' justifyContent='center'>
                            {buttons && buttons.map((button: any, index: number) => (
                                <Button key={index} type='submit' onClick={button.onClick} background='transparent' border='1px' borderColor='grey' width={['95%', '70%']} borderRadius='50px' display='flex' gap='15px' >
                                    <Box gap='10px' display='flex' flexDir='row' alignItems='center' justifyContent='space-between'>
                                         {button.icon}
                                         <Text as='span'>{button.text}</Text>
                                     </Box>
                                </Button>
                            ))}

                        </FormControl>


                        {/* {texts.map((text: any, index: number) => (
                            <Text key={index} as='p' textAlign='center' {...text.textStyles} dangerouslySetInnerHTML={{ __html: text.content }} />
                        ))} */}

                        {modalConfig.texts.map((text: any, index: number) => (
                            <Text key={index} dangerouslySetInnerHTML={{ __html: text.content }} style={text.textStyles} onClick={() => toggleModal(text.configType)} />
                        ))}

                        
                        {/* {/* <Text as='p' textAlign='center' fontSize={['small', 'medium']}>Already have an account? <Text as='span' color='blue.300' fontWeight='500'>Sign in</Text></Text> */}

                        {/* <Text as='p' textAlign='center' mt='20px' w='70%' py='8px' px='5px' fontSize={['smaller', 'small']}>Click “Sign up” to agree to Hivehub’s <Text as='span' textDecor='underline'>Terms of Service</Text>and acknowledge that Hivehub <Text as='span' textDecor='underline'>Privacy Policy </Text>applies to you.</Text> */}
                        
                        {/* <ModalFooter background='white' display='flex' gap='30px'>
                            <Button type='submit' colorScheme='green' onClick={handleSubmit}>Save</Button>
                            <Button onClick={onClose}>Cancel</Button>
                        </ModalFooter> */}
                    </ModalBody>
            </ModalContent>
        </Modal>
    </div>
  )
}

export default modal
