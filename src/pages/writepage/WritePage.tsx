import React, { useState } from 'react';
import { Box, Button, Icon, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Textarea, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Circle,  FormControl, FormLabel } from '@chakra-ui/react';
import { FaCameraRetro, FaPlusCircle, FaVideo } from 'react-icons/fa';
import { ChromePicker } from 'react-color';


const WritePage: React.FC = () => {
  const [content, setContent] = useState('');
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [titleModalOpen, setTitleModalOpen] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [titleColor, setTitleColor] = useState('#000000');
  const [subtitleModalOpen, setSubtitleModalOpen] = useState(false);
  const [subtitleInput, setSubtitleInput] = useState('');
  const [subtitleColor, setSubtitleColor] = useState('#0000FF');

  const handleInsertLink = () => {
    setLinkModalOpen(true);
  };

  const handleAddLink = () => {
    setContent((prevContent) => prevContent + `\n[Link: ${linkInput}]`);
    setLinkInput('');
    setLinkModalOpen(false);
  };

  const handleAddImage = () => {
    setImageModalOpen(true);
  };

  const handleAddVideo = () => {
    setVideoModalOpen(true);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setVideoFile(file);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImageFile(file);
    }
  };

  const handleAddNewBlock = () => {
    setContent((prevContent) => prevContent + '\n[New Block]');
  };

  const handleAddTitle = () => {
    setTitleModalOpen(true);
  };

  const handleAddSubtitle = () => {
    setSubtitleModalOpen(true);
  };

  const handlePublish = () => {
    console.log('Published:', content);
    console.log('Uploaded image:', imageFile);
    console.log('Uploaded video:', videoFile); // Log uploaded video file
    // Reset content state or perform other actions as needed
    // setContent('');
    // setImageFile(null);
    // setVideoFile(null);
  };

  const handleLinkClick = (link: string) => {
    window.open(link, '_blank');
  };

  const renderContentWithLinks = () => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('[Link:')) {
        const link = line.substring(6, line.length - 1);
        return (
          <Text key={index} onClick={() => handleLinkClick(link)} color="blue" textDecoration="underline" cursor="pointer" fontSize="md">
            {link}
          </Text>
        );
      } else if (line === '[Image]' && imageFile) {
        const imageUrl = URL.createObjectURL(imageFile);
        return <img key={index} src={imageUrl} alt="Uploaded Image" style={{ maxWidth: '100%', maxHeight: '300px' }} />;
      } else if (line === '[Video]' && videoFile) {
        const videoUrl = URL.createObjectURL(videoFile);
        return <video key={index} controls style={{ maxWidth: '100%', maxHeight: '300px' }}><source src={videoUrl} type="video/mp4" /></video>;
      } else if (line === '[Title]') {
        return <Text key={index} fontSize="2xl" fontWeight="bold" color={titleColor}>{titleInput}</Text>;
      } else if (line === '[Subtitle]') {
        return <Text key={index} fontSize="lg" color={subtitleColor}>{subtitleInput}</Text>;
      } else {
        // Assuming line is a paragraph
        return <Text key={index} fontSize="sm">{line}</Text>;
      }
    });
  };

  const handleAddTitleConfirm = () => {
    setContent((prevContent) => prevContent + '\n[Title]');
    setTitleModalOpen(false);
    
  };

  const handleAddSubtitleConfirm = () => {
    setContent((prevContent) => prevContent + '\n[Subtitle]');
    setSubtitleModalOpen(false);
    
  };

  return (
    <Box p={4}>
      <Text fontSize="xl" fontWeight="bold" mb={4} color="black">Tell us your STORY</Text>

      <Menu>
        <MenuButton
          px={4}
          py={2}
          transition='all 0.2s'
          borderRadius='md'
          borderWidth='1px'
          _hover={{ bg: 'gray.400' }}
          _expanded={{ bg: 'blue.400' }}
          _focus={{ boxShadow: 'outline' }}
        >
          <Icon as={FaPlusCircle} boxSize={6} />
        </MenuButton>
        <MenuList>
          <MenuItem onClick={handleAddImage}><Icon as={FaCameraRetro} boxSize={6} /> Add Photo </MenuItem>
          <MenuItem onClick={handleAddVideo}><Icon as={FaVideo} boxSize={6} /> Add Video </MenuItem>
          <MenuDivider />
          <MenuItem onClick={handleInsertLink}>Insert Link</MenuItem>
          <MenuItem onClick={handleAddNewBlock}>Add New Block</MenuItem>
          <MenuItem onClick={handleAddTitle}>Add Title</MenuItem>
          <MenuItem onClick={handleAddSubtitle}>Add Subtitle</MenuItem>
        </MenuList>
      </Menu>

      <Box mt={4} shadow='md'>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder='Tell us your story'
          rows={10}
        />
      </Box>

      <Button mt={4} colorScheme="blue" onClick={handlePublish}>Publish</Button>

      <Modal isOpen={linkModalOpen} onClose={() => setLinkModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Link</ModalHeader>
          <ModalBody>
            <Input value={linkInput} onChange={(e) => setLinkInput(e.target.value)} placeholder="Enter link URL" />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddLink}>Add</Button>
            <Button onClick={() => setLinkModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={imageModalOpen} onClose={() => setImageModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Image</ModalHeader>
          <ModalBody>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => {
              setContent((prevContent) => prevContent + '\n[Image]');
              setImageModalOpen(false);
            }}>Add</Button>
            <Button onClick={() => setImageModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={videoModalOpen} onClose={() => setVideoModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Video</ModalHeader>
          <ModalBody>
            <Input type="file" accept="video/*" onChange={handleVideoChange} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => {
              setContent((prevContent) => prevContent + '\n[Video]');
              setVideoModalOpen(false);
            }}>Add</Button>
            <Button onClick={() => setVideoModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={titleModalOpen} onClose={() => setTitleModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Title</ModalHeader>
          <ModalBody>
            <Input value={titleInput} onChange={(e) => setTitleInput(e.target.value)} placeholder="Enter title" />
            <Box mt={4}>
              <FormControl>
                <FormLabel>Choose Title Color</FormLabel>
                <Circle size="32px" bg={titleColor} mb={2} />
                <ChromePicker color={titleColor} onChange={(color: { hex: React.SetStateAction<string>; }) => setTitleColor(color.hex)} />
              </FormControl>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddTitleConfirm}>Add</Button>
            <Button onClick={() => setTitleModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={subtitleModalOpen} onClose={() => setSubtitleModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Subtitle</ModalHeader>
          <ModalBody>
            <Input value={subtitleInput} onChange={(e) => setSubtitleInput(e.target.value)} placeholder="Enter subtitle" />
            <Box mt={4}>
              <FormControl>
                <FormLabel>Choose Subtitle Color</FormLabel>
                <Circle size="32px" bg={subtitleColor} mb={2} />
                <ChromePicker color={subtitleColor} onChange={(color: { hex: React.SetStateAction<string>; }) => setSubtitleColor(color.hex)} />
              </FormControl>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddSubtitleConfirm}>Add</Button>
            <Button onClick={() => setSubtitleModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Box mt={4} shadow='md'>
        {renderContentWithLinks()}
      </Box>
    </Box>
  );
}

export default WritePage;
